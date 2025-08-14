import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma, ProjectStatus } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
    }

    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has projects
    const existingProjects = await prisma.project.findMany({
      where: { userId: session.user.id }
    })

    if (existingProjects.length > 0) {
      return NextResponse.json({ 
        message: 'User already has projects',
        projectCount: existingProjects.length 
      })
    }

    // Create sample projects
    const projects = await Promise.all([
      prisma.project.create({
        data: {
          name: 'E-commerce Website',
          trackingId: `cc_${Date.now()}_1`,
          status: ProjectStatus.ACTIVE,
          userId: session.user.id,
          stats: {
            create: {
              totalEvents: 1250,
              uniqueVisitors: 342,
              pageViews: 896,
              sessions: 587,
              lastActivity: new Date()
            }
          }
        },
        include: { stats: true }
      }),
      prisma.project.create({
        data: {
          name: 'Portfolio Site',
          trackingId: `cc_${Date.now()}_2`,
          status: ProjectStatus.ACTIVE,
          userId: session.user.id,
          stats: {
            create: {
              totalEvents: 456,
              uniqueVisitors: 123,
              pageViews: 234,
              sessions: 189,
              lastActivity: new Date()
            }
          }
        },
        include: { stats: true }
      }),
      prisma.project.create({
        data: {
          name: 'Blog Platform',
          trackingId: `cc_${Date.now()}_3`,
          status: ProjectStatus.PENDING_SETUP,
          userId: session.user.id
        }
      })
    ])

    // Create sample analytics events for the first project
    const sampleEvents = [
      { event: 'page_view', url: '/home', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { event: 'button_click', url: '/products', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { event: 'form_submit', url: '/contact', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { event: 'page_view', url: '/about', timestamp: new Date(Date.now() - 1000 * 60 * 90) },
      { event: 'search', url: '/search', timestamp: new Date(Date.now() - 1000 * 60 * 120) }
    ]

    await Promise.all(
      sampleEvents.map(eventData =>
        prisma.analyticsEvent.create({
          data: {
            projectId: projects[0].id,
            trackingId: projects[0].trackingId,
            ...eventData,
            properties: { sample: true },
            userAgent: 'Mozilla/5.0 (Demo Data)',
            ip: '127.0.0.1',
            referrer: 'https://google.com'
          }
        })
      )
    )

    return NextResponse.json({
      message: 'Sample data created successfully',
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        trackingId: p.trackingId,
        stats: p.stats
      })),
      eventsCreated: sampleEvents.length
    })

  } catch (error) {
    console.error('Seed data creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create sample data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
    }

    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all user's projects and related data
    await prisma.analyticsEvent.deleteMany({
      where: {
        project: {
          userId: session.user.id
        }
      }
    })

    await prisma.projectStats.deleteMany({
      where: {
        project: {
          userId: session.user.id
        }
      }
    })

    const deletedProjects = await prisma.project.deleteMany({
      where: { userId: session.user.id }
    })

    return NextResponse.json({
      message: 'All user data cleared successfully',
      projectsDeleted: deletedProjects.count
    })

  } catch (error) {
    console.error('Data cleanup error:', error)
    return NextResponse.json({ 
      error: 'Failed to clear data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}