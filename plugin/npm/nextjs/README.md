# @clickchutney/nextjs

ClickChutney analytics integration for Next.js applications with automatic domain verification and event tracking.

## Installation

```bash
npm install @clickchutney/nextjs
# or
yarn add @clickchutney/nextjs
```

## Quick Setup

### 1. Environment Variables

Add your tracking ID to your `.env.local` file:

```bash
NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID=cc_your_tracking_id_here
```

### 2. Provider Setup

Wrap your app with the `ClickChutneyProvider` in your `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages Router):

#### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { ClickChutneyProvider } from '@clickchutney/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClickChutneyProvider>
          {children}
        </ClickChutneyProvider>
      </body>
    </html>
  )
}
```

#### Pages Router

```tsx
// pages/_app.tsx
import { ClickChutneyProvider } from '@clickchutney/nextjs'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClickChutneyProvider>
      <Component {...pageProps} />
    </ClickChutneyProvider>
  )
}
```

### 3. Automatic Route Tracking (App Router)

For automatic page view tracking with App Router, add the `RouterTracking` component to your layout:

```tsx
// app/layout.tsx
import { ClickChutneyProvider, RouterTracking } from '@clickchutney/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClickChutneyProvider>
          <RouterTracking />
          {children}
        </ClickChutneyProvider>
      </body>
    </html>
  )
}
```

## Usage

### Manual Event Tracking

```tsx
'use client'

import { useClickChutney } from '@clickchutney/nextjs'

export default function MyComponent() {
  const { track, identify, set } = useClickChutney()

  const handleButtonClick = () => {
    track('button_click', {
      button_name: 'signup',
      page: 'homepage'
    })
  }

  const handleUserSignup = (userId: string, email: string) => {
    identify(userId, {
      email,
      signup_date: new Date().toISOString()
    })
  }

  return (
    <div>
      <button onClick={handleButtonClick}>
        Sign Up
      </button>
    </div>
  )
}
```

### Tracking Components

Use pre-built tracking components for common interactions:

```tsx
import { TrackingButton, TrackingLink, TrackingForm } from '@clickchutney/nextjs'

export default function MyPage() {
  return (
    <div>
      {/* Automatically tracks button clicks */}
      <TrackingButton 
        eventName="cta_click"
        eventProperties={{ location: 'header' }}
      >
        Get Started
      </TrackingButton>

      {/* Automatically tracks link clicks */}
      <TrackingLink 
        href="/pricing"
        eventName="pricing_link_click"
      >
        View Pricing
      </TrackingLink>

      {/* Automatically tracks form submissions */}
      <TrackingForm 
        eventName="newsletter_signup"
        eventProperties={{ source: 'footer' }}
      >
        <input type="email" name="email" placeholder="Enter email" />
        <button type="submit">Subscribe</button>
      </TrackingForm>
    </div>
  )
}
```

### Page Tracking with HOC

For pages router or manual page tracking:

```tsx
import { withClickChutney } from '@clickchutney/nextjs'

function HomePage() {
  return <div>Home Page Content</div>
}

export default withClickChutney(HomePage)
```

## Configuration Options

```tsx
<ClickChutneyProvider
  trackingId="cc_your_id" // Optional: override env variable
  debug={true}           // Enable debug logging
  autoTrack={true}       // Enable automatic tracking
>
  {children}
</ClickChutneyProvider>
```

## Domain Verification

Domain verification happens automatically when:

1. The first analytics event is sent from your domain
2. Your tracking ID is properly configured
3. Your site is accessible from the internet

No manual meta tag setup required! The plugin handles verification automatically.

## Features

- ✅ **Automatic Domain Verification** - No manual setup required
- ✅ **Route Change Tracking** - Automatic page view tracking
- ✅ **TypeScript Support** - Full type safety
- ✅ **React 18 Compatible** - Works with latest React features
- ✅ **App Router Support** - Full Next.js 13+ support
- ✅ **Pages Router Support** - Backward compatible
- ✅ **Tracking Components** - Pre-built components for common events
- ✅ **Environment Variables** - Secure configuration
- ✅ **Development Mode** - Debug logging for development

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID` | Your ClickChutney tracking ID | Yes |
| `CLICKCHUTNEY_API_URL` | Custom API endpoint (optional) | No |

## API Reference

### `useClickChutney()`

Hook that provides access to tracking functions:

```tsx
const {
  track,    // Track custom events
  page,     // Track page views
  identify, // Identify users
  set       // Set user properties
} = useClickChutney()
```

### Component Props

#### `TrackingButton`
- `eventName?: string` - Custom event name (default: 'button_click')
- `eventProperties?: object` - Additional event properties
- All standard button props

#### `TrackingLink`
- `eventName?: string` - Custom event name (default: 'link_click')
- `eventProperties?: object` - Additional event properties
- All standard anchor props

#### `TrackingForm`
- `eventName?: string` - Custom event name (default: 'form_submit')
- `eventProperties?: object` - Additional event properties
- All standard form props

## License

MIT