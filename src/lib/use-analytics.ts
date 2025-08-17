'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface AnalyticsConfig {
  trackingId: string;
  endpoint?: string;
  autoPageview?: boolean;
  debug?: boolean;
  enableHeartbeat?: boolean;
  heartbeatInterval?: number;
  sessionTimeout?: number;
  enableSPATracking?: boolean;
  trackUtmParams?: boolean;
  trackReferrers?: boolean;
}

interface EventProperties {
  [key: string]: unknown;
}

interface UserTraits {
  [key: string]: unknown;
}

declare global {
  interface Window {
    ClickChutney?: {
      init: (config: AnalyticsConfig) => void;
      pageview: (page?: string, title?: string) => void;
      event: (event: string, properties?: EventProperties) => void;
      identify: (userId: string, traits?: UserTraits) => void;
      heartbeat: () => void;
      _initialized: boolean;
      _config: AnalyticsConfig;
    };
    cc?: (...args: unknown[]) => void;
  }
}

/**
 * React hook for ClickChutney Analytics
 * Provides type-safe analytics tracking for Next.js/React applications
 */
export function useAnalytics(config: AnalyticsConfig) {
  const initialized = useRef(false);
  const configRef = useRef(config);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initialize analytics on mount
  useEffect(() => {
    if (typeof window === 'undefined' || initialized.current) {
      return;
    }

    // Load the analytics script if not already loaded
    if (!window.ClickChutney) {
      const script = document.createElement('script');
      script.src = '/clickchutney-analytics.js';
      script.async = true;
      script.onload = () => {
        if (window.ClickChutney && !window.ClickChutney._initialized) {
          window.ClickChutney.init(configRef.current);
          initialized.current = true;
        }
      };
      document.head.appendChild(script);
    } else if (!window.ClickChutney._initialized) {
      window.ClickChutney.init(configRef.current);
      initialized.current = true;
    }

    return () => {
      // Cleanup on unmount (if needed)
      initialized.current = false;
    };
  }, []);

  // Analytics methods
  const track = useCallback((event: string, properties?: EventProperties) => {
    if (typeof window !== 'undefined' && window.cc) {
      window.cc('event', event, properties);
    }
  }, []);

  const page = useCallback((page?: string, title?: string) => {
    if (typeof window !== 'undefined' && window.cc) {
      window.cc('pageview', page, title);
    }
  }, []);

  const identify = useCallback((userId: string, traits?: UserTraits) => {
    if (typeof window !== 'undefined' && window.cc) {
      window.cc('identify', userId, traits);
    }
  }, []);

  const heartbeat = useCallback(() => {
    if (typeof window !== 'undefined' && window.cc) {
      window.cc('heartbeat');
    }
  }, []);

  return {
    track,
    page,
    identify,
    heartbeat,
    isInitialized: () => typeof window !== 'undefined' && window.ClickChutney?._initialized === true
  };
}

/**
 * Component wrapper for analytics initialization
 * Use this in your app layout to automatically initialize analytics
 */
export function AnalyticsProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode; 
  config: AnalyticsConfig; 
}) {
  useAnalytics(config);
  return React.createElement(React.Fragment, null, children);
}

/**
 * Higher-order component for automatic page tracking
 * Wrap your page components to automatically track pageviews
 */
export function withPageTracking<P extends object>(
  Component: React.ComponentType<P>,
  pageConfig?: { 
    pageName?: string; 
    pageTitle?: string;
    trackOnMount?: boolean;
  }
) {
  return function TrackedComponent(props: P) {
    const { page } = useAnalytics({ trackingId: '' }); // Will use existing config

    useEffect(() => {
      if (pageConfig?.trackOnMount !== false) {
        page(pageConfig?.pageName, pageConfig?.pageTitle);
      }
    }, [page]);

    return React.createElement(Component, props);
  };
}