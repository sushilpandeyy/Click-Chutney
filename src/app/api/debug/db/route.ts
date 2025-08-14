import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
    }

    // Test database connection
    const userCount = await prisma.user.count()
    const projectCount = await prisma.project.count()
    const eventCount = await prisma.analyticsEvent.count()
    
    // Get sample user data
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        name: true,
        githubLogin: true,
        createdAt: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    })

    return NextResponse.json({
      database: 'connected',
      environment: process.env.NODE_ENV,
      counts: {
        users: userCount,
        projects: projectCount,
        events: eventCount
      },
      sampleUsers: users
    })

  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json({
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}