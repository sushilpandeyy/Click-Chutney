const { MongoClient } = require('mongodb');

// Mock MongoDB first
jest.mock('mongodb', () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(),
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn().mockResolvedValue({
          _id: 'project-123',
          trackingId: 'cc_test123',
          domain: 'example.com',
          isVerified: true
        }),
        insertMany: jest.fn().mockResolvedValue({
          insertedIds: { 0: 'event-id-1' }
        }),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        find: jest.fn(() => ({
          limit: jest.fn(() => ({
            toArray: jest.fn().mockResolvedValue([])
          }))
        }))
      }))
    }))
  }))
}));

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({
    country_name: 'United States',
    city: 'New York'
  })
});

// Mock environment
process.env.DATABASE_URL = 'mongodb://test';

describe('Simple Lambda Test', () => {
  test('should handle basic request', async () => {
    // Add debug logging
    console.log = jest.fn();
    console.error = jest.fn();
    
    const handler = require('../plugin/lambda/analytics-tracker/index').handler;
    
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        trackingId: 'cc_test123',
        events: [{
          event: 'pageview',
          url: 'https://example.com/test',
          sessionId: 'session-123',
          timestamp: '2025-01-01T00:00:00.000Z'
        }]
      }),
      headers: {},
      requestContext: {
        identity: { sourceIp: '203.0.113.1' }
      }
    };

    const result = await handler(event);
    console.log('Result status:', result.statusCode);
    console.log('Result body:', result.body);
    
    if (result.statusCode !== 200) {
      const errorBody = JSON.parse(result.body);
      console.log('Error details:', errorBody);
    }
    
    expect(result.statusCode).toBe(200);
  });
});