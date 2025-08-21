import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db, ClientSession } from 'mongodb';

interface AnalyticsEvent {
  trackingId: string;
  event: string;
  properties: Record<string, unknown>;
  visitorId: string;
  sessionId: string;
  timestamp: number;
  url: string;
  page: string;
  userAgent: string;
  referrer: string;
  ip: string;
  country: string;
  city: string;
  createdAt: string;
  _metadata: {
    source: string;
    version: string;
    insertedAt: string;
  };
}

interface IncomingData {
  trackingId: string;
  event: string;
  properties?: Record<string, unknown>;
  visitorId?: string;
  sessionId?: string;
  timestamp?: number;
  url?: string;
  page?: string;
  userAgent?: string;
  referrer?: string;
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME || 'DEV';

let cachedClient: MongoClient | null = null;

async function connectToMongoDB(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    console.log('Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    
    if (!bodyText) {
      return NextResponse.json(
        { error: 'Empty request body - no data provided' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          }
        }
      );
    }

    let data: IncomingData;
    try {
      data = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format', message: (parseError as Error).message },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          }
        }
      );
    }
    
    console.log('Incoming Analytics Event:', {
      trackingId: data.trackingId,
      event: data.event,
      timestamp: new Date().toISOString()
    });
    
    if (!data.trackingId || !data.event) {
      console.error('Validation failed - missing required fields:', {
        trackingId: !!data.trackingId,
        event: !!data.event
      });
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Both trackingId and event are required',
        received: {
          trackingId: !!data.trackingId,
          event: !!data.event
        }
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      });
    }

    const currentTime = Date.now();
    const randomSuffix = Math.random().toString(36).slice(2, 9);

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const analyticsEvent: AnalyticsEvent = {
      trackingId: data.trackingId,
      event: data.event,
      properties: data.properties || {},
      visitorId: data.visitorId || `visitor_${currentTime}_${randomSuffix}`,
      sessionId: data.sessionId || `session_${currentTime}_${randomSuffix}`,
      timestamp: data.timestamp || currentTime,
      url: data.url || '',
      page: data.page || '/',
      userAgent: data.userAgent || request.headers.get('user-agent') || '',
      referrer: data.referrer || request.headers.get('referer') || '',
      ip: clientIp,
      country: (request as { geo?: { country?: string; city?: string } }).geo?.country || 'unknown',
      city: (request as { geo?: { country?: string; city?: string } }).geo?.city || 'unknown',
      createdAt: new Date().toISOString(),
      _metadata: {
        source: 'vercel-function',
        version: '1.0.0',
        insertedAt: new Date().toISOString()
      }
    };

    console.log('Prepared Analytics Event:', {
      trackingId: analyticsEvent.trackingId,
      event: analyticsEvent.event,
      visitorId: analyticsEvent.visitorId
    });

    const client = await connectToMongoDB();
    const db = client.db(DATABASE_NAME);
    const session = client.startSession();
    
    try {
      let insertedId: string = '';
      
      await session.withTransaction(async () => {
        const project = await db.collection('Project').findOne(
          { trackingId: analyticsEvent.trackingId }, 
          { session }
        );
        
        if (!project) {
          throw new Error('Project not found for trackingId: ' + analyticsEvent.trackingId);
        }

        const eventWithProjectId = {
          ...analyticsEvent,
          projectId: project._id.toString()
        };

        const insertResult = await db.collection('AnalyticsEvent').insertOne(eventWithProjectId, { session });
        insertedId = insertResult.insertedId.toString();
        console.log('Event inserted to MongoDB:', insertedId);

        await updateProjectStatsInTransaction(analyticsEvent.trackingId, analyticsEvent.event, db, session);
      });

      console.log('Analytics event processed and stored successfully');

      return NextResponse.json({
        success: true,
        eventId: `${analyticsEvent.trackingId}_${analyticsEvent.timestamp}`,
        insertedId: insertedId,
        timestamp: analyticsEvent.createdAt
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      });

    } catch (transactionError) {
      console.error('Transaction failed:', transactionError);
      
      if (transactionError instanceof Error && transactionError.message.includes('Project not found')) {
        return NextResponse.json({
          error: 'Invalid tracking ID',
          message: 'Project not found for the provided tracking ID'
        }, { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          }
        });
      }

      return NextResponse.json({
        error: 'Failed to process event',
        message: 'Transaction failed during event processing'
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        }
      });
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('Analytics tracking error:', {
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString()
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      error: 'Failed to track event',
      message: errorMessage,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2)}`
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      }
    });
  }
}

async function updateProjectStatsInTransaction(trackingId: string, eventType: string, db: Db, session: ClientSession): Promise<void> {
  console.log('Updating project stats for:', trackingId, 'event:', eventType);
  
  const currentDate = new Date();
  
  const incOps: Record<string, number> = {
    totalEvents: 1,
  };
  
  const setOnInsertOps: Record<string, unknown> = {
    trackingId,
    uniqueVisitors: 0,
    uniqueSessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    createdAt: currentDate,
    firstEventAt: currentDate,
  };

  if (eventType === 'page_view') {
    incOps.pageviews = 1;
    incOps.todayEvents = 1;
    incOps.thisWeekEvents = 1;
    incOps.thisMonthEvents = 1;
  } else {
    setOnInsertOps.pageviews = 0;
    setOnInsertOps.todayEvents = 0;
    setOnInsertOps.thisWeekEvents = 0;
    setOnInsertOps.thisMonthEvents = 0;
  }

  const updateOps = {
    $inc: incOps,
    $set: {
      lastActivity: currentDate,
      lastEventAt: currentDate,
      updatedAt: currentDate,
    },
    $setOnInsert: setOnInsertOps
  };

  const updateResult = await db.collection('ProjectStats').updateOne(
    { trackingId },
    updateOps,
    { upsert: true, session }
  );

  console.log('Project stats updated successfully:', {
    trackingId,
    eventType,
    matched: updateResult.matchedCount,
    modified: updateResult.modifiedCount,
    upserted: updateResult.upsertedId
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}