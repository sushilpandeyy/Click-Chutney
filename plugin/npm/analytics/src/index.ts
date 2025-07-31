import { ClickChutneyTracker } from './tracker';
import { ClickChutneyConfig } from './types';

// Global instance
let globalTracker: ClickChutneyTracker | null = null;

// Main API class
class ClickChutneyAPI {
  private tracker: ClickChutneyTracker | null = null;

  init(trackingId?: string, config?: Partial<ClickChutneyConfig>): void {
    // Auto-detect tracking ID if not provided
    const autoTrackingId = trackingId || 
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLICKCHUTNEY_ID) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_CLICKCHUTNEY_TRACKING_ID) ||
      (typeof process !== 'undefined' && process.env?.CLICKCHUTNEY_TRACKING_ID);

    if (!autoTrackingId) {
      throw new Error('ClickChutney: trackingId is required. Provide it as a parameter or set NEXT_PUBLIC_CLICKCHUTNEY_ID environment variable.');
    }

    // Auto-detect environment
    const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    
    this.tracker = new ClickChutneyTracker({
      trackingId: autoTrackingId,
      debug: isDev,
      ...config
    });

    globalTracker = this.tracker;
  }

  page(url?: string, title?: string): void {
    this.ensureInitialized();
    this.tracker!.page(url, title);
  }

  track(event: string, properties?: Record<string, any>): void {
    this.ensureInitialized();
    this.tracker!.track(event, properties);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.ensureInitialized();
    this.tracker!.identify(userId, traits);
  }

  set(properties: Record<string, any>): void {
    this.ensureInitialized();
    this.tracker!.set(properties);
  }

  flush(): Promise<void> {
    this.ensureInitialized();
    return this.tracker!.flush();
  }

  reset(): void {
    this.ensureInitialized();
    this.tracker!.reset();
  }

  destroy(): void {
    if (this.tracker) {
      this.tracker.destroy();
      this.tracker = null;
      globalTracker = null;
    }
  }

  forceFlush(): Promise<void> {
    this.ensureInitialized();
    return this.tracker!.forceFlush();
  }

  private ensureInitialized(): void {
    if (!this.tracker) {
      throw new Error('ClickChutney: Must call init() before using other methods');
    }
  }
}

// Create singleton instance
const ClickChutney = new ClickChutneyAPI();

// Auto-initialization from meta tag
function autoInit(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Check for meta tag with tracking ID
  const metaTag = document.querySelector('meta[name="clickchutney-site-id"]') as HTMLMetaElement;
  if (metaTag && metaTag.content) {
    ClickChutney.init(metaTag.content, { debug: false });
  }

  // Check for verification meta tag and auto-init with that ID
  const verificationTag = document.querySelector('meta[name="clickchutney-verification"]') as HTMLMetaElement;
  if (verificationTag && verificationTag.content && !metaTag) {
    ClickChutney.init(verificationTag.content, { debug: false });
  }
}

// Auto-init when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
}

// Legacy API support for script tag usage
declare global {
  interface Window {
    cc: (command: string, ...args: any[]) => void;
    ClickChutney: ClickChutneyAPI;
  }
}

// Global cc function for script tag usage
if (typeof window !== 'undefined') {
  window.cc = (command: string, ...args: any[]) => {
    switch (command) {
      case 'init':
        ClickChutney.init(args[0], args[1]);
        break;
      case 'page':
        ClickChutney.page(args[0], args[1]);
        break;
      case 'track':
        ClickChutney.track(args[0], args[1]);
        break;
      case 'identify':
        ClickChutney.identify(args[0], args[1]);
        break;
      case 'set':
        ClickChutney.set(args[0]);
        break;
      case 'flush':
        try {
          ClickChutney.forceFlush();
        } catch (e) {
          console.warn('ClickChutney: Cannot flush - not initialized');
        }
        break;
      default:
        console.warn(`ClickChutney: Unknown command "${command}"`);
    }
  };

  window.ClickChutney = ClickChutney;
}

// Export for ES modules
export default ClickChutney;
export { ClickChutneyTracker };
export * from './types';

// React / Next.js exports - use the simple component pattern shown in docs

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClickChutney;
  module.exports.default = ClickChutney;
  module.exports.ClickChutneyTracker = ClickChutneyTracker;
}