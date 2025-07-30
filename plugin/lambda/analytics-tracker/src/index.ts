import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { 
  getProjectByTrackingId, 
  updateProjectVerification, 
  insertEvents 
} from './database.js'
import { getGeoLocation } from './geo.js'
import { 
  AnalyticsEvent, 
  BatchAnalyticsRequest, 
  AnalyticsResponse, 
  EventDocument 
} from './types.js'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    }
  }

  try {
    // Parse request body
    const body: BatchAnalyticsRequest = JSON.parse(event.body || '{}')
    
    if (!body.trackingId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing trackingId' 
        })
      }
    }

    // Find project by tracking ID
    const project = await getProjectByTrackingId(body.trackingId)
    if (!project) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Project not found' 
        })
      }
    }

    // Auto-verify domain on first analytics hit if not already verified
    if (!project.isVerified && body.domain) {
      try {
        await updateProjectVerification(body.trackingId)
        console.log(`Auto-verified domain: ${body.domain}`)
      } catch (error) {
        console.warn('Auto-verification failed:', error)
      }
    }

    // Process events
    const eventDocuments: EventDocument[] = []
    const clientIP = getClientIP(event)

    // Get geolocation for the IP (if available)
    const geoData = clientIP ? await getGeoLocation(clientIP) : {}

    for (const analyticsEvent of body.events || []) {
      const eventDoc: EventDocument = {
        projectId: project._id,
        type: analyticsEvent.event,
        data: {
          ...analyticsEvent.data,
          sessionId: analyticsEvent.sessionId,
          userId: analyticsEvent.userId,
          url: analyticsEvent.url,
          referrer: analyticsEvent.referrer,
          timestamp: analyticsEvent.timestamp
        },
        userAgent: analyticsEvent.userAgent,
        ipAddress: clientIP,
        country: geoData.country,
        city: geoData.city,
        createdAt: new Date()
      }
      
      eventDocuments.push(eventDoc)
    }

    // Insert events into database
    const eventIds = eventDocuments.length > 0 
      ? await insertEvents(eventDocuments)
      : []

    const response: AnalyticsResponse = {
      success: true,
      eventIds,
      verified: project.isVerified || body.domain ? true : false
    }

    console.log(`Processed ${eventDocuments.length} events for project ${project._id}`)

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(response)
    }

  } catch (error) {
    console.error('Error processing analytics:', error)
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      })
    }
  }
}

function getClientIP(event: APIGatewayProxyEvent): string | undefined {
  // Try various headers to get the real client IP
  const headers = event.headers || {}
  
  return (
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    headers['x-client-ip'] ||
    event.requestContext?.identity?.sourceIp ||
    undefined
  )
}