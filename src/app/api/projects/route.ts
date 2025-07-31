import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, domain, description, color, trackingId } = body

    if (!name || !url || !domain || !trackingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if domain is already registered to prevent duplicate projects
    const existingProject = await prisma.project.findFirst({
      where: {
        domain: domain.toLowerCase(),
        isActive: true
      }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: `Domain "${domain}" is already registered with another project. Each domain can only have one active project.` },
        { status: 409 }
      )
    }

    // Create project first
    const project = await prisma.project.create({
      data: {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        url,
        domain: domain.toLowerCase(),
        description: description || null,
        trackingId,
      },
    })

    // Add creator as project owner
    await prisma.projectMember.create({
      data: {
        id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        projectId: project.id,
        role: 'OWNER'
      }
    })

    const result = project

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find all projects where user is a member
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        members: {
          where: {
            userId: session.user.id
          },
          select: {
            role: true,
            joinedAt: true
          }
        },
        _count: {
          select: {
            events: true,
            members: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform to include user's role in each project
    const projectsWithRole = projects.map(project => ({
      ...project,
      userRole: project.members[0]?.role || 'VIEWER',
      userJoinedAt: project.members[0]?.joinedAt
    }))

    return NextResponse.json(projectsWithRole)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}