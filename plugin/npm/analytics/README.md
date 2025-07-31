# @click-chutney/analytics

Zero-configuration analytics tracking library for React, Next.js and vanilla JavaScript applications.

## 🚀 Quick Start

### React/Next.js (Recommended)

**1. Install the package:**
```bash
npm install @click-chutney/analytics
```

**2. Add your tracking ID to environment variables:**
```bash
# .env.local
NEXT_PUBLIC_CLICKCHUTNEY_ID=your_tracking_id_here
```

**3. Add the Analytics component to your app:**
```tsx
// app/layout.tsx (Next.js 13+)
import { Analytics } from '@click-chutney/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**That's it!** 🎉 Analytics will automatically start tracking page views and user interactions.

### Vanilla JavaScript/HTML

**Add to your HTML:**
```html
<script src="https://unpkg.com/@click-chutney/analytics@2.0.1/dist/clickchutney.min.js"></script>
<script>
  ClickChutney.init('your_tracking_id_here');
</script>
```

## 📖 Usage

### Automatic Tracking
The Analytics component automatically tracks:
- Page views (including route changes in SPAs)
- Button clicks
- Link clicks
- Form submissions
- Performance metrics

### Manual Tracking
Use the `useAnalytics` hook for custom events:

```tsx
import { useAnalytics } from '@click-chutney/analytics/react';

function MyComponent() {
  const analytics = useAnalytics();
  
  const handleClick = () => {
    analytics.track('button_clicked', { 
      button: 'cta',
      location: 'header' 
    });
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### User Identification
```tsx
const analytics = useAnalytics();

// When user logs in
analytics.identify('user_123', {
  email: 'user@example.com',
  plan: 'premium'
});
```

## ⚙️ Configuration

### Environment Variables
The package automatically detects these environment variables:
- `NEXT_PUBLIC_CLICKCHUTNEY_ID` (recommended for Next.js)
- `NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID`
- `CLICKCHUTNEY_TRACKING_ID`

### Custom Configuration
```tsx
<Analytics 
  trackingId="custom_id" 
  debug={true}
  disableInDev={false}
  config={{
    autoTrack: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  }}
/>
```

### Options
- `trackingId`: Your ClickChutney tracking ID (auto-detected from env vars)
- `debug`: Enable debug logging (auto-enabled in development)
- `disableInDev`: Disable tracking in development mode (default: true)
- `config.autoTrack`: Automatically track common events (default: true)
- `config.sessionTimeout`: Session timeout in milliseconds (default: 30 min)

## 🔧 Advanced Usage

### Manual Initialization (Vanilla JS)
```javascript
import ClickChutney from '@click-chutney/analytics';

// Auto-detects from environment or requires explicit ID
ClickChutney.init(); // Uses NEXT_PUBLIC_CLICKCHUTNEY_ID
// or
ClickChutney.init('your_tracking_id');

// Track events
ClickChutney.page('/dashboard', 'Dashboard');
ClickChutney.track('feature_used', { feature: 'search' });
```

### Framework Agnostic
Works with any React-based framework:
- Next.js 12+ (Pages & App Router)
- Create React App
- Vite + React
- Remix
- Gatsby

## 🏗️ Migration from v1.x

**v1.x (Manual Setup):**
```tsx
// Old way - manual setup required
import ClickChutney from '@click-chutney/analytics';

useEffect(() => {
  ClickChutney.init('tracking_id');
  ClickChutney.page();
}, []);
```

**v2.x (Zero Config):**
```tsx
// New way - just add the component
import { Analytics } from '@click-chutney/analytics/react';

export default function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

## 🔒 Privacy & GDPR
- Respects Do Not Track headers
- No cookies stored by default
- GDPR compliant data collection
- Automatically disabled in development

## 📊 Domain Verification
The system automatically handles:
- `www.example.com` ↔ `example.com` normalization
- Subdomain tracking
- Development/staging environment detection

## 🆘 Troubleshooting

### Analytics not working?
1. Check that your tracking ID is set in environment variables
2. Verify the Analytics component is rendered
3. Check browser dev tools for debug messages (enabled in development)
4. Ensure your domain is verified in the ClickChutney dashboard

### Next.js Deployment Issues

If you encounter errors like `TypeError: (0, n.useRef) is not a function` during Vercel or other deployments:

**Solution 1: Use Dynamic Import (Safest)**
```tsx
import { DynamicAnalytics } from '@click-chutney/analytics/dynamic';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <DynamicAnalytics />
      </body>
    </html>
  );
}
```

**Solution 2: Next.js Dynamic Import**
```tsx
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => 
  import('@click-chutney/analytics/react').then(mod => ({ default: mod.Analytics })), 
  { ssr: false }
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Solution 3: Client Component Wrapper**
```tsx
'use client';
import { Analytics } from '@click-chutney/analytics/react';
import { useEffect, useState } from 'react';

export function ClientAnalytics() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <Analytics />;
}
```

### TypeScript Support
Full TypeScript support included with detailed type definitions.

## 📝 License
MIT License - see LICENSE file for details.