'use client';

import React from 'react';
import ClickChutney from './index';

interface AnalyticsProps {
  /**
   * ClickChutney tracking ID. If not provided, will auto-detect from:
   * 1. NEXT_PUBLIC_CLICKCHUTNEY_ID environment variable
   * 2. NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID environment variable
   */
  trackingId?: string;
  
  /**
   * Enable debug mode for development
   * @default false in production, true in development
   */
  debug?: boolean;
  
  /**
   * Disable tracking in development mode
   * @default true (disabled in development)
   */
  disableInDev?: boolean;
  
  /**
   * Custom configuration
   */
  config?: {
    autoTrack?: boolean;
    sessionTimeout?: number;
    apiUrl?: string;
  };
}

/**
 * Zero-configuration analytics component for React/Next.js
 * 
 * Usage:
 * ```tsx
 * // In your layout.tsx or _app.tsx
 * import { Analytics } from '@click-chutney/analytics/react';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Analytics />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
// Global flag to prevent multiple initializations
declare global {
  interface Window {
    __ccAnalyticsInitialized?: boolean;
  }
}

export function Analytics(props: AnalyticsProps = {}) {
  const { trackingId, debug, disableInDev = true, config = {} } = props;
  
  // Auto-detect tracking ID from environment variables
  const autoTrackingId = trackingId || 
    process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID ||
    process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID;

  if (!autoTrackingId) {
    console.warn(
      '⚠️ ClickChutney Warning: No tracking ID found\n' +
      '\n' +
      'Analytics will not track events because no tracking ID was provided.\n' +
      '\n' +
      'Solutions:\n' +
      '• Add NEXT_PUBLIC_CLICKCHUTNEY_ID to your .env.local file\n' +
      '• Or pass trackingId prop: <Analytics trackingId="your-id" />\n' +
      '\n' +
      'Get your tracking ID from: https://clickchutney.com/dashboard'
    );
    return null;
  }

  // Check if we should disable in development
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
  if (disableInDev && isDev) {
    return null;
  }

  // Auto-detect debug mode
  const shouldDebug = debug !== undefined ? debug : isDev;

  // Initialize immediately on client-side, but only once
  if (typeof window !== 'undefined' && !window.__ccAnalyticsInitialized) {
    window.__ccAnalyticsInitialized = true;
    
    // Use setTimeout to avoid blocking the main thread and ensure DOM is ready
    setTimeout(() => {
      try {
        ClickChutney.init(autoTrackingId, {
          debug: shouldDebug,
          autoTrack: true,
          ...config
        });

        // Track initial page view with a small delay to ensure page is fully loaded
        setTimeout(() => {
          ClickChutney.page();
        }, 100);
        
        if (shouldDebug) {
          console.log('ClickChutney: Initialized successfully with ID:', autoTrackingId);
        }
      } catch (error) {
        console.error('ClickChutney: Failed to initialize:', error);
        // Reset flag on error so initialization can be retried
        window.__ccAnalyticsInitialized = false;
      }
    }, 0);
  }

  // Always return null - this component only initializes, doesn't render
  return null;
}

/**
 * Hook for manual analytics tracking
 * 
 * Usage:
 * ```tsx
 * import { useAnalytics } from '@click-chutney/analytics/react';
 * 
 * function MyComponent() {
 *   const analytics = useAnalytics();
 *   
 *   const handleClick = () => {
 *     analytics.track('button_clicked', { button: 'cta' });
 *   };
 *   
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 */
export function useAnalytics() {
  return {
    page: (url?: string, title?: string) => {
      if (typeof window === 'undefined') return;
      try {
        ClickChutney.page(url, title);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    track: (event: string, properties?: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      try {
        ClickChutney.track(event, properties);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    identify: (userId: string, traits?: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      try {
        ClickChutney.identify(userId, traits);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    set: (properties: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      try {
        ClickChutney.set(properties);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    }
  };
}

/**
 * Legacy default export for backward compatibility
 */
export default Analytics;

// Named exports for convenience
export { Analytics as ClickChutneyAnalytics };
export { useAnalytics as useClickChutney };