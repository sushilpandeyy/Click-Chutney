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

    // Get user projects with stats and recent events
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        stats: true,
        events: {
          take: 10,
          orderBy: { timestamp: 'desc' },
          select: {
            id: true,
            event: true,
            url: true,
            timestamp: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Calculate overall statistics
    const totalEvents = projects.reduce((sum, project) => 
      sum + (project.stats?.totalEvents || 0), 0
    )
    
    const totalPageViews = projects.reduce((sum, project) => 
      sum + (project.stats?.pageViews || 0), 0
    )

    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length
    const pendingProjects = projects.filter(p => p.status === 'PENDING_SETUP').length

    const summary = {
      totalProjects: projects.length,
      activeProjects,
      pendingProjects,
      totalEvents,
      totalPageViews,
      projects: projects.map(project => ({
        id: project.id,
        name: project.name,
        trackingId: project.trackingId,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        stats: project.stats ? {
          totalEvents: project.stats.totalEvents,
          uniqueVisitors: project.stats.uniqueVisitors,
          pageViews: project.stats.pageViews,
          sessions: project.stats.sessions,
          lastActivity: project.stats.lastActivity
        } : null,
        recentEvents: project.events
      }))
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('User projects fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const projectName = name.trim()
    if (projectName.length < 2 || projectName.length > 50) {
      return NextResponse.json({ 
        error: 'Project name must be between 2 and 50 characters' 
      }, { status: 400 })
    }

    // Check if user already has a project with this name
    const existingProject = await prisma.project.findFirst({
      where: {
        userId: session.user.id,
        name: projectName
      }
    })

    if (existingProject) {
      return NextResponse.json({ 
        error: 'You already have a project with this name' 
      }, { status: 409 })
    }

    // Generate a unique tracking ID
    const trackingId = `cc_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`

    // Create new project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        trackingId,
        userId: session.user.id,
        status: 'PENDING_SETUP'
      },
      include: {
        stats: true
      }
    })

    // Create initial project stats
    await prisma.projectStats.create({
      data: {
        projectId: project.id,
        totalEvents: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        sessions: 0
      }
    })

    return NextResponse.json({
      id: project.id,
      name: project.name,
      trackingId: project.trackingId,
      status: project.status,
      createdAt: project.createdAt,
      message: 'Project created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}