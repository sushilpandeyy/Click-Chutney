const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      await cachedClient.connect();
    }

    cachedDb = cachedClient.db();
    return cachedDb;
  } catch (error) {
    console.error('Database connection failed:', error);
    cachedClient = null;
    cachedDb = null;
    throw error;
  }
}

async function getGeoLocation(ip) {
  try {
    // Skip private/local IPs
    if (isPrivateIP(ip)) return {};

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ClickChutney-Analytics/1.0' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) return {};
    
    const data = await response.json();
    return {
      country: data.country_name || undefined,
      city: data.city || undefined
    };
  } catch (error) {
    console.warn('Geolocation lookup failed:', error);
    return {};
  }
}

function isPrivateIP(ip) {
  const privateRanges = [
    /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
    /^::1$/, /^fc00:/, /^fe80:/
  ];
  return privateRanges.some(range => range.test(ip));
}

function getClientIP(event) {
  const headers = event.headers || {};
  return (
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['x-real-ip'] ||
    headers['x-client-ip'] ||
    event.requestContext?.identity?.sourceIp ||
    undefined
  );
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Validate event structure
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Request body is required' 
        })
      };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body' 
        })
      };
    }
    
    if (!body.trackingId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing trackingId' 
        })
      };
    }

    // Connect to database and find project
    const db = await connectToDatabase();
    const projects = db.collection('projects');
    const project = await projects.findOne({ trackingId: body.trackingId });

    if (!project) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Project not found' 
        })
      };
    }

    // Allow unverified projects to track events for verification purposes
    // but mark them appropriately in the response
    const allowTracking = project.isVerified || true; // Always allow for verification
    
    if (!allowTracking) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Project not found or inactive.' 
        })
      };
    }

    // Process events
    const events = body.events || [];
    if (events.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: true, 
          eventIds: [],
          verified: project.isVerified
        })
      };
    }

    const clientIP = getClientIP(event);
    const geoData = clientIP ? await getGeoLocation(clientIP) : {};

    // Extract and normalize domain from event URL for verification purposes
    function extractDomain(url) {
      if (!url) return null;
      try {
        const urlObj = new URL(url);
        // Always normalize to non-www version for consistent storage
        return urlObj.hostname.replace(/^www\./, '').toLowerCase();
      } catch {
        return null;
      }
    }

    // Prepare event documents
    const eventDocuments = events.map(analyticsEvent => {
      const eventDomain = extractDomain(analyticsEvent.url);
      
      return {
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
        domain: eventDomain, // Store the domain for verification
        createdAt: new Date()
      };
    });

    // Insert events
    const eventsCollection = db.collection('events');
    const result = await eventsCollection.insertMany(eventDocuments);
    const eventIds = Object.values(result.insertedIds).map(id => id.toString());

    console.log(`Processed ${eventDocuments.length} events for project ${project._id}`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        eventIds,
        verified: project.isVerified
      })
    };

  } catch (error) {
    console.error('Error processing analytics:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      })
    };
  }
};