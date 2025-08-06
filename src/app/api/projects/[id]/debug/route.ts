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

    // Check if user has admin/owner permissions for this project
    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: session.user.id,
        role: {
          in: ['OWNER', 'ADMIN']
        }
      },
      include: {
        project: true
      }
    })

    if (!membership) {
      return NextResponse.json(
        { error: "Project not found or insufficient permissions" }, 
        { status: 404 }
      )
    }

    const project = membership.project

    // Get recent events for debugging
    const recentEvents = await prisma.event.findMany({
      where: {
        projectId: project.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      select: {
        id: true,
        type: true,
        domain: true,
        data: true,
        userAgent: true,
        ipAddress: true,
        country: true,
        city: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    // Get event counts by domain
    const eventsByDomain = await prisma.event.groupBy({
      by: ['domain'],
      where: {
        projectId: project.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    // Extract and normalize domain from project URL for comparison
    const projectDomain = new URL(project.url).hostname.replace('www.', '').toLowerCase()
    const domainVariants = [
      projectDomain,           
      `www.${projectDomain}`   
    ]

    const totalEvents = await prisma.event.count({
      where: {
        projectId: project.id
      }
    })

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        domain: projectDomain,
        url: project.url,
        trackingId: project.trackingId,
        isVerified: project.isVerified,
        verifiedAt: project.verifiedAt
      },
      verification: {
        expectedDomains: domainVariants,
        totalEvents,
        recentEvents: recentEvents.length,
        needsEventsFrom: domainVariants,
        hasEventsFrom: eventsByDomain.map(e => e.domain)
      },
      events: {
        recent: recentEvents,
        byDomain: eventsByDomain
      },
      debug: {
        last24Hours: recentEvents.length > 0,
        domains: recentEvents.map(e => e.domain).filter((v, i, a) => a.indexOf(v) === i),
        eventTypes: recentEvents.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i)
      }
    })

  } catch (error) {
    console.error("Error fetching debug info:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}