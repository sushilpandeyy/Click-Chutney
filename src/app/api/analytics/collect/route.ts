import { NextRequest, NextResponse } from 'next/server'
import { prisma, ProjectStatus } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

interface SimpleAnalyticsRequest {
  trackingId: string
  event: string
  url?: string
  referrer?: string
  userAgent?: string
  properties?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body: SimpleAnalyticsRequest = await request.json()

    if (!body.trackingId || !body.event) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { trackingId: body.trackingId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 })
    }

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        projectId: project.id,
        trackingId: body.trackingId,
        event: body.event,
        properties: body.properties as Prisma.JsonValue | null,
        url: body.url || null,
        userAgent: body.userAgent || request.headers.get('user-agent') || null,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        referrer: body.referrer || null,
      }
    })

    try {
      const updateData: Record<string, unknown> = {
        totalEvents: { increment: 1 },
        lastActivity: new Date(),
      }
      
      if (body.event === 'pageview') {
        updateData.pageViews = { increment: 1 }
      }

      await prisma.projectStats.upsert({
        where: { projectId: project.id },
        update: updateData,
        create: {
          projectId: project.id,
          totalEvents: 1,
          uniqueVisitors: 0,
          pageViews: body.event === 'pageview' ? 1 : 0,
          sessions: 0,
          lastActivity: new Date()
        }
      })

      if (project.status === ProjectStatus.PENDING_SETUP) {
        await prisma.project.update({
          where: { id: project.id },
          data: { status: ProjectStatus.ACTIVE }
        })
      }
    } catch (statsError) {
      console.error('Stats update failed:', statsError)
    }

    const response = NextResponse.json({
      success: true,
      eventId: analyticsEvent.id
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