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

    // Attempt to verify by checking if the tracking code is installed
    try {
      const response = await fetch(project.url, {
        headers: {
          'User-Agent': 'ClickChutney-Verification/1.0'
        },
        timeout: 10000
      })
      
      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `Could not access website: ${response.status} ${response.statusText}`,
          verified: false
        })
      }

      const html = await response.text()
      
      // Check if tracking code is present - supports both npm package and script tag
      const hasTrackingId = html.includes(project.trackingId)
      const hasPluginCode = html.includes('click-chutney/analytics') || 
                           html.includes('clickchutney.min.js') ||
                           html.includes('ClickChutney.init') ||
                           html.includes('cc(') // for cc('init', 'trackingId')
      
      const hasTrackingCode = hasTrackingId && hasPluginCode

      if (!hasTrackingCode) {
        return NextResponse.json({
          success: false,
          error: "Tracking code not found on website. Please install the ClickChutney tracking code and try again.",
          verified: false
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
        message: "Project verified successfully! Analytics tracking is now active.",
        verified: true,
        verifiedAt: updatedProject.verifiedAt
      })

    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        error: `Could not verify website: ${fetchError instanceof Error ? fetchError.message : 'Network error'}`,
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