# ClickChutney Analytics Tracker Lambda

AWS Lambda function for processing ClickChutney analytics events and storing them in MongoDB.

## Features

- ✅ **Automatic Domain Verification** - Verifies domains on first analytics hit
- ✅ **Event Processing** - Processes and stores analytics events
- ✅ **Geolocation** - Adds country/city data to events
- ✅ **MongoDB Storage** - Efficient event storage
- ✅ **CORS Support** - Cross-origin request handling
- ✅ **Error Handling** - Comprehensive error handling and logging

## Setup

### 1. Environment Variables

Set the following environment variables in your Lambda function:

```bash
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/clickchutney
```

### 2. Build and Deploy

```bash
# Install dependencies
npm install

# Build the function
npm run build

# Package for deployment
npm run package

# Deploy to AWS Lambda
npm run deploy
```

### 3. API Gateway Setup

Create an API Gateway endpoint that triggers this Lambda function:

- **Method**: POST
- **Path**: `/api/analytics`
- **CORS**: Enabled for all origins
- **Body mapping**: Direct pass-through

## Request Format

The Lambda function expects requests in this format:

```json
{
  "trackingId": "cc_abc123",
  "domain": "example.com",
  "events": [
    {
      "trackingId": "cc_abc123",
      "event": "pageview",
      "domain": "example.com",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "sessionId": "session_123",
      "userId": "user_456",
      "data": {
        "url": "https://example.com/page",
        "title": "Page Title",
        "referrer": "https://google.com"
      },
      "userAgent": "Mozilla/5.0...",
      "url": "https://example.com/page",
      "referrer": "https://google.com"
    }
  ]
}
```

## Response Format

```json
{
  "success": true,
  "eventIds": ["event_id_1", "event_id_2"],
  "verified": true
}
```

## Database Schema

### Projects Collection

```javascript
{
  _id: ObjectId,
  trackingId: String,
  domain: String,
  url: String,
  isVerified: Boolean,
  verifiedAt: Date,
  userId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection

```javascript
{
  _id: ObjectId,
  projectId: String,
  type: String,
  data: Object,
  userAgent: String,
  ipAddress: String,
  country: String,
  city: String,
  createdAt: Date
}
```

## Geolocation

The function uses the `ipapi.co` service for IP geolocation:

- **Free Tier**: 1,000 requests per day
- **Timeout**: 3 seconds
- **Fallback**: Graceful degradation if service is unavailable

For production, consider upgrading to a paid geolocation service or using AWS's geolocation features.

## Error Handling

The function handles various error scenarios:

- Missing tracking ID → 400 Bad Request
- Project not found → 404 Not Found
- Database errors → 500 Internal Server Error
- Geolocation failures → Graceful degradation (no geo data)

## Monitoring

Monitor the function using:

- **CloudWatch Logs** - Function execution logs
- **CloudWatch Metrics** - Invocation count, duration, errors
- **X-Ray Tracing** - Request tracing (if enabled)

## Performance Considerations

- **Connection Reuse** - MongoDB connections are cached between invocations
- **Batch Processing** - Multiple events processed in single invocation
- **Async Operations** - Non-blocking geolocation lookups
- **Timeout Settings** - 30-second Lambda timeout recommended

## Security

- **CORS Headers** - Configurable origin restrictions
- **Environment Variables** - Secure credential storage
- **Input Validation** - Request payload validation
- **IP Filtering** - Optional IP-based restrictions

## Cost Optimization

- **Memory**: 256MB recommended for most workloads
- **Timeout**: 30 seconds
- **Provisioned Concurrency**: Consider for high-traffic applications
- **Reserved Capacity**: For predictable workloads

## Development

```bash
# Run locally with nodemon
npm run dev

# Run tests
npm test

# Build for production
npm run build
```