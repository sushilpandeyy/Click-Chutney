import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle both formats: single event and batch events (like AWS Lambda)
    let events: any[] = []
    let trackingId: string = ''
    let domain: string = ''

    if (body.events && Array.isArray(body.events)) {
      // Batch format from plugin
      events = body.events
      trackingId = body.trackingId
      domain = body.domain
    } else {
      // Single event format (legacy)
      const { trackingId: id, event, domain: dom, ...eventData } = body
      trackingId = id
      domain = dom
      events = [{
        trackingId: id,
        event: event || 'pageview',
        domain: dom,
        ...eventData
      }]
    }

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
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || undefined

    // Get geolocation data if IP address is available
    let geoData = { country: null, city: null }
    if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== '::1' && !ipAddress.startsWith('192.168.')) {
      try {
        const geoResponse = await fetch(`http://ipapi.co/${ipAddress}/json/`)
        if (geoResponse.ok) {
          const geo = await geoResponse.json()
          geoData = {
            country: geo.country_name || null,
            city: geo.city || null
          }
        }
      } catch (geoError) {
        console.log("Geolocation lookup failed, continuing without geo data")
      }
    }

    // Process each event in the batch
    const createdEvents = []
    
    for (const eventData of events) {
      try {
        // Extract event details
        const eventType = eventData.event || 'pageview'
        const eventDomain = eventData.domain || domain
        
        // Create the event
        const newEvent = await prisma.event.create({
          data: {
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId: project.id,
            type: eventType,
            data: {
              ...eventData.data,
              domain: eventDomain,
              timestamp: eventData.timestamp || new Date().toISOString(),
              sessionId: eventData.sessionId,
              userId: eventData.userId,
              url: eventData.url,
              referrer: eventData.referrer
            },
            userAgent: eventData.userAgent || userAgent,
            ipAddress: ipAddress,
            country: geoData.country,
            city: geoData.city,
            domain: eventDomain
          }
        })
        
        createdEvents.push(newEvent.id)
      } catch (eventError) {
        console.error("Error creating event:", eventError)
        // Continue processing other events
      }
    }

    return NextResponse.json({ 
      success: true, 
      eventIds: createdEvents,
      verified: project.isVerified || domain ? true : false,
      processed: createdEvents.length,
      total: events.length
    })

  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}