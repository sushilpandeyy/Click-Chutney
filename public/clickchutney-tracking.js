(function() {
  // ClickChutney Analytics Tracking Script - Vercel Optimized
  // Production-ready version for Vercel deployment
  
  window.ClickChutney = window.ClickChutney || {};
  
  const CC = {
    endpoint: 'https://clickchutney.vercel.app/api/analytics',
    trackingId: null,
    visitorId: null,
    sessionId: null,
    _pageLoadTime: null,
    
    init: function(trackingId) {
      this.trackingId = trackingId;
      
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
      let visitorId = null;
      
      try {
        visitorId = localStorage.getItem(storageKey);
      } catch (e) {
        // Handle localStorage access errors (private browsing, etc.)
        console.warn('ClickChutney: LocalStorage not available, using session-based visitor ID');
      }
      
      if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
        try {
          localStorage.setItem(storageKey, visitorId);
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      
      return visitorId;
    },
    
    track: function(event, properties) {
      if (!this.trackingId) {
        console.warn('ClickChutney: No tracking ID set. Call init() first.');
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
      
      // Use sendBeacon for better reliability, fallback to fetch
      if (navigator.sendBeacon && typeof Blob !== 'undefined') {
        try {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon(this.endpoint, blob);
        } catch (e) {
          // Fallback to fetch if sendBeacon fails
          this.sendWithFetch(payload);
        }
      } else {
        this.sendWithFetch(payload);
      }
    },
    
    sendWithFetch: function(payload) {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function(error) {
        console.error('ClickChutney tracking failed:', error);
      });
    },
    
    trackPageView: function() {
      this.track('page_view', {
        title: document.title,
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
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
      const self = this;
      
      // Track clicks on elements with data-cc-track attribute
      document.addEventListener('click', function(e) {
        const element = e.target.closest('[data-cc-track]');
        if (element) {
          const eventName = element.getAttribute('data-cc-track') || 'click';
          const eventData = element.getAttribute('data-cc-data');
          let data = { 
            element: element.tagName.toLowerCase(),
            text: element.textContent ? element.textContent.trim().substring(0, 100) : '',
            id: element.id || '',
            className: element.className || ''
          };
          
          if (eventData) {
            try {
              data = { ...data, ...JSON.parse(eventData) };
            } catch (err) {
              data.raw_data = eventData;
            }
          }
          
          self.track(eventName, data);
        }
      });
      
      // Track page visibility changes
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          self.track('page_hidden');
        } else {
          self.track('page_visible');
        }
      });
      
      // Track page unload with session duration
      window.addEventListener('beforeunload', function() {
        if (self._pageLoadTime) {
          self.track('page_unload', {
            timeOnPage: Date.now() - self._pageLoadTime,
            sessionDuration: Date.now() - self._pageLoadTime
          });
        }
      });
      
      // Store page load time for session tracking
      this._pageLoadTime = Date.now();
      
      // Track scroll depth
      let maxScrollDepth = 0;
      window.addEventListener('scroll', function() {
        const scrollDepth = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          // Track milestone scroll depths
          if ([25, 50, 75, 90, 100].includes(scrollDepth)) {
            self.track('scroll_depth', { depth: scrollDepth });
          }
        }
      });
    }
  };
  
  window.ClickChutney = CC;
  
  // Auto-initialize if tracking ID is provided via script tag
  const currentScript = document.currentScript;
  if (currentScript && currentScript.getAttribute('data-tracking-id')) {
    const trackingId = currentScript.getAttribute('data-tracking-id');
    CC.init(trackingId);
  }
})();