// Global ClickChutney instance for Next.js components
import { ClickChutneyTracker } from '../tracker';
import type { ClickChutneyConfig } from '../types';

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

  private ensureInitialized(): void {
    if (!this.tracker) {
      throw new Error('ClickChutney: Must call init() before using other methods');
    }
  }
}

export default new ClickChutneyAPI();