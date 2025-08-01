module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'plugin/lambda/**/*.js',
    'plugin/npm/analytics/src/**/*.{js,ts}',
    '!plugin/npm/analytics/node_modules/**',
    '!plugin/lambda/analytics-tracker/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 10000,
  verbose: true
};