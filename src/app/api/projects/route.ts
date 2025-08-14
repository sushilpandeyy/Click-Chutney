import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        stats: true,
        _count: { select: { events: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        trackingId: nanoid(12),
        userId: user.id,
      }
    })

    const projectWithStats = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        stats: true,
        _count: { select: { events: true } }
      }
    })

    return NextResponse.json({ project: projectWithStats }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}