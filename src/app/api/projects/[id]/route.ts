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
    const project = await prisma.project.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id 
      },
      include: {
        stats: true,
        _count: { select: { events: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { name, status } = await request.json()

    const project = await prisma.project.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id 
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updatedProject = await prisma.project.update({
      where: { id: resolvedParams.id },
      data: {
        ...(name && { name }),
        ...(status && { status }),
      },
      include: {
        stats: true,
        _count: { select: { events: true } }
      }
    })

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const project = await prisma.project.findFirst({
      where: { 
        id: resolvedParams.id,
        userId: user.id 
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete related data first
    await prisma.projectStats.deleteMany({
      where: { projectId: resolvedParams.id }
    })

    await prisma.analyticsEvent.deleteMany({
      where: { projectId: resolvedParams.id }
    })

    await prisma.project.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}