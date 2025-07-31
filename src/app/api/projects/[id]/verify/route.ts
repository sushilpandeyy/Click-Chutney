import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
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

    // Check if project is already verified
    if (project.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Project is already verified",
        verified: true,
        verifiedAt: project.verifiedAt
      })
    }

    // Simple event-based verification: check if events came from the project's domain
    try {
      // Extract domain from project URL for comparison
      const projectDomain = new URL(project.url).hostname.replace('www.', '').toLowerCase()
      
      // Check if we have any events from the project's domain
      const recentEvents = await prisma.event.findFirst({
        where: {
          projectId: project.id,
          domain: projectDomain,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!recentEvents) {
        return NextResponse.json({
          success: false,
          error: `No analytics events detected from ${projectDomain} in the last 24 hours. Please ensure:\n\n` +
                 `1. You've installed the ClickChutney analytics code on ${projectDomain}\n` +
                 `2. The tracking ID "${project.trackingId}" is correct\n` +
                 `3. Someone has visited your website to generate events\n\n` +
                 `Events are being accepted from all domains (including localhost), but verification requires events from your registered domain: ${projectDomain}`,
          verified: false,
          debug: {
            projectDomain,
            trackingId: project.trackingId,
            checkedTimeframe: '24 hours'
          }
        })
      }

      // Verify the project
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: `Project verified successfully! We detected ${recentEvents.type} events from ${projectDomain}. Analytics tracking is now active.`,
        verified: true,
        verifiedAt: updatedProject.verifiedAt,
        debug: {
          projectDomain,
          lastEventType: recentEvents.type,
          lastEventTime: recentEvents.createdAt
        }
      })

    } catch (verificationError) {
      return NextResponse.json({
        success: false,
        error: `Verification failed: ${verificationError instanceof Error ? verificationError.message : 'Unknown error'}`,
        verified: false
      })
    }

  } catch (error) {
    console.error("Error verifying project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}