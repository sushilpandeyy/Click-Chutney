'use client';

import React, { useEffect, useState } from 'react';
import { ClickChutneyTracker } from './tracker';

interface AnalyticsProps {
  trackingId?: string;
  debug?: boolean;
  disableInDev?: boolean;
  config?: {
    autoTrack?: boolean;
    sessionTimeout?: number;
    apiUrl?: string;
  };
}

// Global flag to prevent multiple initializations
declare global {
  interface Window {
    __ccAnalyticsInitialized?: boolean;
    __ccTracker?: ClickChutneyTracker;
    __ccReactAPI?: {
      page: (url?: string, title?: string) => void;
      track: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      set: (properties: Record<string, any>) => void;
    };
  }
}

/**
 * Simple Analytics component for React/Next.js
 * 
 * Usage:
 * ```tsx
 * import { Analytics } from '@click-chutney/analytics/react';
 * 
 * export default function Layout({ children }) {
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
export function Analytics(props: AnalyticsProps = {}) {
  const { trackingId, debug, disableInDev = true, config = {} } = props;
  const [isClient, setIsClient] = useState(false);
  
  // Ensure client-side rendering to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-detect tracking ID from environment variables
  const autoTrackingId = trackingId || 
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID);

  if (!isClient) {
    return null;
  }

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
    if (debug) {
      console.log('ClickChutney: Disabled in development mode');
    }
    return null;
  }

  // Auto-detect debug mode
  const shouldDebug = debug !== undefined ? debug : isDev;

  // Initialize on client-side only, once
  if (typeof window !== 'undefined' && !window.__ccAnalyticsInitialized) {
    window.__ccAnalyticsInitialized = true;
    
    // Use setTimeout to avoid blocking the main thread
    setTimeout(() => {
      try {
        // Initialize tracker directly without circular import
        const tracker = new ClickChutneyTracker({
          trackingId: autoTrackingId,
          debug: shouldDebug,
          autoTrack: true,
          ...config
        });

        // Store tracker globally
        window.__ccTracker = tracker;
        
        // Create React-specific global API
        window.__ccReactAPI = {
          page: (url?: string, title?: string) => tracker.page(url, title),
          track: (event: string, properties?: Record<string, any>) => tracker.track(event, properties),
          identify: (userId: string, traits?: Record<string, any>) => tracker.identify(userId, traits),
          set: (properties: Record<string, any>) => tracker.set(properties)
        };

        // Track initial page view
        setTimeout(() => {
          tracker.page();
        }, 100);
        
        if (shouldDebug) {
          console.log('✅ ClickChutney: Initialized successfully with ID:', autoTrackingId);
        }
      } catch (error) {
        console.error('❌ ClickChutney: Failed to initialize:', error);
        // Reset flag on error so initialization can be retried
        window.__ccAnalyticsInitialized = false;
      }
    }, 0);
  }

  // Component renders nothing, it just initializes analytics
  return null;
}

/**
 * Hook for manual analytics tracking
 */
export function useAnalytics() {
  return {
    page: (url?: string, title?: string) => {
      if (typeof window === 'undefined') return;
      if (window.__ccReactAPI) {
        try {
          window.__ccReactAPI.page(url, title);
        } catch (error) {
          console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
        }
      } else {
        console.warn('ClickChutney: Not loaded. Add <Analytics /> to your app.');
      }
    },
    
    track: (event: string, properties?: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      if (window.__ccReactAPI) {
        try {
          window.__ccReactAPI.track(event, properties);
        } catch (error) {
          console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
        }
      } else {
        console.warn('ClickChutney: Not loaded. Add <Analytics /> to your app.');
      }
    },
    
    identify: (userId: string, traits?: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      if (window.__ccReactAPI) {
        try {
          window.__ccReactAPI.identify(userId, traits);
        } catch (error) {
          console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
        }
      } else {
        console.warn('ClickChutney: Not loaded. Add <Analytics /> to your app.');
      }
    },
    
    set: (properties: Record<string, any>) => {
      if (typeof window === 'undefined') return;
      if (window.__ccReactAPI) {
        try {
          window.__ccReactAPI.set(properties);
        } catch (error) {
          console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
        }
      } else {
        console.warn('ClickChutney: Not loaded. Add <Analytics /> to your app.');
      }
    }
  };
}

// Default export for convenience
export default Analytics;

// Named exports for convenience
export { Analytics as ClickChutneyAnalytics };
export { useAnalytics as useClickChutney };