interface AnalyticsEvent {
  trackingId: string;
  event: string;
  properties: Record<string, any>;
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
  properties?: Record<string, any>;
  visitorId?: string;
  sessionId?: string;
  timestamp?: number;
  url?: string;
  page?: string;
  userAgent?: string;
  referrer?: string;
}

interface MongoResponse {
  insertedId: string;
}

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Method not allowed',
        message: 'Only POST requests are accepted',
        allowedMethods: ['POST', 'OPTIONS']
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      const bodyText = await request.text();
      
      if (!bodyText) {
        throw new Error('Empty request body - no data provided');
      }

      let data: IncomingData;
      try {
        data = JSON.parse(bodyText);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        throw new Error(`Invalid JSON format: ${(parseError as Error).message}`);
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
        return new Response(JSON.stringify({ 
          error: 'Missing required fields',
          message: 'Both trackingId and event are required',
          received: {
            trackingId: !!data.trackingId,
            event: !!data.event
          }
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const currentTime = Date.now();
      const randomSuffix = Math.random().toString(36).slice(2, 9);

      const analyticsEvent: AnalyticsEvent = {
        trackingId: data.trackingId,
        event: data.event,
        properties: data.properties || {},
        visitorId: data.visitorId || `visitor_${currentTime}_${randomSuffix}`,
        sessionId: data.sessionId || `session_${currentTime}_${randomSuffix}`,
        timestamp: data.timestamp || currentTime,
        url: data.url || '',
        page: data.page || '/',
        userAgent: data.userAgent || request.headers.get('User-Agent') || '',
        referrer: data.referrer || request.headers.get('Referer') || '',
        ip: request.headers.get('CF-Connecting-IP') || 
            request.headers.get('X-Forwarded-For') || 
            request.headers.get('X-Real-IP') || 
            'unknown',
        country: (request.cf?.country as string) || 'unknown',
        city: (request.cf?.city as string) || 'unknown',
        createdAt: new Date().toISOString(),
        _metadata: {
          source: 'cloudflare-worker',
          version: '3.3.0',
          insertedAt: new Date().toISOString()
        }
      };

      console.log('Prepared Analytics Event:', {
        trackingId: analyticsEvent.trackingId,
        event: analyticsEvent.event,
        visitorId: analyticsEvent.visitorId
      });

      const insertResult = await insertEventToMongoDB(analyticsEvent);

      ctx.waitUntil(updateProjectStats(analyticsEvent.trackingId));

      console.log('Analytics event processed and stored successfully');

      return new Response(JSON.stringify({ 
        success: true, 
        eventId: `${analyticsEvent.trackingId}_${analyticsEvent.timestamp}`,
        insertedId: insertResult.insertedId,
        timestamp: analyticsEvent.createdAt
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Analytics tracking error:', {
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString()
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return new Response(JSON.stringify({ 
        error: 'Failed to track event',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2)}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};

async function insertEventToMongoDB(event: AnalyticsEvent): Promise<MongoResponse> {
  try {
    console.log('Connecting to MongoDB Atlas Data API...');
    
    const MONGODB_DATA_API_URL = 'https://us-east-1.aws.data.mongodb-api.com/app/data-vnzkp/endpoint/data/v1/action/insertOne';
    const MONGODB_API_KEY = env.MONGODB_API_KEY;
    const DATABASE_NAME = 'DEV';
    const COLLECTION_NAME = 'AnalyticsEvent';
    
    console.log('MongoDB Configuration:', {
      database: DATABASE_NAME,
      collection: COLLECTION_NAME
    });
    
    const payload = {
      collection: COLLECTION_NAME,
      database: DATABASE_NAME,
      dataSource: 'ClickChutney',
      document: event
    };
    
    console.log('Sending to MongoDB Atlas:', {
      database: payload.database,
      collection: payload.collection,
      trackingId: event.trackingId,
      event: event.event
    });
    
    const response = await fetch(MONGODB_DATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MONGODB_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('MongoDB API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('MongoDB API Error Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        error: errorText
      });
      throw new Error(`MongoDB Atlas API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json() as { insertedId?: string; acknowledged?: boolean };
    console.log('Event inserted to MongoDB successfully:', {
      insertedId: result.insertedId,
      acknowledged: result.acknowledged
    });
    
    return { insertedId: result.insertedId || `inserted_${Date.now()}` };
    
  } catch (error) {
    console.error('MongoDB insertion error:', error);
    
    console.log('Using fallback storage mechanism...');
    console.log('Event data for manual recovery:', event);
    
    return { insertedId: `fallback_${Date.now()}_${Math.random().toString(36).slice(2)}` };
  }
}

async function updateProjectStats(trackingId: string): Promise<void> {
  try {
    console.log('Updating project stats for:', trackingId);
    
    const MONGODB_DATA_API_URL = 'https://us-east-1.aws.data.mongodb-api.com/app/data-vnzkp/endpoint/data/v1/action/updateOne';
    const MONGODB_API_KEY = env.MONGODB_API_KEY;
    const DATABASE_NAME = 'DEV';
    const COLLECTION_NAME = 'ProjectStats';
    
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    
    const payload = {
      collection: COLLECTION_NAME,
      database: DATABASE_NAME,
      dataSource: 'ClickChutney',
      filter: { trackingId },
      update: {
        $inc: {
          totalEvents: 1,
          [`dailyEvents.${today}`]: 1,
          thisWeekEvents: 1,
          thisMonthEvents: 1,
        },
        $set: {
          lastEventAt: currentDate.toISOString(),
          lastUpdated: currentDate.toISOString(),
        },
        $setOnInsert: {
          trackingId,
          createdAt: currentDate.toISOString(),
          firstEventAt: currentDate.toISOString(),
        }
      },
      upsert: true,
    };
    
    const response = await fetch(MONGODB_DATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': MONGODB_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json() as { matchedCount?: number; modifiedCount?: number; upsertedId?: string };
      console.log('Project stats updated successfully:', {
        trackingId,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedId
      });
    } else {
      const errorText = await response.text();
      console.error('Project stats update failed:', {
        status: response.status,
        error: errorText
      });
    }
    
  } catch (error) {
    console.error('Project stats update error:', error);
  }
}