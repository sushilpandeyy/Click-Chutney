import {
  ClickChutneyConfig,
  AnalyticsEvent,
  EventPayload,
  PageViewEvent,
  CustomEvent,
  TrackerOptions
} from './types';
import {
  generateId,
  getCurrentUrl,
  getCurrentDomain,
  getCurrentPath,
  getPageTitle,
  getReferrer,
  getUserAgent,
  SessionManager,
  UserManager,
  getPerformanceMetrics,
  debounce
} from './utils';

export class ClickChutneyTracker {
  private config: ClickChutneyConfig;
  private eventQueue: EventPayload[] = [];
  private isInitialized = false;
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(config: ClickChutneyConfig) {
    this.config = {
      debug: false,
      autoTrack: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      apiUrl: 'https://qpbibuv2t3.execute-api.ap-south-1.amazonaws.com/v1/tracker',
      ...config
    };

    this.log('Initializing ClickChutney tracker', this.config);
    this.initialize();
  }

  private initialize(): void {
    if (this.isInitialized) return;

    // Only initialize in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      this.log('Skipping initialization - not in browser environment');
      return;
    }

    // Ensure we have a session
    SessionManager.getSession() || SessionManager.createSession();

    // Set up auto-tracking
    if (this.config.autoTrack) {
      this.setupAutoTracking();
    }

    // Set up performance tracking
    this.setupPerformanceTracking();

    // Set up periodic flush
    this.flushTimer = setInterval(() => {
      this.flush();
    }, 10000); // Flush every 10 seconds

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Track initial page view
    if (this.config.autoTrack) {
      this.page();
    }

    this.isInitialized = true;
    this.log('ClickChutney tracker initialized');
  }

  private setupAutoTracking(): void {
    if (typeof document === 'undefined') return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden');
      } else {
        this.track('page_visible');
      }
    });

    // Track clicks on buttons and links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        this.track('click', {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim(),
          href: target.getAttribute('href'),
          className: target.className
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submit', {
        formId: form.id,
        formName: form.name,
        action: form.action
      });
    });
  }

  private setupPerformanceTracking(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    // Track performance metrics after page load
    if (document.readyState === 'complete') {
      this.trackPerformance();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.trackPerformance(), 1000);
      });
    }
  }

  private trackPerformance(): void {
    const metrics = getPerformanceMetrics();
    if (Object.keys(metrics).length > 0) {
      this.track('performance', metrics);
    }
  }

  page(url?: string, title?: string): void {
    if (typeof window === 'undefined') {
      this.log('Skipping page tracking - not in browser environment');
      return;
    }

    const pageEvent: PageViewEvent = {
      type: 'pageview',
      url: url || getCurrentUrl(),
      title: title || getPageTitle(),
      referrer: getReferrer(),
      path: getCurrentPath()
    };

    // Update session
    SessionManager.updateSession({ 
      pageViews: (SessionManager.getSession()?.pageViews || 0) + 1 
    });

    this.enqueueEvent('pageview', pageEvent);
    this.log('Page view tracked', pageEvent);
  }

  track(event: string, properties?: Record<string, any>): void {
    if (typeof window === 'undefined') {
      this.log('Skipping event tracking - not in browser environment');
      return;
    }

    const customEvent: CustomEvent = {
      type: 'event',
      name: event,
      properties
    };

    // Update session
    SessionManager.updateSession({ 
      events: (SessionManager.getSession()?.events || 0) + 1 
    });

    this.enqueueEvent(event, customEvent);
    this.log('Event tracked', customEvent);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    UserManager.setUser({ id: userId, traits });
    
    this.enqueueEvent('identify', {
      type: 'identify',
      userId,
      traits
    });

    this.log('User identified', { userId, traits });
  }

  set(properties: Record<string, any>): void {
    const user = UserManager.getUser() || {};
    UserManager.setUser({
      ...user,
      traits: { ...user.traits, ...properties }
    });

    this.log('User properties set', properties);
  }

  private enqueueEvent(eventName: string, eventData: AnalyticsEvent): void {
    const session = SessionManager.getSession();
    const user = UserManager.getUser();

    const payload: EventPayload = {
      trackingId: this.config.trackingId,
      event: eventName,
      domain: getCurrentDomain(),
      timestamp: new Date().toISOString(),
      sessionId: session?.id || generateId(),
      userId: user?.id,
      data: eventData,
      userAgent: getUserAgent(),
      url: getCurrentUrl(),
      referrer: getReferrer()
    };

    this.eventQueue.push(payload);
    this.log('Event enqueued', payload);

    // Auto-flush if queue is getting large
    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  flush(synchronous = false): Promise<void> {
    if (typeof window === 'undefined' || this.eventQueue.length === 0) {
      return Promise.resolve();
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    this.log('Flushing events', events);

    const sendEvents = async () => {
      try {
        const response = await fetch(this.config.apiUrl!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            events,
            trackingId: this.config.trackingId,
            domain: getCurrentDomain()
          }),
          ...(synchronous && { keepalive: true })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        this.log('Events sent successfully');
      } catch (error) {
        this.log('Error sending events', error);
        // Re-queue events on failure
        this.eventQueue.unshift(...events);
      }
    };

    if (synchronous) {
      // For beforeunload, we need to use sendBeacon or synchronous request
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(
          this.config.apiUrl!,
          JSON.stringify({
            events,
            trackingId: this.config.trackingId,
            domain: getCurrentDomain()
          })
        );
      }
      return Promise.resolve();
    } else {
      return sendEvents();
    }
  }

  reset(): void {
    SessionManager.clearSession();
    UserManager.clearUser();
    this.eventQueue = [];
    this.log('Tracker reset');
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(true);
    this.log('Tracker destroyed');
  }

  private log(message: string, data?: any): void {
    if (this.config.debug) {
      console.log(`[ClickChutney] ${message}`, data || '');
    }
  }
}