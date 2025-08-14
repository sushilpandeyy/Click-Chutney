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

    // Get user profile with related data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: {
          include: {
            stats: true
          }
        },
        accounts: {
          select: {
            providerId: true,
            providerAccountId: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate user statistics
    const totalProjects = user.projects.length
    const activeProjects = user.projects.filter(p => p.status === 'ACTIVE').length
    const totalEvents = user.projects.reduce((sum, project) => 
      sum + (project.stats?.totalEvents || 0), 0
    )

    const profile = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      githubId: user.githubId,
      githubLogin: user.githubLogin,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      statistics: {
        totalProjects,
        activeProjects,
        totalEvents,
        memberSince: user.createdAt
      },
      connectedAccounts: user.accounts
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email } = body

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    if (typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid input types' }, { status: 400 })
    }

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        githubLogin: true,
        emailVerified: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}