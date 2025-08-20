# ClickChutney Analytics Platform

A modern web analytics platform that makes data collection and insights as enjoyable as Indian street food.

## 🎯 Overview

ClickChutney provides:
- **React/Next.js Analytics Component** - Easy copy-paste analytics tracking
- **Global Cloudflare Worker** - High-performance event collection
- **MongoDB Integration** - Secure data storage
- **Real-time Dashboard** - Analytics insights and project management

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Cloudflare Workers + Next.js API Routes  
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Better Auth with GitHub OAuth
- **Styling**: Tailwind CSS v4 with ClickChutney theme
- **Analytics Worker**: Global CDN deployment

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── analytics/collect/  # Event collection endpoint
│   │   │   ├── auth/[...all]/     # Authentication
│   │   │   └── projects/          # Project management
│   │   ├── dashboard/             # Analytics dashboard
│   │   │   ├── projects/[id]/     # Project details & tracking setup
│   │   │   ├── analytics/         # Analytics overview
│   │   │   ├── billing/           # Billing management  
│   │   │   └── settings/          # User settings
│   │   ├── globals.css           # ClickChutney theme
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components
│   │   ├── dashboard-layout.tsx  # Dashboard layout
│   │   └── project-create-modal.tsx
│   └── lib/                     # Utilities and configurations
│       ├── auth.ts              # Authentication config
│       ├── prisma.ts            # Database client
│       └── utils.ts             # Helper functions
├── cloudflare-worker/           # Global analytics worker
│   ├── src/index.ts            # Worker implementation
│   ├── wrangler.toml           # Deployment config
│   └── package.json            # Worker dependencies
├── prisma/schema.prisma        # Database schema
└── public/                     # Static assets
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
DATABASE_NAME="clickchutney_dev"

# Authentication  
BETTER_AUTH_SECRET="your-secret-key"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Add your environment variables
```

### 3. Setup Database
```bash
npm run db:generate
npm run db:push
```

### 4. Run Development
```bash
npm run dev
```

### 5. Deploy Worker (Optional)
```bash
cd cloudflare-worker
npm install
npx wrangler deploy
```

## 📊 Analytics Integration

### React/Next.js Component

Copy this component into your project:

```typescript
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnalyticsConfig {
  trackingId: string;
  endpoint: string;
  debug?: boolean;
}

const AnalyticsContext = createContext<any>(null);

export function Analytics({ children, config }: { 
  children: ReactNode; 
  config: AnalyticsConfig;
}) {
  const [visitorId, setVisitorId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let vid = localStorage.getItem('analytics_visitor');
      if (!vid) {
        vid = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        localStorage.setItem('analytics_visitor', vid);
      }
      setVisitorId(vid);
      
      const sid = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
      setSessionId(sid);
      
      setIsInitialized(true);
    }
  }, []);

  const track = async (eventName: string, properties: any = {}) => {
    if (typeof window === 'undefined' || !isInitialized || !visitorId || !sessionId) {
      return;
    }

    const payload = {
      event: eventName,
      properties,
      trackingId: config.trackingId,
      visitorId,
      sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (config.debug) {
        console.log('📊 Analytics Event:', eventName, result);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Analytics Error:', error);
      return null;
    }
  };

  return (
    <AnalyticsContext.Provider value={{ track }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
```

### Usage

```typescript
// app/layout.tsx
import { Analytics } from '@/components/Analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Analytics 
          config={{
            trackingId: "your_project_id",
            endpoint: "https://analyticseventtracker.contact-sushilpandey.workers.dev",
            debug: true
          }}
        >
          {children}
        </Analytics>
      </body>
    </html>
  );
}

// Any component
'use client';
import { useAnalytics } from '@/components/Analytics';

export default function MyPage() {
  const { track } = useAnalytics();

  return (
    <button onClick={() => track('button_click', { button: 'hero' })}>
      Track This Click
    </button>
  );
}
```

## 🌐 Global Cloudflare Worker

**Endpoint**: `https://analyticseventtracker.contact-sushilpandey.workers.dev`

Features:
- ✅ Global CDN with edge locations
- ✅ Full CORS support 
- ✅ MongoDB Atlas integration
- ✅ Real-time event processing
- ✅ Automatic project statistics

## 🗄️ Database Schema

- **User**: GitHub OAuth users
- **Project**: Analytics projects with tracking IDs
- **AnalyticsEvent**: Individual tracking events  
- **ProjectStats**: Aggregated project statistics

## 🎨 Design System

Professional dark theme inspired by modern analytics platforms:
- **Background**: `#000000` - Pure black
- **Primary**: `#1c9cf0` - Brand blue
- **Cards**: `#17181c` - Elevated surfaces
- **Text**: `#e7e9ea` - High contrast

## 📋 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel with environment variables
```

### Cloudflare Worker
```bash
cd cloudflare-worker
npx wrangler deploy
```

## 📊 Current Status

- ✅ Authentication system (GitHub OAuth)
- ✅ Project management dashboard
- ✅ Analytics event collection API
- ✅ Global Cloudflare Worker deployment
- ✅ MongoDB integration
- ✅ React/Next.js component library
- ✅ Professional UI theme

## 🔮 Roadmap

- [ ] Real-time analytics dashboard
- [ ] Advanced event filtering
- [ ] Custom event properties
- [ ] Data export functionality
- [ ] Team collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**ClickChutney** - Making analytics as delightful as Indian street food! 🍛