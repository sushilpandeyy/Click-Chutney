// src/lib/auth-client.ts
"use client"

import { createAuthClient } from "better-auth/react"
import type { Session, User } from "./auth"

// Create the auth client for client-side operations
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
})

// Export commonly used hooks and functions
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

// Custom hooks for ClickChutney
export const useAuth = () => {
  const session = useSession()
  
  return {
    user: session.data?.user ?? null,
    session: session.data ?? null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    error: session.error,
  }
}

// Authentication actions with ClickChutney-specific error handling
export const authActions = {
  async signIn(email: string, password: string) {
    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        return {
          success: false,
          error: getSpicyErrorMessage(result.error.message ?? "Unknown error"),
        }
      }

      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Something went wrong! Our samosas are burning 🔥",
      }
    }
  },

  async signUp(email: string, password: string, name: string) {
    try {
      const result = await signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        return {
          success: false,
          error: getSpicyErrorMessage(result.error.message ?? "Unknown error"),
        }
      }

      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Registration failed! The chutney jar is full 🫙",
      }
    }
  },

  async signOut() {
    try {
      await signOut()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: "Logout failed! You're stuck in the kitchen 👨‍🍳",
      }
    }
  },
}

// Spicy error messages for ClickChutney theme
function getSpicyErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    "Invalid credentials": "Wrong combo! Like putting ketchup on samosas 🍅",
    "User not found": "User not in our recipe book! Try registering first 📚",
    "User already exists": "This chef is already in our kitchen! Try logging in 👨‍🍳",
    "Password too weak": "Password needs more spice! Make it at least 8 characters 🌶️",
    "Invalid email": "Email format is off! Like putting salt in chai ☕",
    "Too many attempts": "Slow down, chef! Too many attempts. Take a chai break ☕",
    "Session expired": "Your session has gone stale! Time to log in again 🍞",
    "Network error": "Connection is as slow as street traffic! Try again 🚗",
  }

  // Find matching error or return a default spicy message
  const matchedError = Object.keys(errorMessages).find(key => 
    error.toLowerCase().includes(key.toLowerCase())
  )

  return matchedError ? errorMessages[matchedError] : 
    "Something's not right in the kitchen! Please try again 🍳"
}

// Utility function to check if user is authenticated on client
export const checkAuth = async () => {
  const sessionResult = await getSession()
  // sessionResult may be an error or a data object
  if ('data' in sessionResult && sessionResult.data) {
    return {
      isAuthenticated: !!sessionResult.data.user,
      user: sessionResult.data.user ?? null,
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  }
}

// Types for better TypeScript support
export type AuthUser = User
export type AuthSession = Session
export type AuthResult<T = any> = {
  success: boolean
  data?: T
  error?: string
}

// Local storage helpers for remember me functionality
export const authStorage = {
  setRememberMe: (remember: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clickchutney-remember', remember.toString())
    }
  },
  
  getRememberMe: (): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clickchutney-remember') === 'true'
    }
    return false
  },
  
  clearRememberMe: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clickchutney-remember')
    }
  },
}