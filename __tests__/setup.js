// Jest setup file
// This file runs before each test

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Mock setTimeout and setInterval for consistent testing
jest.useFakeTimers();

// Global test helpers
global.createMockEvent = (overrides = {}) => ({
  httpMethod: 'POST',
  body: JSON.stringify({
    trackingId: 'cc_test123',
    events: []
  }),
  headers: {},
  requestContext: {
    identity: { sourceIp: '203.0.113.1' }
  },
  ...overrides
});

global.createMockProject = (overrides = {}) => ({
  _id: 'project-123',
  trackingId: 'cc_test123',
  domain: 'example.com',
  isVerified: true,
  verifiedAt: new Date(),
  ...overrides
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});