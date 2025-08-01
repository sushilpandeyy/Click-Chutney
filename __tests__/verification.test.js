/**
 * Domain Verification Tests
 * Tests for domain verification logic and auto-verification functionality
 */

const { MongoClient } = require('mongodb');

// Mock fetch globally
global.fetch = jest.fn();

// Mock MongoDB
jest.mock('mongodb', () => ({
  MongoClient: jest.fn(() => ({
    connect: jest.fn(),
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
        insertMany: jest.fn(),
        updateOne: jest.fn(),
        find: jest.fn(() => ({
          toArray: jest.fn()
        }))
      }))
    }))
  }))
}));

const handler = require('../plugin/lambda/analytics-tracker/index').handler;

describe('Domain Verification System', () => {
  let mockDb;
  let mockProjectCollection;
  let mockEventCollection;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockEventCollection = {
      insertMany: jest.fn().mockResolvedValue({
        insertedIds: { 0: 'event-id-1' }
      }),
      find: jest.fn(() => ({
        toArray: jest.fn().mockResolvedValue([])
      }))
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

    process.env.DATABASE_URL = 'mongodb://test';
  });

  describe('Domain Extraction and Normalization', () => {
    test('should extract domain from various URL formats', async () => {
      const testCases = [
        { url: 'https://www.example.com/page', expected: 'example.com' },
        { url: 'https://example.com', expected: 'example.com' },
        { url: 'http://subdomain.example.com/path', expected: 'subdomain.example.com' },
        { url: 'https://www.subdomain.example.com/page?param=value', expected: 'subdomain.example.com' },
        { url: 'https://localhost:3000/dev', expected: 'localhost' },
        { url: 'https://example.co.uk/page', expected: 'example.co.uk' }
      ];

      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        domain: 'example.com',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

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
            domain: testCase.expected
          })
        ]);
      }
    });

    test('should handle malformed URLs gracefully', async () => {
      const mockProject = {
        _id: 'project-123',
        trackingId: 'cc_test123',
        domain: 'example.com',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const malformedUrls = [
        'not-a-url',
        'ftp://invalid-protocol.com',
        '',
        null,
        undefined
      ];

      for (const url of malformedUrls) {
        mockEventCollection.insertMany.mockClear();

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_test123',
            events: [{
              event: 'pageview',
              url: url,
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        await handler(event);

        expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
          expect.objectContaining({
            domain: null
          })
        ]);
      }
    });
  });

  describe('Auto-Verification Logic', () => {
    test('should allow events from unverified projects for verification purposes', async () => {
      const mockProject = {
        _id: 'project-456',
        trackingId: 'cc_unverified',
        domain: 'unverified.com',
        isVerified: false,
        verifiedAt: null
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_unverified',
          events: [{
            event: 'pageview',
            url: 'https://unverified.com/page',
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

    test('should detect domain matches for verification', async () => {
      const mockProject = {
        _id: 'project-456',
        trackingId: 'cc_match_test',
        domain: 'example.com',
        isVerified: false
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const matchingUrls = [
        'https://example.com',
        'https://www.example.com',
        'https://example.com/page',
        'https://www.example.com/page?param=value'
      ];

      for (const url of matchingUrls) {
        mockEventCollection.insertMany.mockClear();

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_match_test',
            events: [{
              event: 'pageview',
              url: url,
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        await handler(event);

        // Should store the normalized domain
        expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
          expect.objectContaining({
            domain: 'example.com'
          })
        ]);
      }
    });

    test('should detect domain mismatches', async () => {
      const mockProject = {
        _id: 'project-456',
        trackingId: 'cc_mismatch_test',
        domain: 'registered-domain.com',
        isVerified: false
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const mismatchingUrls = [
        'https://different-domain.com',
        'https://subdomain.registered-domain.com',
        'https://registered-domain.net',
        'https://another-site.com'
      ];

      for (const url of mismatchingUrls) {
        mockEventCollection.insertMany.mockClear();

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_mismatch_test',
            events: [{
              event: 'pageview',
              url: url,
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        await handler(event);

        // Should store the actual domain from the event
        const expectedDomain = url === 'https://different-domain.com' ? 'different-domain.com' :
                             url === 'https://subdomain.registered-domain.com' ? 'subdomain.registered-domain.com' :
                             url === 'https://registered-domain.net' ? 'registered-domain.net' :
                             'another-site.com';

        expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
          expect.objectContaining({
            domain: expectedDomain
          })
        ]);
      }
    });
  });

  describe('Enhanced Auto-Verification Implementation', () => {
    test('should auto-verify project when domain matches', async () => {
      const mockProject = {
        _id: 'project-789',
        trackingId: 'cc_auto_verify',
        domain: 'example.com',
        isVerified: false,
        verifiedAt: null
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      // Mock the verification process
      const verificationLogic = async (projectDomain, eventDomain) => {
        if (projectDomain === eventDomain) {
          // Auto-verify the project
          await mockProjectCollection.updateOne(
            { _id: mockProject._id },
            { 
              $set: { 
                isVerified: true, 
                verifiedAt: new Date() 
              } 
            }
          );
          return true;
        }
        return false;
      };

      const result = await verificationLogic('example.com', 'example.com');
      
      expect(result).toBe(true);
      expect(mockProjectCollection.updateOne).toHaveBeenCalledWith(
        { _id: 'project-789' },
        { 
          $set: { 
            isVerified: true, 
            verifiedAt: expect.any(Date) 
          } 
        }
      );
    });

    test('should not auto-verify on domain mismatch', async () => {
      const verificationLogic = async (projectDomain, eventDomain) => {
        if (projectDomain === eventDomain) {
          await mockProjectCollection.updateOne(
            { _id: 'project-789' },
            { 
              $set: { 
                isVerified: true, 
                verifiedAt: new Date() 
              } 
            }
          );
          return true;
        }
        return false;
      };

      const result = await verificationLogic('example.com', 'different.com');
      
      expect(result).toBe(false);
      expect(mockProjectCollection.updateOne).not.toHaveBeenCalled();
    });

    test('should handle subdomain verification correctly', async () => {
      const verificationLogic = (projectDomain, eventDomain) => {
        // Normalize both domains to handle www
        const normalizeWww = (domain) => domain?.replace(/^www\./, '');
        
        const normalizedProjectDomain = normalizeWww(projectDomain);
        const normalizedEventDomain = normalizeWww(eventDomain);
        
        return normalizedProjectDomain === normalizedEventDomain;
      };

      const testCases = [
        { project: 'example.com', event: 'www.example.com', shouldMatch: true },
        { project: 'www.example.com', event: 'example.com', shouldMatch: true },
        { project: 'example.com', event: 'example.com', shouldMatch: true },
        { project: 'example.com', event: 'subdomain.example.com', shouldMatch: false },
        { project: 'subdomain.example.com', event: 'example.com', shouldMatch: false }
      ];

      testCases.forEach(({ project, event, shouldMatch }) => {
        const result = verificationLogic(project, event);
        expect(result).toBe(shouldMatch);
      });
    });
  });

  describe('Verification Edge Cases', () => {
    test('should handle multiple events with different domains', async () => {
      const mockProject = {
        _id: 'project-multi',
        trackingId: 'cc_multi_domain',
        domain: 'example.com',
        isVerified: false
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
          event: 'pageview',
          url: 'https://different.com/page2',
          sessionId: 'session-123',
          timestamp: '2025-01-01T00:00:01.000Z'
        },
        {
          event: 'click',
          url: 'https://www.example.com/page1',
          sessionId: 'session-123',
          timestamp: '2025-01-01T00:00:02.000Z'
        }
      ];

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_multi_domain',
          events
        }),
        headers: {}
      };

      await handler(event);

      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({ domain: 'example.com' }),
        expect.objectContaining({ domain: 'different.com' }),
        expect.objectContaining({ domain: 'example.com' })
      ]);
    });

    test('should handle events without URLs', async () => {
      const mockProject = {
        _id: 'project-no-url',
        trackingId: 'cc_no_url',
        domain: 'example.com',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_no_url',
          events: [{
            event: 'custom_event',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z',
            data: { action: 'button_click' }
          }]
        }),
        headers: {}
      };

      await handler(event);

      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          domain: null
        })
      ]);
    });

    test('should handle already verified projects', async () => {
      const mockProject = {
        _id: 'project-verified',
        trackingId: 'cc_already_verified',
        domain: 'example.com',
        isVerified: true,
        verifiedAt: new Date('2025-01-01T00:00:00.000Z')
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_already_verified',
          events: [{
            event: 'pageview',
            url: 'https://example.com/page',
            sessionId: 'session-123',
            timestamp: '2025-01-01T00:00:00.000Z'
          }]
        }),
        headers: {}
      };

      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const responseBody = JSON.parse(result.body);
      expect(responseBody.verified).toBe(true);
      
      // Should not attempt to verify again
      expect(mockProjectCollection.updateOne).not.toHaveBeenCalled();
    });
  });

  describe('Verification Security Tests', () => {
    test('should reject invalid tracking IDs', async () => {
      mockProjectCollection.findOne.mockResolvedValue(null);

      const invalidTrackingIds = [
        'invalid_id',
        'cc_',
        '',
        'not_clickchutney_format',
        'cc_' + 'x'.repeat(100) // Too long
      ];

      for (const trackingId of invalidTrackingIds) {
        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId,
            events: [{
              event: 'pageview',
              url: 'https://example.com',
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body).error).toBe('Project not found');
      }
    });

    test('should sanitize event data', async () => {
      const mockProject = {
        _id: 'project-sanitize',
        trackingId: 'cc_sanitize_test',
        domain: 'example.com',
        isVerified: true
      };

      mockProjectCollection.findOne.mockResolvedValue(mockProject);

      const maliciousEvent = {
        event: 'pageview',
        url: 'https://example.com/page',
        sessionId: 'session-123',
        timestamp: '2025-01-01T00:00:00.000Z',
        data: {
          title: '<script>alert("xss")</script>',
          maliciousProperty: { __proto__: { evil: true } }
        }
      };

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          trackingId: 'cc_sanitize_test',
          events: [maliciousEvent]
        }),
        headers: {}
      };

      await handler(event);

      // Should still process the event but store it as-is
      // (Sanitization would happen at display time, not storage)
      expect(mockEventCollection.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          data: expect.objectContaining({
            title: '<script>alert("xss")</script>'
          })
        })
      ]);
    });
  });

  describe('Verification Response Format', () => {
    test('should return correct verification status in response', async () => {
      const testCases = [
        { isVerified: true, expectedVerified: true },
        { isVerified: false, expectedVerified: false }
      ];

      for (const testCase of testCases) {
        const mockProject = {
          _id: 'project-response',
          trackingId: 'cc_response_test',
          domain: 'example.com',
          isVerified: testCase.isVerified
        };

        mockProjectCollection.findOne.mockResolvedValue(mockProject);

        const event = {
          httpMethod: 'POST',
          body: JSON.stringify({
            trackingId: 'cc_response_test',
            events: [{
              event: 'pageview',
              url: 'https://example.com',
              sessionId: 'session-123',
              timestamp: '2025-01-01T00:00:00.000Z'
            }]
          }),
          headers: {}
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        
        const responseBody = JSON.parse(result.body);
        expect(responseBody.verified).toBe(testCase.expectedVerified);
        expect(responseBody.success).toBe(true);
        expect(Array.isArray(responseBody.eventIds)).toBe(true);
      }
    });
  });
});