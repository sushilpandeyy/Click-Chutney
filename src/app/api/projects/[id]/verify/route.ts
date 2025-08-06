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
      // Extract and normalize domain from project URL for comparison
      const projectDomain = new URL(project.url).hostname.replace('www.', '').toLowerCase()
      
      // Create domain variants to check (both www and non-www)
      const domainVariants = [
        projectDomain,           // example.com
        `www.${projectDomain}`   // www.example.com (in case events came with www)
      ]
      
      // Check if we have any events from any of the domain variants
      const recentEvents = await prisma.event.findFirst({
        where: {
          projectId: project.id,
          domain: {
            in: domainVariants // Check for events from any domain variant
          },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!recentEvents) {
        // Get some debug info about what events we do have
        const anyEvents = await prisma.event.findFirst({
          where: {
            projectId: project.id,
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          },
          select: {
            domain: true,
            createdAt: true,
            type: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        const totalEvents = await prisma.event.count({
          where: {
            projectId: project.id
          }
        })
        
        let debugMessage = `No analytics events detected from ${projectDomain} in the last 24 hours.\n\n`
        
        if (anyEvents) {
          debugMessage += `❌ Found events from other domains:\n`
          debugMessage += `   Last event: ${anyEvents.type} from ${anyEvents.domain}\n`
          debugMessage += `   Time: ${anyEvents.createdAt.toLocaleString()}\n\n`
        } else if (totalEvents > 0) {
          debugMessage += `❌ Found ${totalEvents} total events for this project, but none in the last 24 hours.\n\n`
        } else {
          debugMessage += `❌ No events found for this project at all.\n\n`
        }
        
        debugMessage += `Please ensure:\n\n`
        debugMessage += `1. You've installed the ClickChutney code on ${projectDomain}\n`
        debugMessage += `2. The tracking ID "${project.trackingId}" is correct\n`
        debugMessage += `3. You've visited ${projectDomain} to generate events\n`
        debugMessage += `4. Wait 1-2 minutes after visiting your site\n\n`
        debugMessage += `💡 Open browser dev tools (F12) and look for:\n`
        debugMessage += `   "✅ ClickChutney: Initialized successfully"\n`
        debugMessage += `   "✅ ClickChutney: Successfully sent X events"`
        
        return NextResponse.json({
          success: false,
          error: debugMessage,
          verified: false,
          debug: {
            projectDomain,
            domainVariants,
            trackingId: project.trackingId,
            checkedTimeframe: '24 hours',
            totalEventsEver: totalEvents,
            lastEventFrom: anyEvents?.domain || 'none',
            lastEventTime: anyEvents?.createdAt || null
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