import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get date range from query params (default to last 7 days)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get all projects user has access to
    const userProjectIds = await prisma.projectMember.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        projectId: true
      }
    }).then(members => members.map(m => m.projectId))

    if (userProjectIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalViews: 0,
          uniqueVisitors: 0,
          totalEvents: 0,
          avgSessionTime: 0,
          topPage: null,
          peakHour: null
        },
        dailyTraffic: [],
        countries: []
      })
    }

    // Get aggregate stats
    const [totalEvents, pageViews, allEvents] = await Promise.all([
      prisma.event.count({
        where: {
          projectId: { in: userProjectIds },
          createdAt: { gte: startDate }
        }
      }),
      
      prisma.event.count({
        where: {
          projectId: { in: userProjectIds },
          type: 'pageview',
          createdAt: { gte: startDate }
        }
      }),

      prisma.event.findMany({
        where: {
          projectId: { in: userProjectIds },
          createdAt: { gte: startDate }
        },
        select: {
          data: true,
          createdAt: true,
          type: true,
          country: true
        }
      })
    ])

    // Calculate unique visitors from session IDs
    const uniqueVisitors = new Set()
    const pageData: Record<string, number> = {}
    const hourData: Record<number, number> = {}
    const countryData: Record<string, number> = {}

    allEvents.forEach(event => {
      // Count unique visitors
      if (event.data && typeof event.data === 'object' && 'sessionId' in event.data) {
        const sessionId = (event.data as any).sessionId
        if (sessionId) {
          uniqueVisitors.add(sessionId)
        }
      }

      // Count page visits for top page
      if (event.type === 'pageview' && event.data && typeof event.data === 'object' && 'url' in event.data) {
        const url = (event.data as any).url
        if (url) {
          try {
            const path = new URL(url).pathname
            pageData[path] = (pageData[path] || 0) + 1
          } catch {
            pageData[url] = (pageData[url] || 0) + 1
          }
        }
      }

      // Count hourly traffic for peak hour
      const hour = event.createdAt.getHours()
      hourData[hour] = (hourData[hour] || 0) + 1

      // Count countries
      if (event.country) {
        countryData[event.country] = (countryData[event.country] || 0) + 1
      }
    })

    // Get top page
    const topPageEntry = Object.entries(pageData)
      .sort(([,a], [,b]) => b - a)[0]
    const topPage = topPageEntry ? topPageEntry[0] : null

    // Get peak hour
    const peakHourEntry = Object.entries(hourData)
      .sort(([,a], [,b]) => b - a)[0]
    const peakHour = peakHourEntry ? `${peakHourEntry[0]}:00` : null

    // Calculate session metrics
    const sessionMetrics = await calculateSessionMetrics(userProjectIds, startDate)

    // Get daily traffic data
    const dailyTraffic = generateDailyTraffic(allEvents.filter(e => e.type === 'pageview'), days)

    // Get top countries
    const countries = Object.entries(countryData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, visitors: count }))

    return NextResponse.json({
      stats: {
        totalViews: pageViews,
        uniqueVisitors: uniqueVisitors.size,
        totalEvents,
        avgSessionTime: sessionMetrics.avgDuration,
        topPage,
        peakHour
      },
      dailyTraffic,
      countries,
      dateRange: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function calculateSessionMetrics(projectIds: string[], startDate: Date) {
  const events = await prisma.event.findMany({
    where: {
      projectId: { in: projectIds },
      createdAt: { gte: startDate }
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
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)
    : 0

  return { avgDuration }
}

function generateDailyTraffic(pageViewEvents: any[], days: number) {
  const dailyCounts: Record<string, number> = {}
  
  // Initialize all days with 0
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyCounts[dateStr] = 0
  }
  
  // Count events by day
  pageViewEvents.forEach(event => {
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
}