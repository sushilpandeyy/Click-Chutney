"use client"

const STORAGE_KEYS = {
  REMEMBER_ME: 'clickchutney_remember_me',
  USER_PREFERENCES: 'clickchutney_user_prefs',
} as const

export const authStorage = {
  getRememberMe(): boolean {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    } catch {
      return false
    }
  },

  setRememberMe(value: boolean): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, value.toString())
    } catch {
      console.warn('Failed to save remember me preference')
    }
  },

  clearUserData(): void {
    if (typeof window === 'undefined') return
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch {
      console.warn('Failed to clear user data from storage')
    }
  },

  getUserPreferences(): Record<string, any> {
    if (typeof window === 'undefined') return {}
    try {
      const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return prefs ? JSON.parse(prefs) : {}
    } catch {
      return {}
    }
  },

  setUserPreferences(preferences: Record<string, any>): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
    } catch {
      console.warn('Failed to save user preferences')
    }
  }
}
