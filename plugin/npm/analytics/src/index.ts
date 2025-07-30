import { ClickChutneyTracker } from './tracker';
import { ClickChutneyConfig } from './types';

// Global instance
let globalTracker: ClickChutneyTracker | null = null;

// Main API class
class ClickChutneyAPI {
  private tracker: ClickChutneyTracker | null = null;

  init(trackingId: string, config?: Partial<ClickChutneyConfig>): void {
    if (!trackingId) {
      throw new Error('ClickChutney: trackingId is required');
    }

    this.tracker = new ClickChutneyTracker({
      trackingId,
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
    ClickChutney: typeof ClickChutney;
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

// Next.js / React exports (import from ./nextjs for Next.js usage)
// export { ClickChutneyProvider, useClickChutney } from './nextjs/provider';
// export { RouterTracking, withClickChutney } from './nextjs/router-tracking';  
// export { TrackingButton, TrackingLink, TrackingForm } from './nextjs/components';

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClickChutney;
  module.exports.default = ClickChutney;
  module.exports.ClickChutneyTracker = ClickChutneyTracker;
}