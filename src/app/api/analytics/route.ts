import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { trackingId, event, domain, ...eventData } = await request.json()

    if (!trackingId) {
      return NextResponse.json(
        { error: "Missing trackingId" },
        { status: 400 }
      )
    }

    // Find the project by tracking ID
    const project = await prisma.project.findUnique({
      where: { trackingId }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Auto-verify domain on first analytics hit if not already verified
    if (!project.isVerified && domain) {
      try {
        await prisma.project.update({
          where: { trackingId },
          data: {
            isVerified: true,
            verifiedAt: new Date()
          }
        })
      } catch (verifyError) {
        console.log("Auto-verification failed, continuing with event tracking")
      }
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || undefined
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.ip || undefined

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        projectId: project.id,
        type: event || 'pageview',
        data: {
          domain,
          ...eventData,
          timestamp: new Date().toISOString()
        },
        userAgent,
        ipAddress
      }
    })

    return NextResponse.json({ 
      success: true, 
      eventId: newEvent.id,
      verified: project.isVerified || domain ? true : false
    })

  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}