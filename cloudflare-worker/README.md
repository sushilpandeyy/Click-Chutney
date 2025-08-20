# ClickChutney Analytics Worker

Global Cloudflare Worker for high-performance analytics event collection.

## 🚀 Deployment

```bash
npm install
npx wrangler deploy
```

## 🌐 Endpoint

`https://analyticseventtracker.contact-sushilpandey.workers.dev`

## ✅ Features

- Global CDN with edge locations
- Full CORS support for any origin
- MongoDB Atlas integration
- Real-time event processing
- Automatic project statistics
- Graceful error handling

## 📊 Usage

```javascript
fetch('https://analyticseventtracker.contact-sushilpandey.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trackingId: 'your_project_id',
    event: 'page_view',
    properties: { page: '/' },
    url: 'https://example.com',
    visitorId: 'visitor_123',
    sessionId: 'session_456'
  })
});
```

## 🔧 Configuration

All MongoDB credentials are hardcoded in the worker for production use.

## 📋 Response Format

```json
{
  "success": true,
  "eventId": "project_id_timestamp",
  "insertedId": "mongodb_object_id",
  "timestamp": "2025-08-20T20:51:59.117Z",
  "metadata": {
    "country": "US",
    "city": "San Francisco",
    "userAgent": "Mozilla/5.0..."
  }
}
```