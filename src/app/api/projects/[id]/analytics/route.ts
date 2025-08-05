import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function calculateSessionMetrics(projectId: string, startDate: Date) {
  const events = await prisma.event.findMany({
    where: {
      projectId,
      createdAt: {
        gte: startDate
      }
    },
    select: {
      data: true,
      createdAt: true,
      type: true
    }
  })

  const sessions: Record<string, { 
    start: Date, 
    end: Date, 
    pageViews: number 
  }> = {}

  events.forEach(event => {
    if (event.data && typeof event.data === 'object' && 'sessionId' in event.data) {
      const sessionId = (event.data as any).sessionId as string
      if (!sessions[sessionId]) {
        sessions[sessionId] = { 
          start: event.createdAt, 
          end: event.createdAt, 
          pageViews: 0 
        }
      } else {
        if (event.createdAt < sessions[sessionId].start) {
          sessions[sessionId].start = event.createdAt
        }
        if (event.createdAt > sessions[sessionId].end) {
          sessions[sessionId].end = event.createdAt
        }
      }
      
      if (event.type === 'pageview') {
        sessions[sessionId].pageViews++
      }
    }
  })

  const sessionArray = Object.values(sessions)
  const durations = sessionArray.map(session => 
    session.end.getTime() - session.start.getTime()
  ).filter(duration => duration > 0)

  const avgDuration = durations.length > 0 
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000) // Convert to seconds
    : 0

  // Calculate bounce rate (sessions with only 1 page view)
  const singlePageSessions = sessionArray.filter(session => session.pageViews <= 1).length
  const bounceRate = sessionArray.length > 0 
    ? Math.round((singlePageSessions / sessionArray.length) * 100) 
    : 0

  return { avgDuration, bounceRate }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: projectId } = await params

    // Verify user has access to this project
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: session.user.id
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: "Project not found or access denied" }, 
        { status: 404 }
      )
    }

    // Get date range from query params (default to last 7 days)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get analytics data
    const [
      totalEvents,
      recentEvents,
      pageViews
    ] = await Promise.all([
      // Total events count (within date range)
      prisma.event.count({
        where: { 
          projectId,
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Recent events
      prisma.event.findMany({
        where: { 
          projectId,
          createdAt: {
            gte: startDate
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          type: true,
          data: true,
          country: true,
          city: true,
          createdAt: true
        }
      }),

      // Page views (events with type 'pageview')
      prisma.event.count({
        where: { 
          projectId,
          type: 'pageview',
          createdAt: {
            gte: startDate
          }
        }
      })
    ])

    // Process top pages from pageview events
    const pageViewEvents = await prisma.event.findMany({
      where: {
        projectId,
        type: 'pageview',
        createdAt: {
          gte: startDate
        }
      },
      select: {
        data: true
      }
    })

    // Count page visits
    const pageVisits: Record<string, number> = {}
    pageViewEvents.forEach(event => {
      if (event.data && typeof event.data === 'object' && 'url' in event.data) {
        const url = (event.data as any).url
        if (url) {
          try {
            const path = new URL(url).pathname
            pageVisits[path] = (pageVisits[path] || 0) + 1
          } catch {
            // Handle invalid URLs
            pageVisits[url] = (pageVisits[url] || 0) + 1
          }
        }
      }
    })

    // Get top 10 pages
    const topPages = Object.entries(pageVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Calculate unique visitors (approximate from unique sessionIds)
    const uniqueVisitors = new Set()
    recentEvents.forEach(event => {
      if (event.data && typeof event.data === 'object' && 'sessionId' in event.data) {
        const sessionId = (event.data as any).sessionId
        if (sessionId) {
          uniqueVisitors.add(sessionId)
        }
      }
    })

    // Get daily traffic data for chart
    const dailyTraffic = await prisma.event.findMany({
      where: {
        projectId,
        type: 'pageview',
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true
      }
    }).then(events => {
      const dailyCounts: Record<string, number> = {}
      
      // Initialize all days with 0
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dailyCounts[dateStr] = 0
      }
      
      // Count events by day
      events.forEach(event => {
        const dateStr = event.createdAt.toISOString().split('T')[0]
        dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1
      })
      
      return Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          name: new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          visits: count,
          date
        }))
    })

    // Get countries data
    const countries = await prisma.event.findMany({
      where: {
        projectId,
        createdAt: {
          gte: startDate
        },
        country: {
          not: null
        }
      },
      select: {
        country: true
      }
    }).then(events => {
      const countryCounts: Record<string, number> = {}
      events.forEach(event => {
        if (event.country) {
          countryCounts[event.country] = (countryCounts[event.country] || 0) + 1
        }
      })
      
      return Object.entries(countryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([country, count]) => ({ country, visitors: count }))
    })

    // Calculate session metrics
    const sessionMetrics = await calculateSessionMetrics(projectId, startDate)

    const analytics = {
      stats: {
        totalViews: pageViews,
        uniqueVisitors: uniqueVisitors.size,
        totalEvents,
        avgSessionTime: sessionMetrics.avgDuration,
        bounceRate: sessionMetrics.bounceRate
      },
      topPages,
      dailyTraffic,
      countries,
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        type: event.type,
        data: event.data,
        country: event.country,
        city: event.city,
        createdAt: event.createdAt.toISOString()
      })),
      dateRange: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching project analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}