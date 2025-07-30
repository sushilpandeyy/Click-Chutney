import { SessionData, UserData } from './types';

export class Storage {
  private static isLocalStorageAvailable(): boolean {
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
  return `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getCurrentUrl(): string {
  return window.location.href;
}

export function getCurrentDomain(): string {
  return window.location.hostname;
}

export function getCurrentPath(): string {
  return window.location.pathname;
}

export function getPageTitle(): string {
  return document.title;
}

export function getReferrer(): string {
  return document.referrer;
}

export function getUserAgent(): string {
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
      events: 0
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
  if (!window.performance) return {};

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
  const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

  return {
    loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : undefined,
    fcp: fcp ? Math.round(fcp.startTime) : undefined,
    lcp: lcp ? Math.round(lcp.startTime) : undefined,
    // CLS and FID would need additional implementation
  };
}