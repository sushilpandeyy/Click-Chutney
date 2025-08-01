const { MongoClient } = require('mongodb');

// Import handler with proper error handling
let handler;
try {
  handler = require('../plugin/lambda/analytics-tracker/index').handler;
} catch (error) {
  console.error('Failed to import handler:', error);
  handler = async () => ({ statusCode: 500, body: JSON.stringify({ error: 'Handler import failed' }) });
}

// Mock fetch for the lambda function
global.fetch = jest.fn();

// Mock MongoDB
jest.mock('mongodb', () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
        insertMany: jest.fn(),
        updateOne: jest.fn()
      }))
    }))
  }))
}));

describe('Analytics Core Functions', () => {
  let mockDb;
  let mockProjectCollection;
  let mockEventCollection;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup MongoDB mocks
    mockEventCollection = {
      insertMany: jest.fn().mockResolvedValue({
        insertedIds: { 0: 'event-id-1', 1: 'event-id-2' }
      })
    };
    
    mockProjectCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
    };
    
    mockDb = {
      collection: jest.fn((name) => {
        if (name === 'events') return mockEventCollection;
        if (name === 'projects') return mockProjectCollection;
        return {};
      })
    };

    const MockMongoClient = MongoClient;
    MockMongoClient.mockImplementation(() => ({
      connect: jest.fn(),
      db: jest.fn(() => mockDb)
    }));

    // Mock environment
    process.env.DATABASE_URL = 'mongodb://test';
    
    // Mock fetch for geolocation
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        country_name: 'United States',
        city: 'New York'
      })
    });
  });

  describe('Lambda Function Core Tests', () => {
    test('should handle OPTIONS request (CORS preflight)', async () => {
      const event = {
        httpMethod: 'OPTIONS',
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    });

    test('should reject request without tracking ID', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ events: [] }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Missing trackingId');
    });

    test('should reject request for non-existent project', async () => {
      mockProjectCollection.findOne.mockResolvedValue(null);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_nonexistent',
          events: []
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      expect(JSON.parse(result.body).error).toBe('Project not found');
    });

    test('should process events for verified project', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        domain: 'example.com',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const testEvents = [
        {
          event: 'pageview',
          url: 'https://example.com/test',
          sessionId: 'session-123',
          userId: 'user-456',
          timestamp: '2025-01-01T00:00:00.000Z',
          userAgent: 'Mozilla/5.0',
          data: { title: 'Test Page' }
        }
      ];

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: testEvents
        }),
        headers: {
          'x-forwarded-for': '203.0.113.1'
        },
        requestContext: {
          identity: { sourceIp: '203.0.113.1' }
        }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.verified).toBe(true);
      expect(responseBody.eventIds).toHaveLength(1);
      
      // Verify event was inserted with correct structure
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          projectId: 'project-123',
          type: 'pageview',
          data: expect.objectContaining({
            sessionId: 'session-123',
            userId: 'user-456',
            url: 'https://example.com/test'
          }),
          ipAddress: '203.0.113.1',
          country: 'United States',
          city: 'New York',
          domain: 'example.com'
        })
      ]);
    });

    test('should process events for unverified project (allow for verification)', async () => {
      const mockProject = {
        _id: 'project-456',
        trackingId: 'cc_unverified',
        domain: 'unverified.com',
        isVerified: false
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_unverified',
          events: [{
            event: 'pageview',
            url: 'https://unverified.com',
            sessionId: 'session-789',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.verified).toBe(false);
      expect(mockEventCollection.insertMany).toHaveBeenCalled();
    });

    test('should handle geolocation failure gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: [{
            event: 'pageview',
            url: 'https://example.com',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {
          'x-forwarded-for': '203.0.113.1'
        }
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      // Should still process events even if geolocation fails
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          country: undefined,
          city: undefined
        })
      ]);
    });

    test('should extract domain correctly from URLs', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const testCases = [
        { url: 'https://www.example.com/page', expectedDomain: 'example.com' },
        { url: 'https://example.com', expectedDomain: 'example.com' },
        { url: 'http://subdomain.example.com/path', expectedDomain: 'subdomain.example.com' }
      ];

      for (const testCase of testCases) {
        mockEventCollection.insertMany.mockClear();

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_test123',
            events: [{
              event: 'pageview',
              url: testCase.url,
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        await handler(event);

        expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
          expect.objectContaining({
            domain: testCase.expectedDomain
          })
        ]);
      }
    });

    test('should handle malformed JSON in request body', async () => {
      const event = {
        httpMethod: 'POST',
        body: '{ invalid json',
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Invalid JSON in request body');
    });

    test('should handle missing request body', async () => {
      const event = {
        httpMethod: 'POST',
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Request body is required');
    });

    test('should handle database connection errors', async () => {
      // Mock database connection failure
      const MockMongoClient = MongoClient;
      MockMongoClient.mockImplementation(() => ({
        connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
        db: jest.fn()
      }));

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: []
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).error).toBe('Internal server error');
    });

    test('should skip geolocation for private IPs', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const privateIPs = ['127.0.0.1', '10.0.0.1', '192.168.1.1', '172.16.0.1'];

      for (const ip of privateIPs) {
        mockEventCollection.insertMany.mockClear();
        global.fetch.mockClear();

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_test123',
            events: [{
              event: 'pageview',
              url: 'https://example.com',
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {
            'x-forwarded-for': ip
          }
        };

        await handler(event);

        // Should not call geolocation API for private IPs
        expect(global.fetch).not.toHaveBeenCalled();
        
        expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
          expect.objectContaining({
            ipAddress: ip,
            country: undefined,
            city: undefined
          })
        ]);
      }
    });
  });

  describe('Auto-Verification Logic Tests', () => {
    test('should identify domain mismatch for verification', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        domain: 'registered-domain.com',
        isVerified: false
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: [{
            event: 'pageview',
            url: 'https://different-domain.com/page',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      // Should still process events but mark domain mismatch
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          domain: 'different-domain.com' // Actual domain from event
        })
      ]);
    });

    test('should handle events without URLs', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: [{
            event: 'custom_event',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z',
            data: { action: 'button_click' }
          }]
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          domain: null // No domain extractable
        })
      ]);
    });
  });

  describe('Event Processing Edge Cases', () => {
    test('should handle empty events array', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: []
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.eventIds).toEqual([]);
      expect(mockEventCollection.insertMany).not.toHaveBeenCalled();
    });

    test('should handle multiple events in single request', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const events = [
        {
          event: 'pageview',
          url: 'https://example.com/page1',
          sessionId: 'session-123',
          timestamp: '2025-01-01T00:00:00.000Z'
        },
        {
          event: 'click',
          url: 'https://example.com/page1',
          sessionId: 'session-123',
          timestamp: '2025-01-01T00:00:01.000Z',
          data: { element: 'button' }
        }
      ];

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const responseBody = JSON.parse(result.body);
      expect(responseBody.eventIds).toHaveLength(2);
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: 'pageview' }),
          expect.objectContaining({ type: 'click' })
        ])
      );
    });
  });

  describe('IP Address Extraction Tests', () => {
    test('should extract IP from x-forwarded-for header', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: [{
            event: 'pageview',
            url: 'https://example.com',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {
          'x-forwarded-for': '203.0.113.1, 198.51.100.1',
          'x-real-ip': '198.51.100.1'
        }
      };

      await handler(event);

      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          ipAddress: '203.0.113.1' // Should use first IP from x-forwarded-for
        })
      ]);
    });

    test('should fallback to x-real-ip if x-forwarded-for not available', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_test123',
          events: [{
            event: 'pageview',
            url: 'https://example.com',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {
          'x-real-ip': '203.0.113.1'
        }
      };

      await handler(event);

      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          ipAddress: '203.0.113.1'
        })
      ]);
    });
  });
});