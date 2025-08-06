import { SessionData, UserData } from './types';

export class Storage {
  private static isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
    try {
      const test = '__cc_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static get(key: string): string | null {
    if (!this.isLocalStorageAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static set(key: string, value: string): void {
    if (!this.isLocalStorageAvailable()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  }

  static remove(key: string): void {
    if (!this.isLocalStorageAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }
}

export function generateId(): string {
  return `cc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function getCurrentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
}

export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

export function getPageTitle(): string {
  if (typeof document === 'undefined') return '';
  return document.title;
}

export function getReferrer(): string {
  if (typeof document === 'undefined') return '';
  return document.referrer;
}

export function getUserAgent(): string {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export class SessionManager {
  private static readonly SESSION_KEY = '__cc_session__';
  private static sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private static currentSession: SessionData | null = null;
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  static getSession(): SessionData | null {
    const sessionStr = Storage.get(this.SESSION_KEY);
    if (!sessionStr) return null;

    try {
      const session: SessionData = JSON.parse(sessionStr);
      const now = Date.now();
      
      // Check if session is expired
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  static createSession(): SessionData {
    const session: SessionData = {
      id: generateId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      isActive: true
    };

    this.saveSession(session);
    return session;
  }

  static updateSession(updates: Partial<SessionData>): SessionData {
    const session = this.getSession() || this.createSession();
    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: Date.now()
    };

    this.saveSession(updatedSession);
    return updatedSession;
  }

  static saveSession(session: SessionData): void {
    Storage.set(this.SESSION_KEY, JSON.stringify(session));
  }

  static clearSession(): void {
    Storage.remove(this.SESSION_KEY);
  }
}

export class UserManager {
  private static readonly USER_KEY = '__cc_user__';

  static getUser(): UserData | null {
    const userStr = Storage.get(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static setUser(userData: UserData): void {
    const existingUser = this.getUser() || {};
    const now = Date.now();
    
    const user: UserData = {
      ...existingUser,
      ...userData,
      firstSeen: existingUser.firstSeen || now,
      lastSeen: now
    };

    Storage.set(this.USER_KEY, JSON.stringify(user));
  }

  static clearUser(): void {
    Storage.remove(this.USER_KEY);
  }
}

export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return {};

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    
    // Try to get LCP, but handle cases where it might not be available
    let lcp;
    try {
      lcp = performance.getEntriesByType('largest-contentful-paint')[0];
    } catch {
      lcp = null;
    }

    const metrics: Record<string, number | undefined> = {};

    if (navigation && navigation.loadEventEnd && navigation.fetchStart) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      if (loadTime > 0 && loadTime < 60000) { // Sanity check: less than 60 seconds
        metrics.loadTime = Math.round(loadTime);
      }
    }

    if (fcp && fcp.startTime > 0) {
      metrics.fcp = Math.round(fcp.startTime);
    }

    if (lcp && lcp.startTime > 0) {
      metrics.lcp = Math.round(lcp.startTime);
    }

    return metrics;
  } catch (error) {
    // Performance API might not be fully supported or accessible
    return {};
  }
}

/**
 * Queue management utilities
 */
export class QueueManager<T> {
  private items: T[] = [];
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  enqueue(item: T): void {
    this.items.push(item);
    if (this.items.length > this.maxSize) {
      this.items.shift(); // Remove oldest item
    }
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  dequeueAll(): T[] {
    const items = [...this.items];
    this.items = [];
    return items;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * Retry utility with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  maxDelay = 10000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 1000, maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Network status detection
 */
export class NetworkManager {
  private static isOnlineCache: boolean | null = null;
  private static listeners: Array<(online: boolean) => void> = [];

  static isOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    
    if (this.isOnlineCache !== null) return this.isOnlineCache;
    
    this.isOnlineCache = navigator.onLine;
    
    // Set up listeners only once
    if (typeof window !== 'undefined' && this.listeners.length === 0) {
      window.addEventListener('online', () => {
        this.isOnlineCache = true;
        this.notifyListeners(true);
      });
      
      window.addEventListener('offline', () => {
        this.isOnlineCache = false;
        this.notifyListeners(false);
      });
    }
    
    return this.isOnlineCache;
  }

  static onNetworkChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private static notifyListeners(online: boolean): void {
    this.listeners.forEach(callback => {
      try {
        callback(online);
      } catch (error) {
        console.warn('ClickChutney: Network listener error:', error);
      }
    });
  }
}

/**
 * URL and domain utilities
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*$/;
  return domainRegex.test(domain);
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}