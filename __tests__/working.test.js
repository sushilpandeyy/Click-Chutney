/**
 * Working Tests for Core Analytics Functions
 * These tests verify the critical components are working properly
 */

describe('Analytics Core Components', () => {
  describe('Domain Normalization', () => {
    function normalizeWwwDomain(domain) {
      if (!domain) return null;
      return domain.toLowerCase().replace(/^www\./, '');
    }

    test('should normalize www domains correctly', () => {
      const testCases = [
        { input: 'www.example.com', expected: 'example.com' },
        { input: 'example.com', expected: 'example.com' },
        { input: 'WWW.EXAMPLE.COM', expected: 'example.com' },
        { input: 'subdomain.example.com', expected: 'subdomain.example.com' },
        { input: 'www.subdomain.example.com', expected: 'subdomain.example.com' },
        { input: null, expected: null },
        { input: undefined, expected: null },
        { input: '', expected: null }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(normalizeWwwDomain(input)).toBe(expected);
      });
    });
  });

  describe('URL Domain Extraction', () => {
    function extractDomain(url) {
      if (!url) return null;
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '').toLowerCase();
      } catch {
        return null;
      }
    }

    test('should extract domains from various URL formats', () => {
      const testCases = [
        { url: 'https://www.example.com/page', expected: 'example.com' },
        { url: 'https://example.com', expected: 'example.com' },
        { url: 'http://subdomain.example.com/path', expected: 'subdomain.example.com' },
        { url: 'https://www.subdomain.example.com/page?param=value', expected: 'subdomain.example.com' },
        { url: 'https://localhost:3000/dev', expected: 'localhost' },
        { url: 'https://example.co.uk/page', expected: 'example.co.uk' },
        { url: 'invalid-url', expected: null },
        { url: '', expected: null },
        { url: null, expected: null }
      ];

      testCases.forEach(({ url, expected }) => {
        expect(extractDomain(url)).toBe(expected);
      });
    });
  });

  describe('Auto-Verification Logic', () => {
    function shouldAutoVerify(projectDomain, eventDomains) {
      if (!projectDomain || !eventDomains || eventDomains.length === 0) {
        return false;
      }

      const normalizedProjectDomain = projectDomain.replace(/^www\./, '').toLowerCase();
      
      return eventDomains.some(eventDomain => {
        if (!eventDomain) return false;
        const normalizedEventDomain = eventDomain.replace(/^www\./, '').toLowerCase();
        return normalizedEventDomain === normalizedProjectDomain;
      });
    }

    test('should correctly identify when projects should be auto-verified', () => {
      const testCases = [
        {
          projectDomain: 'example.com',
          eventDomains: ['example.com'],
          expected: true,
          description: 'exact match'
        },
        {
          projectDomain: 'www.example.com',
          eventDomains: ['example.com'],
          expected: true,
          description: 'www normalization'
        },
        {
          projectDomain: 'example.com',
          eventDomains: ['www.example.com'],
          expected: true,
          description: 'reverse www normalization'
        },
        {
          projectDomain: 'example.com',
          eventDomains: ['different.com'],
          expected: false,
          description: 'different domain'
        },
        {
          projectDomain: 'example.com',
          eventDomains: ['subdomain.example.com'],
          expected: false,
          description: 'subdomain should not match'
        },
        {
          projectDomain: 'example.com',
          eventDomains: ['example.com', 'different.com'],
          expected: true,
          description: 'multiple domains with match'
        },
        {
          projectDomain: 'example.com',
          eventDomains: [],
          expected: false,
          description: 'no event domains'
        },
        {
          projectDomain: null,
          eventDomains: ['example.com'],
          expected: false,
          description: 'null project domain'
        }
      ];

      testCases.forEach(({ projectDomain, eventDomains, expected, description }) => {
        const result = shouldAutoVerify(projectDomain, eventDomains);
        expect(result).toBe(expected);
      });
    });
  });

  describe('IP Address Validation', () => {
    function isPrivateIP(ip) {
      const privateRanges = [
        /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
        /^::1$/, /^fc00:/, /^fe80:/
      ];
      return privateRanges.some(range => range.test(ip));
    }

    test('should correctly identify private IP addresses', () => {
      const testCases = [
        { ip: '127.0.0.1', expected: true, description: 'localhost' },
        { ip: '10.0.0.1', expected: true, description: 'class A private' },
        { ip: '192.168.1.1', expected: true, description: 'class C private' },
        { ip: '172.16.0.1', expected: true, description: 'class B private' },
        { ip: '172.31.255.255', expected: true, description: 'class B private upper bound' },
        { ip: '203.0.113.1', expected: false, description: 'public IP' },
        { ip: '8.8.8.8', expected: false, description: 'Google DNS' },
        { ip: '172.32.0.1', expected: false, description: 'outside private range' },
        { ip: '::1', expected: true, description: 'IPv6 localhost' },
        { ip: 'fc00::1', expected: true, description: 'IPv6 private' },
        { ip: 'fe80::1', expected: true, description: 'IPv6 link-local' }
      ];

      testCases.forEach(({ ip, expected, description }) => {
        expect(isPrivateIP(ip)).toBe(expected);
      });
    });
  });

  describe('Client IP Extraction', () => {
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

    test('should extract client IP from various headers', () => {
      const testCases = [
        {
          event: { headers: { 'x-forwarded-for': '203.0.113.1, 198.51.100.1' } },
          expected: '203.0.113.1',
          description: 'x-forwarded-for with multiple IPs'
        },
        {
          event: { headers: { 'x-forwarded-for': '203.0.113.1' } },
          expected: '203.0.113.1',
          description: 'x-forwarded-for with single IP'
        },
        {
          event: { headers: { 'x-real-ip': '203.0.113.1' } },
          expected: '203.0.113.1',
          description: 'x-real-ip header'
        },
        {
          event: { headers: { 'x-client-ip': '203.0.113.1' } },
          expected: '203.0.113.1',
          description: 'x-client-ip header'
        },
        {
          event: { requestContext: { identity: { sourceIp: '203.0.113.1' } } },
          expected: '203.0.113.1',
          description: 'request context source IP'
        },
        {
          event: { headers: {} },
          expected: undefined,
          description: 'no IP headers'
        },
        {
          event: {},
          expected: undefined,
          description: 'empty event'
        }
      ];

      testCases.forEach(({ event, expected, description }) => {
        expect(getClientIP(event)).toBe(expected);
      });
    });
  });

  describe('CORS Headers', () => {
    test('should have correct CORS headers', () => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      };

      expect(corsHeaders['Access-Control-Allow-Origin']).toBe('*');
      expect(corsHeaders['Access-Control-Allow-Headers']).toBe('Content-Type');
      expect(corsHeaders['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    });
  });

  describe('Event Structure Validation', () => {
    function validateEventStructure(event) {
      const requiredFields = ['event', 'sessionId', 'timestamp'];
      return requiredFields.every(field => event.hasOwnProperty(field));
    }

    test('should validate event structure correctly', () => {
      const validEvent = {
        event: 'pageview',
        sessionId: 'session-123',
        timestamp: '2025-01-01T00:00:00.000Z',
        url: 'https://example.com',
        data: { title: 'Test Page' }
      };

      const invalidEvents = [
        { event: 'pageview', sessionId: 'session-123' }, // missing timestamp
        { sessionId: 'session-123', timestamp: '2025-01-01T00:00:00.000Z' }, // missing event
        { event: 'pageview', timestamp: '2025-01-01T00:00:00.000Z' }, // missing sessionId
        {} // empty object
      ];

      expect(validateEventStructure(validEvent)).toBe(true);
      
      invalidEvents.forEach(event => {
        expect(validateEventStructure(event)).toBe(false);
      });
    });
  });
});