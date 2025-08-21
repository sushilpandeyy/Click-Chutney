'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface TrackingInstructionsProps {
  trackingId: string;
  domain?: string;
}

export function TrackingInstructions({ trackingId, domain = 'clickchutney.vercel.app' }: TrackingInstructionsProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedComponent, setCopiedComponent] = useState(false);
  const [copiedLayout, setCopiedLayout] = useState(false);

  const trackingScript = `<!-- ClickChutney Analytics -->
<script>
(function() {
  window.ClickChutney = window.ClickChutney || {};
  
  const CC = {
    endpoint: 'https://${domain}/api/analytics',
    trackingId: '${trackingId}',
    visitorId: null,
    sessionId: null,
    
    init: function() {
      // Generate or retrieve visitor ID (persistent across sessions)
      this.visitorId = this.getOrCreateVisitorId();
      // Generate session ID (unique per session)
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      
      // Track initial page view
      this.trackPageView();
      
      // Set up automatic event tracking
      this.setupAutoTracking();
    },
    
    getOrCreateVisitorId: function() {
      const storageKey = 'cc_visitor_id';
      let visitorId = localStorage.getItem(storageKey);
      if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
        localStorage.setItem(storageKey, visitorId);
      }
      return visitorId;
    },
    
    track: function(event, properties) {
      if (!this.trackingId) {
        console.warn('ClickChutney: No tracking ID configured');
        return;
      }
      
      const payload = {
        trackingId: this.trackingId,
        event: event,
        properties: properties || {},
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        url: window.location.href,
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      };
      
      // Use fetch with proper CORS handling
      fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      }).catch(function(error) {
        console.error('ClickChutney tracking failed:', error);
      });
    },
    
    trackPageView: function() {
      this.track('page_view', {
        title: document.title,
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      });
    },
    
    trackClick: function(element, data) {
      this.track('click', { 
        element: element,
        target: element,
        ...data 
      });
    },
    
    trackEvent: function(eventName, data) {
      this.track(eventName, data);
    },
    
    setupAutoTracking: function() {
      // Track clicks on elements with data-cc-track attribute
      document.addEventListener('click', function(e) {
        const element = e.target.closest('[data-cc-track]');
        if (element) {
          const eventName = element.getAttribute('data-cc-track') || 'click';
          const eventData = element.getAttribute('data-cc-data');
          let data = { element: element.tagName.toLowerCase() };
          
          if (eventData) {
            try {
              data = { ...data, ...JSON.parse(eventData) };
            } catch (err) {
              data.raw_data = eventData;
            }
          }
          
          CC.track(eventName, data);
        }
      });
      
      // Track page visibility changes
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          CC.track('page_hidden');
        } else {
          CC.track('page_visible');
        }
      });
      
      // Track page unload
      window.addEventListener('beforeunload', function() {
        CC.track('page_unload', {
          timeOnPage: Date.now() - (CC._pageLoadTime || Date.now())
        });
      });
      
      // Store page load time for session tracking
      this._pageLoadTime = Date.now();
    }
  };
  
  window.ClickChutney = CC;
  
  // Initialize tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { CC.init(); });
  } else {
    CC.init();
  }
})();
</script>`;

  const nextjsComponent = `'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface ClickChutneyProps {
  trackingId: string;
  endpoint?: string;
}

export function ClickChutneyAnalytics({ 
  trackingId, 
  endpoint = 'https://${domain}/api/analytics' 
}: ClickChutneyProps) {
  const pathname = usePathname();
  const initialized = useRef(false);
  const visitorId = useRef<string | null>(null);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      const storageKey = 'cc_visitor_id';
      try {
        visitorId.current = localStorage.getItem(storageKey);
        if (!visitorId.current) {
          visitorId.current = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
          localStorage.setItem(storageKey, visitorId.current);
        }
      } catch (e) {
        visitorId.current = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      }

      sessionId.current = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialized.current && trackingId && visitorId.current && sessionId.current) {
      trackPageView();
    }
  }, [pathname, trackingId]);

  const trackEvent = (event: string, properties: Record<string, unknown> = {}) => {
    if (!trackingId || !visitorId.current || !sessionId.current) {
      console.warn('ClickChutney: Not properly initialized');
      return;
    }

    const payload = {
      trackingId,
      event,
      properties,
      visitorId: visitorId.current,
      sessionId: sessionId.current,
      url: window.location.href,
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };

    // Use fetch with proper CORS handling to avoid preflight issues
    sendWithFetch(payload);
  };

  const sendWithFetch = (payload: unknown) => {
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    }).catch(error => {
      console.error('ClickChutney tracking failed:', error);
    });
  };

  const trackPageView = () => {
    trackEvent('page_view', {
      title: document.title,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  };

  // Expose tracking function globally for manual event tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).ClickChutney = {
        trackEvent,
        trackPageView
      };
    }
  }, []);

  return null; // This component renders nothing
}`;

  const layoutWrapper = `// app/layout.tsx or pages/_app.tsx
import { ClickChutneyAnalytics } from '@/components/clickchutney-analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Add ClickChutney Analytics */}
        <ClickChutneyAnalytics trackingId="${trackingId}" />
      </body>
    </html>
  );
}`;

  const copyToClipboard = async (text: string, setCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📦 Next.js Component (Recommended)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use this React component for automatic page view tracking in Next.js applications.
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Create the Analytics Component</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Create <code className="bg-muted px-1 rounded">components/clickchutney-analytics.tsx</code>:
            </p>
            
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96 border">
                <code>{nextjsComponent}</code>
              </pre>
              <Button
                onClick={() => copyToClipboard(nextjsComponent, setCopiedComponent)}
                className="absolute top-2 right-2"
                size="sm"
                variant="outline"
              >
                {copiedComponent ? 'Copied!' : 'Copy Component'}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Add to Your Layout</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Add the component to your root layout for automatic page view tracking:
            </p>
            
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
                <code>{layoutWrapper}</code>
              </pre>
              <Button
                onClick={() => copyToClipboard(layoutWrapper, setCopiedLayout)}
                className="absolute top-2 right-2"
                size="sm"
                variant="outline"
              >
                {copiedLayout ? 'Copied!' : 'Copy Layout'}
              </Button>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-1">✅ That&apos;s it!</h4>
            <p className="text-sm text-green-800">
              Page views will be automatically tracked on route changes. The component is fully typed 
              and optimized for Next.js App Router and Pages Router.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🌐 Universal Script (Alternative)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use this traditional script tag approach for any website or if you prefer not to use the React component.
        </p>
        
        <div>
          <h4 className="font-medium mb-2">Add to HTML Head</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Copy and paste before the closing &lt;/head&gt; tag:
          </p>
          
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-96 border">
              <code>{trackingScript}</code>
            </pre>
            <Button
              onClick={() => copyToClipboard(trackingScript, setCopiedScript)}
              className="absolute top-2 right-2"
              size="sm"
              variant="outline"
            >
              {copiedScript ? 'Copied!' : 'Copy Script'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Manual Event Tracking</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track custom events after implementing either solution above:
        </p>
        
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm">
            <code>{`// Track custom events (available globally after setup)
ClickChutney.trackEvent('button_click', {
  button_name: 'signup',
  location: 'header'
});

// Track conversions
ClickChutney.trackEvent('purchase', {
  value: 99.99,
  currency: 'USD',
  product: 'Premium Plan'
});

// Page views are tracked automatically
// Manual page view tracking (if needed)
ClickChutney.trackPageView();`}</code>
          </pre>
        </div>

        <div className="mt-4 space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">📊 Automatic Features</p>
            <p className="text-xs text-blue-800">
              • Page views tracked on route changes • Session &amp; visitor ID management • Enhanced reliability with sendBeacon
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-900 mb-1">⚡ Next.js Optimized</p>
            <p className="text-xs text-purple-800">
              • Works with App Router & Pages Router • TypeScript support • Zero bundle size impact
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}