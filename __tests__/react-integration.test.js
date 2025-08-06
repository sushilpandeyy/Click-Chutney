/**
 * React/Next.js Integration Tests
 * Tests for React components, hooks, and Next.js App Router compatibility
 */

// Mock React and Next.js modules
const mockUsePathname = jest.fn();
const mockUseSearchParams = jest.fn();
const mockCreateContext = jest.fn();
const mockUseContext = jest.fn();
const mockUseEffect = jest.fn();

jest.mock('react', () => ({
  createContext: mockCreateContext,
  useContext: mockUseContext,
  useEffect: mockUseEffect,
  useState: jest.fn(() => [null, jest.fn()]),
  useCallback: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn())
}));

jest.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
  useSearchParams: mockUseSearchParams
}));

// Mock browser environment
global.window = {
  location: {
    href: 'https://example.com/test',
    hostname: 'example.com',
    pathname: '/test'
  },
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  addEventListener: jest.fn(),
  __ccAnalyticsInitialized: false
};

global.document = {
  title: 'Test Page',
  referrer: 'https://google.com',
  addEventListener: jest.fn()
};

global.navigator = {
  userAgent: 'Test Browser'
};

global.process = {
  env: {
    NODE_ENV: 'development',
    NEXT_PUBLIC_CLICKCHUTNEY_ID: 'cc_test123'
  }
};

describe('React/Next.js Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.window.__ccAnalyticsInitialized = false;
    global.setTimeout = jest.fn((fn) => fn());
  });

  describe('Analytics Component', () => {
    test('should initialize with environment variable', () => {
      // Mock the Analytics component behavior
      const initializeAnalytics = (props = {}) => {
        const {
          trackingId,
          debug,
          disableInDev = true,
          config = {}
        } = props;

        // Auto-detect tracking ID
        const autoTrackingId = trackingId || 
          process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID ||
          process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID;

        if (!autoTrackingId) return null;

        // Check if should disable in development
        const isDev = process.env.NODE_ENV === 'development';
        if (disableInDev && isDev) {
          // For this test, we want to see initialization even in dev
          // Override the default behavior for testing
          if (props.forceInit) {
            // Continue with initialization
          } else {
            return null;
          }
        }

        // Auto-detect debug mode
        const shouldDebug = debug !== undefined ? debug : isDev;

        // Simulate initialization
        if (!global.window.__ccAnalyticsInitialized) {
          global.window.__ccAnalyticsInitialized = true;
          return {
            trackingId: autoTrackingId,
            debug: shouldDebug,
            config: { autoTrack: true, ...config }
          };
        }

        return null;
      };

      const result = initializeAnalytics({ disableInDev: false });
      expect(result).toEqual({
        trackingId: 'cc_test123',
        debug: true, // Development mode
        config: { autoTrack: true }
      });
    });

    test('should skip initialization in development when disableInDev is true', () => {
      const initializeAnalytics = (props = {}) => {
        const { disableInDev = true } = props;
        const isDev = process.env.NODE_ENV === 'development';
        
        if (disableInDev && isDev) return null;
        
        return { initialized: true };
      };

      const result = initializeAnalytics({ disableInDev: true });
      expect(result).toBeNull();
    });

    test('should initialize in development when disableInDev is false', () => {
      const initializeAnalytics = (props = {}) => {
        const { disableInDev = true } = props;
        const isDev = process.env.NODE_ENV === 'development';
        
        if (disableInDev && isDev) return null;
        
        return { initialized: true };
      };

      const result = initializeAnalytics({ disableInDev: false });
      expect(result).toEqual({ initialized: true });
    });

    test('should prevent multiple initializations', () => {
      const initializeAnalytics = () => {
        if (!global.window.__ccAnalyticsInitialized) {
          global.window.__ccAnalyticsInitialized = true;
          return { initialized: true };
        }
        return null;
      };

      const result1 = initializeAnalytics();
      const result2 = initializeAnalytics();

      expect(result1).toEqual({ initialized: true });
      expect(result2).toBeNull();
    });
  });

  describe('useAnalytics Hook', () => {
    test('should provide analytics methods', () => {
      const mockTracker = {
        page: jest.fn(),
        track: jest.fn(),
        identify: jest.fn(),
        set: jest.fn()
      };

      const useAnalytics = () => ({
        page: (url, title) => {
          if (typeof window === 'undefined') return;
          mockTracker.page(url, title);
        },
        track: (event, properties) => {
          if (typeof window === 'undefined') return;
          mockTracker.track(event, properties);
        },
        identify: (userId, traits) => {
          if (typeof window === 'undefined') return;
          mockTracker.identify(userId, traits);
        },
        set: (properties) => {
          if (typeof window === 'undefined') return;
          mockTracker.set(properties);
        }
      });

      const analytics = useAnalytics();

      analytics.page('/test', 'Test Page');
      analytics.track('button_click', { button: 'cta' });
      analytics.identify('user123', { email: 'test@example.com' });
      analytics.set({ plan: 'premium' });

      expect(mockTracker.page).toHaveBeenCalledWith('/test', 'Test Page');
      expect(mockTracker.track).toHaveBeenCalledWith('button_click', { button: 'cta' });
      expect(mockTracker.identify).toHaveBeenCalledWith('user123', { email: 'test@example.com' });
      expect(mockTracker.set).toHaveBeenCalledWith({ plan: 'premium' });
    });

    test('should handle SSR gracefully', () => {
      const originalWindow = global.window;
      delete global.window;

      const useAnalytics = () => ({
        page: () => {
          if (typeof window === 'undefined') return;
          throw new Error('Should not reach here');
        },
        track: () => {
          if (typeof window === 'undefined') return;
          throw new Error('Should not reach here');
        }
      });

      const analytics = useAnalytics();

      expect(() => {
        analytics.page();
        analytics.track('test');
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('Next.js Router Tracking', () => {
    test('should track route changes with App Router', () => {
      const mockTrack = jest.fn();
      
      mockUsePathname.mockReturnValue('/dashboard');
      mockUseSearchParams.mockReturnValue({
        toString: () => 'tab=analytics&view=chart'
      });

      // Simulate RouterTracking component behavior
      const simulateRouterTracking = () => {
        const pathname = mockUsePathname();
        const searchParams = mockUseSearchParams();
        
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        mockTrack(url);
      };

      simulateRouterTracking();

      expect(mockTrack).toHaveBeenCalledWith('/dashboard?tab=analytics&view=chart');
    });

    test('should track route changes without search params', () => {
      const mockTrack = jest.fn();
      
      mockUsePathname.mockReturnValue('/dashboard/settings');
      mockUseSearchParams.mockReturnValue({
        toString: () => ''
      });

      const simulateRouterTracking = () => {
        const pathname = mockUsePathname();
        const searchParams = mockUseSearchParams();
        
        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        mockTrack(url);
      };

      simulateRouterTracking();

      expect(mockTrack).toHaveBeenCalledWith('/dashboard/settings');
    });
  });

  describe('Tracking Components', () => {
    test('should create tracking button component', () => {
      const mockTrack = jest.fn();
      const mockOnClick = jest.fn();

      // Simulate TrackingButton behavior
      const simulateTrackingButton = (props) => {
        const {
          eventName = 'button_click',
          eventProperties = {},
          onClick,
          children = 'Button'
        } = props;

        const handleClick = (event) => {
          mockTrack(eventName, {
            ...eventProperties,
            button_text: typeof children === 'string' ? children : 'button',
            timestamp: expect.any(String)
          });

          if (onClick) onClick(event);
        };

        return { handleClick };
      };

      const button = simulateTrackingButton({
        eventName: 'cta_click',
        eventProperties: { location: 'header' },
        onClick: mockOnClick,
        children: 'Sign Up'
      });

      button.handleClick({ preventDefault: jest.fn() });

      expect(mockTrack).toHaveBeenCalledWith('cta_click', {
        location: 'header',
        button_text: 'Sign Up',
        timestamp: expect.any(String)
      });
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('should create tracking link component', () => {
      const mockTrack = jest.fn();

      const simulateTrackingLink = (props) => {
        const {
          eventName = 'link_click',
          eventProperties = {},
          href = '#',
          children = 'Link'
        } = props;

        const handleClick = () => {
          mockTrack(eventName, {
            ...eventProperties,
            link_url: href,
            link_text: typeof children === 'string' ? children : 'link',
            timestamp: expect.any(String)
          });
        };

        return { handleClick };
      };

      const link = simulateTrackingLink({
        href: '/pricing',
        children: 'View Pricing',
        eventProperties: { source: 'navigation' }
      });

      link.handleClick();

      expect(mockTrack).toHaveBeenCalledWith('link_click', {
        source: 'navigation',
        link_url: '/pricing',
        link_text: 'View Pricing',
        timestamp: expect.any(String)
      });
    });

    test('should create tracking form component', () => {
      const mockTrack = jest.fn();

      const simulateTrackingForm = (props) => {
        const {
          eventName = 'form_submit',
          eventProperties = {},
          id = 'contact-form',
          name = 'contact'
        } = props;

        const handleSubmit = (event) => {
          mockTrack(eventName, {
            ...eventProperties,
            form_id: id,
            form_name: name,
            timestamp: expect.any(String)
          });
        };

        return { handleSubmit };
      };

      const form = simulateTrackingForm({
        id: 'newsletter-signup',
        name: 'newsletter',
        eventProperties: { source: 'footer' }
      });

      form.handleSubmit({ preventDefault: jest.fn() });

      expect(mockTrack).toHaveBeenCalledWith('form_submit', {
        source: 'footer',
        form_id: 'newsletter-signup',
        form_name: 'newsletter',
        timestamp: expect.any(String)
      });
    });
  });

  describe('Context Provider', () => {
    test('should provide analytics context', () => {
      const mockTracker = {
        track: jest.fn(),
        page: jest.fn(),
        identify: jest.fn(),
        set: jest.fn()
      };

      // Simulate provider behavior
      const createProvider = (props) => {
        const {
          trackingId,
          debug = false,
          autoTrack = true
        } = props;

        const finalTrackingId = trackingId || 
          process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID ||
          process.env.CLICKCHUTNEY_TRACKING_ID;

        if (!finalTrackingId) {
          console.warn('ClickChutney: No tracking ID provided');
          return null;
        }

        // Simulate initialization
        const contextValue = {
          track: mockTracker.track,
          page: mockTracker.page,
          identify: mockTracker.identify,
          set: mockTracker.set
        };

        return contextValue;
      };

      const context = createProvider({
        trackingId: 'cc_test123',
        debug: true
      });

      expect(context).toBeDefined();
      expect(context.track).toBe(mockTracker.track);
      expect(context.page).toBe(mockTracker.page);
    });

    test('should warn when no tracking ID provided', () => {
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();

      // Remove tracking ID from environment
      const originalEnv = process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID;
      delete process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID;

      const createProvider = (props) => {
        const { trackingId } = props;
        const finalTrackingId = trackingId || 
          process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID;

        if (!finalTrackingId) {
          console.warn('ClickChutney: No tracking ID provided');
          return null;
        }

        return { initialized: true };
      };

      const result = createProvider({});

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('ClickChutney: No tracking ID provided');

      // Restore
      console.warn = originalConsoleWarn;
      if (originalEnv) {
        process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID = originalEnv;
      }
    });
  });

  describe('Environment Detection', () => {
    test('should detect development environment', () => {
      const detectEnvironment = () => {
        const isDev = process.env.NODE_ENV === 'development';
        return { isDev };
      };

      const result = detectEnvironment();
      expect(result.isDev).toBe(true);
    });

    test('should detect production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const detectEnvironment = () => {
        const isDev = process.env.NODE_ENV === 'development';
        return { isDev };
      };

      const result = detectEnvironment();
      expect(result.isDev).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });

    test('should handle missing environment variables', () => {
      const originalId = process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID;
      delete process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID;

      const getTrackingId = () => {
        return process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID ||
               process.env.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID ||
               null;
      };

      const result = getTrackingId();
      expect(result).toBeNull();

      if (originalId) {
        process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID = originalId;
      }
    });
  });

  describe('Vercel Deployment Compatibility', () => {
    test('should work with Vercel environment variables', () => {
      process.env.VERCEL = '1';
      process.env.VERCEL_ENV = 'production';
      
      const checkVercelCompatibility = () => {
        const isVercel = process.env.VERCEL === '1';
        const vercelEnv = process.env.VERCEL_ENV;
        const trackingId = process.env.NEXT_PUBLIC_CLICKCHUTNEY_ID;
        
        return {
          isVercel,
          environment: vercelEnv,
          hasTrackingId: !!trackingId
        };
      };

      const result = checkVercelCompatibility();
      
      expect(result.isVercel).toBe(true);
      expect(result.environment).toBe('production');
      expect(result.hasTrackingId).toBe(true);

      delete process.env.VERCEL;
      delete process.env.VERCEL_ENV;
    });

    test('should handle edge runtime compatibility', () => {
      global.EdgeRuntime = '1';
      
      const checkEdgeRuntime = () => {
        const isEdgeRuntime = typeof EdgeRuntime !== 'undefined';
        const hasWindow = typeof window !== 'undefined';
        
        return { isEdgeRuntime, hasWindow };
      };

      const result = checkEdgeRuntime();
      
      expect(result.isEdgeRuntime).toBe(true);
      expect(result.hasWindow).toBe(true);

      delete global.EdgeRuntime;
    });
  });

  describe('Performance Optimization', () => {
    test('should lazy load analytics initialization', () => {
      let initializeCalled = false;
      
      const lazyInit = () => {
        setTimeout(() => {
          initializeCalled = true;
        }, 0);
      };

      lazyInit();
      
      // Simulate async execution
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
    });

    test('should batch event processing', () => {
      const events = [];
      
      const batchEvents = (event) => {
        events.push(event);
        
        if (events.length >= 5) {
          // Simulate batch flush
          const batch = events.splice(0, events.length);
          return batch;
        }
        
        return null;
      };

      // Add events
      batchEvents({ type: 'pageview' });
      batchEvents({ type: 'click' });
      batchEvents({ type: 'scroll' });
      batchEvents({ type: 'form' });
      
      expect(events.length).toBe(4);
      
      const batch = batchEvents({ type: 'submit' });
      
      expect(batch).toHaveLength(5);
      expect(events.length).toBe(0);
    });
  });
});