// Next.js specific entry point
export { ClickChutneyProvider, useClickChutney } from './nextjs/provider';
export { RouterTracking, withClickChutney } from './nextjs/router-tracking';
export { TrackingButton, TrackingLink, TrackingForm } from './nextjs/components';

// Re-export core functionality  
export { ClickChutneyTracker } from './tracker';
export * from './types';

// Create a default export that matches the main index
import { ClickChutneyTracker } from './tracker';
import type { ClickChutneyConfig } from './types';

// Singleton instance for Next.js usage (matches main index.ts pattern)
let globalTracker: ClickChutneyTracker | null = null;

class ClickChutneyAPI {
  init(trackingId: string, config?: Partial<ClickChutneyConfig>): void {
    globalTracker = new ClickChutneyTracker({ trackingId, ...config });
  }

  page(url?: string, title?: string): void {
    globalTracker?.page(url, title);
  }

  track(event: string, properties?: Record<string, any>): void {
    globalTracker?.track(event, properties);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    globalTracker?.identify(userId, traits);
  }

  set(properties: Record<string, any>): void {
    globalTracker?.set(properties);
  }
}

export default new ClickChutneyAPI();