import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with projects and stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: {
          include: {
            stats: true,
            events: {
              take: 5,
              orderBy: { timestamp: 'desc' }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate statistics
    const totalProjects = user.projects.length
    const activeProjects = user.projects.filter(p => p.status === 'ACTIVE').length
    const pendingProjects = user.projects.filter(p => p.status === 'PENDING_SETUP').length
    
    const totalEvents = user.projects.reduce((sum, project) => 
      sum + (project.stats?.totalEvents || 0), 0
    )
    
    const totalPageViews = user.projects.reduce((sum, project) => 
      sum + (project.stats?.pageViews || 0), 0
    )
    
    const totalSessions = user.projects.reduce((sum, project) => 
      sum + (project.stats?.sessions || 0), 0
    )

    // Get recent activity from all projects
    const recentActivity = user.projects
      .flatMap(project => 
        project.events.map(event => ({
          id: event.id,
          event: event.event,
          url: event.url,
          timestamp: event.timestamp,
          projectName: project.name,
          projectId: project.id
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    // Calculate this month's stats
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const thisMonthEvents = await prisma.analyticsEvent.count({
      where: {
        project: {
          userId: session.user.id
        },
        timestamp: {
          gte: thisMonth
        }
      }
    })

    const overview = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        githubLogin: user.githubLogin,
        memberSince: user.createdAt
      },
      statistics: {
        totalProjects,
        activeProjects,
        pendingProjects,
        totalEvents,
        totalPageViews,
        totalSessions,
        thisMonthEvents
      },
      recentActivity,
      quickProjects: user.projects.slice(0, 3).map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        trackingId: project.trackingId,
        stats: project.stats
      }))
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error('Dashboard overview error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}