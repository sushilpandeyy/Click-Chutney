import { NextRequest, NextResponse } from 'next/server'
import { prisma, ProjectStatus } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface AnalyticsRequest {
  trackingId: string
  type: 'pageview' | 'event' | 'identify' | 'heartbeat'
  
  // Common fields
  url?: string
  page?: string
  title?: string
  referrer?: string
  userAgent?: string
  timestamp?: number
  sessionId?: string
  
  // Event-specific fields
  event?: string
  properties?: Record<string, unknown>
  
  // Identify fields
  userId?: string
  traits?: Record<string, unknown>
  
  // Pageview fields
  // (page, title already covered above)
  
  // Heartbeat fields
  sessionDuration?: number
  pageviews?: number
  
  // Browser/device context
  screen?: {
    width: number
    height: number
  }
  viewport?: {
    width: number
    height: number
  }
  timezone?: string
  language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsRequest = await request.json()

    // Validate required fields
    if (!body.trackingId || !body.type) {
      return NextResponse.json({ error: 'trackingId and type are required' }, { status: 400 })
    }

    // Validate type-specific requirements
    if (body.type === 'event' && !body.event) {
      return NextResponse.json({ error: 'event name is required for event type' }, { status: 400 })
    }

    if (body.type === 'identify' && !body.userId) {
      return NextResponse.json({ error: 'userId is required for identify type' }, { status: 400 })
    }

    // Find project
    const project = await prisma.project.findUnique({
      where: { trackingId: body.trackingId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 })
    }

    // Prepare event data based on type
    let eventName: string
    let eventProperties: Record<string, unknown> = {}

    switch (body.type) {
      case 'pageview':
        eventName = 'pageview'
        eventProperties = {
          page: body.page,
          title: body.title,
          referrer: body.referrer
        }
        break
      
      case 'event':
        eventName = body.event!
        eventProperties = body.properties || {}
        break
      
      case 'identify':
        eventName = 'identify'
        eventProperties = {
          userId: body.userId,
          traits: body.traits || {}
        }
        break
      
      case 'heartbeat':
        eventName = 'heartbeat'
        eventProperties = {
          sessionDuration: body.sessionDuration,
          pageviews: body.pageviews
        }
        break
      
      default:
        return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Add browser/device context to properties
    if (body.screen) eventProperties.screen = body.screen
    if (body.viewport) eventProperties.viewport = body.viewport
    if (body.timezone) eventProperties.timezone = body.timezone
    if (body.language) eventProperties.language = body.language
    if (body.sessionId) eventProperties.sessionId = body.sessionId

    // Create analytics event
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        projectId: project.id,
        trackingId: body.trackingId,
        event: eventName,
        properties: eventProperties as Prisma.JsonValue,
        url: body.url || null,
        userAgent: body.userAgent || request.headers.get('user-agent') || null,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        referrer: body.referrer || null,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date()
      }
    })

    // Update project stats
    try {
      const updateData: Record<string, unknown> = {
        totalEvents: { increment: 1 },
        lastActivity: new Date(),
      }
      
      // Increment pageviews for pageview events
      if (body.type === 'pageview') {
        updateData.pageViews = { increment: 1 }
      }

      await prisma.projectStats.upsert({
        where: { projectId: project.id },
        update: updateData,
        create: {
          projectId: project.id,
          totalEvents: 1,
          uniqueVisitors: 0,
          pageViews: body.type === 'pageview' ? 1 : 0,
          sessions: 0,
          lastActivity: new Date()
        }
      })

      // Activate project if it's pending setup
      if (project.status === ProjectStatus.PENDING_SETUP) {
        await prisma.project.update({
          where: { id: project.id },
          data: { status: ProjectStatus.ACTIVE }
        })
      }
    } catch (statsError) {
      console.error('Stats update failed:', statsError)
    }

    // Return success response with CORS headers
    const response = NextResponse.json({
      success: true,
      eventId: analyticsEvent.id,
      type: body.type
    })

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response
  } catch (error) {
    console.error('Analytics collection error:', error)
    const errorResponse = NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    errorResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return errorResponse
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}