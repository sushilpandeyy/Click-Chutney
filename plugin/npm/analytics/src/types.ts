export interface ClickChutneyConfig {
  trackingId: string;
  apiUrl?: string;
  debug?: boolean;
  autoTrack?: boolean;
  sessionTimeout?: number;
}

export interface PageViewEvent {
  type: 'pageview';
  url: string;
  title: string;
  referrer?: string;
  path?: string;
}

export interface CustomEvent {
  type: 'event';
  name: string;
  properties?: Record<string, any>;
}

export interface PerformanceEvent {
  type: 'performance';
  metrics: {
    loadTime?: number;
    fcp?: number;
    lcp?: number;
    cls?: number;
    fid?: number;
  };
}

export interface UserIdentifyEvent {
  type: 'identify';
  userId: string;
  traits?: Record<string, any>;
}

export interface SessionEvent {
  type: 'session';
  action: 'start' | 'end';
  sessionId: string;
  duration?: number;
}

export type AnalyticsEvent = 
  | PageViewEvent 
  | CustomEvent 
  | PerformanceEvent 
  | UserIdentifyEvent 
  | SessionEvent;

export interface EventPayload {
  trackingId: string;
  event: string;
  domain: string;
  timestamp: string;
  sessionId: string;
  userId?: string;
  data: Record<string, any>;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

export interface SessionData {
  id: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: number;
}

export interface UserData {
  id?: string;
  traits?: Record<string, any>;
  firstSeen?: number;
  lastSeen?: number;
}

export interface TrackerOptions {
  debug?: boolean;
  autoTrack?: boolean;
  sessionTimeout?: number;
  queueSize?: number;
  flushInterval?: number;
}