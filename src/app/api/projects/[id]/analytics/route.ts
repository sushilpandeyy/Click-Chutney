import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    // Get analytics data
    const [
      totalEvents,
      recentEvents,
      pageViews,
      uniqueSessions
    ] = await Promise.all([
      // Total events count
      prisma.event.count({
        where: { projectId }
      }),

      // Recent events
      prisma.event.findMany({
        where: { projectId },
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
          type: 'pageview'
        }
      }),

      // Unique sessions (approximate by counting unique sessionIds)
      prisma.event.groupBy({
        by: ['data'],
        where: { projectId },
        _count: true
      })
    ])

    // Process top pages from pageview events
    const pageViewEvents = await prisma.event.findMany({
      where: {
        projectId,
        type: 'pageview'
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
          pageVisits[url] = (pageVisits[url] || 0) + 1
        }
      }
    })

    // Get top 10 pages
    const topPages = Object.entries(pageVisits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([url, views]) => ({ url, views }))

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

    const analytics = {
      totalViews: pageViews,
      uniqueVisitors: uniqueVisitors.size,
      totalEvents,
      topPages,
      recentEvents: recentEvents.map(event => ({
        id: event.id,
        type: event.type,
        data: event.data,
        country: event.country,
        city: event.city,
        createdAt: event.createdAt.toISOString()
      }))
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