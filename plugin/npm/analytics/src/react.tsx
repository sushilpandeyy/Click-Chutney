'use client';

import { useEffect, useRef } from 'react';
import ClickChutney from './index';

interface AnalyticsProps {
  /**
   * ClickChutney tracking ID. If not provided, will auto-detect from:
   * 1. NEXT_PUBLIC_CLICKCHUTNEY_ID environment variable
   * 2. NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID environment variable
   * 3. process.env.CLICKCHUTNEY_TRACKING_ID (server-side)
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
export function Analytics({
  trackingId,
  debug,
  disableInDev = true,
  config = {}
}: AnalyticsProps = {}) {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    
    // Skip in SSR
    if (typeof window === 'undefined') return;

    // Auto-detect tracking ID from environment variables
    const autoTrackingId = trackingId || 
      process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID ||
      process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID ||
      (typeof process !== 'undefined' && process.env?.CLICKCHUTNEY_TRACKING_ID);

    if (!autoTrackingId) {
      console.warn(
        'ClickChutney: No tracking ID provided. Set NEXT_PUBLIC_CLICKCHUTNEY_ID environment variable or pass trackingId prop.'
      );
      return;
    }

    // Check if we should disable in development
    const isDev = process.env.NODE_ENV === 'development';
    if (disableInDev && isDev) {
      console.log('ClickChutney: Disabled in development mode');
      return;
    }

    // Auto-detect debug mode
    const shouldDebug = debug !== undefined ? debug : isDev;

    try {
      // Initialize ClickChutney
      ClickChutney.init(autoTrackingId, {
        debug: shouldDebug,
        autoTrack: true, // Auto-track page views and common events
        ...config
      });

      // Track initial page view
      ClickChutney.page();

      initialized.current = true;
      
      if (shouldDebug) {
        console.log('ClickChutney: Initialized successfully with ID:', autoTrackingId);
      }
    } catch (error) {
      console.error('ClickChutney: Failed to initialize:', error);
    }

    // Cleanup on unmount
    return () => {
      if (initialized.current) {
        ClickChutney.destroy();
        initialized.current = false;
      }
    };
  }, [trackingId, debug, disableInDev, config]);

  // This component renders nothing, just like Vercel Analytics
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
      try {
        ClickChutney.page(url, title);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    track: (event: string, properties?: Record<string, any>) => {
      try {
        ClickChutney.track(event, properties);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    identify: (userId: string, traits?: Record<string, any>) => {
      try {
        ClickChutney.identify(userId, traits);
      } catch (error) {
        console.warn('ClickChutney: Not initialized. Add <Analytics /> to your app.');
      }
    },
    
    set: (properties: Record<string, any>) => {
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