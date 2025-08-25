'use client';

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';

interface ClickChutneyContextType {
  trackEvent: (event: string, data?: Record<string, unknown>) => void;
  trackPageView: (path?: string) => void;
}

const ClickChutneyContext = createContext<ClickChutneyContextType | null>(null);

interface ClickChutneyProviderProps {
  trackingId: string;
  children: React.ReactNode;
  apiUrl?: string;
}

export function ClickChutneyProvider({ trackingId, children, apiUrl = '/api/analytics/track' }: ClickChutneyProviderProps) {
  const visitorIdRef = useRef<string | null>(null);
  const lastPathRef = useRef<string>('');

  // Generate or retrieve visitor ID
  const getVisitorId = () => {
    if (visitorIdRef.current) return visitorIdRef.current;
    
    let visitorId = localStorage.getItem('cc_visitor_id');
    if (!visitorId) {
      visitorId = 'cc_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('cc_visitor_id', visitorId);
    }
    visitorIdRef.current = visitorId;
    return visitorId;
  };

  // Track page view
  const trackPageView = useCallback((path?: string) => {
    const currentPath = path || window.location.pathname;
    if (currentPath === lastPathRef.current) return;
    
    lastPathRef.current = currentPath;
    
    const data = {
      trackingId,
      visitorId: getVisitorId(),
      page: currentPath,
      referrer: document.referrer,
      timestamp: Date.now(),
      event: 'pageview'
    };

    sendToAPI(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingId, apiUrl]);

  // Track custom events
  const trackEvent = (event: string, eventData?: Record<string, unknown>) => {
    const data = {
      trackingId,
      visitorId: getVisitorId(),
      page: window.location.pathname,
      event,
      ...eventData,
      timestamp: Date.now()
    };

    sendToAPI(data);
  };

  // Send data to API
  const sendToAPI = useCallback(async (data: Record<string, unknown>) => {
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('ClickChutney tracking error:', error);
    }
  }, [apiUrl]);

  // Initialize tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track initial page view
    trackPageView();

    // Track navigation changes (for SPAs)
    const handlePopState = () => trackPageView();
    window.addEventListener('popstate', handlePopState);

    // Track programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => trackPageView(), 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => trackPageView(), 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [trackingId, trackPageView]);

  const value: ClickChutneyContextType = {
    trackEvent,
    trackPageView
  };

  return (
    <ClickChutneyContext.Provider value={value}>
      {children}
    </ClickChutneyContext.Provider>
  );
}

// Hook to use ClickChutney analytics
export function useClickChutney() {
  const context = useContext(ClickChutneyContext);
  if (!context) {
    throw new Error('useClickChutney must be used within a ClickChutneyProvider');
  }
  return context;
}