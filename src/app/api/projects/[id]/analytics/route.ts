import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

async function getUserFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    return session?.user
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

// GET /api/projects/[id]/analytics - Get project analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    const eventType = searchParams.get('eventType') || 'all'

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id 
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Build where clause
    const whereClause = {
      projectId: resolvedParams.id,
      timestamp: {
        gte: startDate,
        lte: now
      },
      ...(eventType !== 'all' && { event: eventType })
    }

    // Get analytics data
    const [
      totalEvents,
      uniqueSessions,
      pageviews,
      bounceRate,
      avgSessionDuration,
      topPages,
      topEvents,
      timeSeriesData,
      recentEvents,
      deviceStats,
      locationStats,
      referrerStats
    ] = await Promise.all([
      // Total events
      prisma.analyticsEvent.count({
        where: whereClause
      }),

      // Unique sessions
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: { properties: true, event: true },
        distinct: ['properties']
      }).then(events => {
        const sessionIds = new Set()
        events.forEach(event => {
          const properties = event.properties as Record<string, unknown>
          if (properties?.sessionId) {
            sessionIds.add(properties.sessionId)
          }
        })
        return sessionIds.size
      }),

      // Pageviews
      prisma.analyticsEvent.count({
        where: {
          ...whereClause,
          event: 'pageview'
        }
      }),

      // Bounce rate calculation
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: { properties: true, event: true }
      }).then(events => {
        const sessionPageviews = new Map()
        events.forEach(event => {
          const properties = event.properties as Record<string, unknown>
          if (properties?.sessionId && event.event === 'pageview') {
            sessionPageviews.set(
              properties.sessionId, 
              (sessionPageviews.get(properties.sessionId) || 0) + 1
            )
          }
        })
        const sessions = Array.from(sessionPageviews.values())
        const bouncedSessions = sessions.filter(count => count === 1).length
        return sessions.length > 0 ? (bouncedSessions / sessions.length) * 100 : 0
      }),

      // Average session duration
      prisma.analyticsEvent.findMany({
        where: {
          ...whereClause,
          event: 'heartbeat'
        },
        select: { properties: true, event: true }
      }).then(events => {
        const durations = events
          .map(event => {
            const properties = event.properties as Record<string, unknown>
            return typeof properties?.sessionDuration === 'number' ? properties.sessionDuration : 0
          })
          .filter(duration => duration > 0)
        
        return durations.length > 0 
          ? durations.reduce((a, b) => a + b, 0) / durations.length / 1000 // Convert to seconds
          : 0
      }),

      // Top pages
      prisma.analyticsEvent.groupBy({
        by: ['url'],
        where: {
          ...whereClause,
          event: 'pageview'
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),

      // Top events
      prisma.analyticsEvent.groupBy({
        by: ['event'],
        where: whereClause,
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),

      // Time series data (hourly for last 24h, daily for longer periods)
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: {
          timestamp: true,
          event: true
        },
        orderBy: {
          timestamp: 'asc'
        }
      }).then(events => {
        const isHourly = timeRange === '24h'
        const groupedData = new Map()
        
        events.forEach(event => {
          let key: string
          if (isHourly) {
            key = new Date(event.timestamp).toISOString().slice(0, 13) + ':00:00.000Z' // Group by hour
          } else {
            key = new Date(event.timestamp).toISOString().slice(0, 10) + 'T00:00:00.000Z' // Group by day
          }
          
          if (!groupedData.has(key)) {
            groupedData.set(key, { timestamp: key, pageviews: 0, events: 0 })
          }
          
          const data = groupedData.get(key)
          data.events++
          if (event.event === 'pageview') {
            data.pageviews++
          }
        })
        
        return Array.from(groupedData.values()).sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      }),

      // Recent events
      prisma.analyticsEvent.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc'
        },
        take: 50,
        select: {
          id: true,
          event: true,
          url: true,
          userAgent: true,
          ip: true,
          timestamp: true,
          properties: true
        }
      }),

      // Device stats
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: { userAgent: true }
      }).then(events => {
        const deviceTypes = new Map()
        events.forEach(event => {
          const ua = event.userAgent || ''
          let deviceType = 'Unknown'
          
          if (/Mobile|Android|iPhone|iPad/.test(ua)) {
            deviceType = 'Mobile'
          } else if (/Tablet|iPad/.test(ua)) {
            deviceType = 'Tablet'
          } else {
            deviceType = 'Desktop'
          }
          
          deviceTypes.set(deviceType, (deviceTypes.get(deviceType) || 0) + 1)
        })
        
        return Array.from(deviceTypes.entries()).map(([device, count]) => ({
          device,
          count,
          percentage: events.length > 0 ? (count / events.length) * 100 : 0
        }))
      }),

      // Location stats (simplified - based on IP would need GeoIP service)
      prisma.analyticsEvent.groupBy({
        by: ['ip'],
        where: whereClause,
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }).then(results => 
        results.map(item => ({
          location: item.ip === 'unknown' ? 'Unknown' : `IP: ${item.ip}`,
          count: item._count.id
        }))
      ),

      // Referrer stats
      prisma.analyticsEvent.findMany({
        where: {
          ...whereClause,
          event: 'pageview'
        },
        select: { referrer: true, properties: true }
      }).then(events => {
        const referrers = new Map()
        
        events.forEach(event => {
          const properties = event.properties as Record<string, unknown>
          const referrer = (typeof properties?.sessionReferrer === 'string' ? properties.sessionReferrer : event.referrer) || 'Direct'
          
          let source = 'Direct'
          if (referrer && referrer !== 'Direct') {
            try {
              const url = new URL(referrer)
              source = url.hostname
            } catch {
              source = 'Unknown'
            }
          }
          
          referrers.set(source, (referrers.get(source) || 0) + 1)
        })
        
        return Array.from(referrers.entries())
          .map(([source, count]) => ({ source, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      })
    ])

    const analytics = {
      summary: {
        totalEvents,
        uniqueSessions,
        pageviews,
        bounceRate: Math.round(bounceRate * 100) / 100,
        avgSessionDuration: Math.round(avgSessionDuration * 100) / 100
      },
      topPages: topPages.map(page => ({
        url: page.url,
        views: page._count.id
      })),
      topEvents: topEvents.map(event => ({
        event: event.event,
        count: event._count.id
      })),
      timeSeries: timeSeriesData,
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        event: event.event,
        url: event.url,
        timestamp: event.timestamp,
        properties: event.properties
      })),
      deviceStats,
      locationStats,
      referrerStats,
      timeRange,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}