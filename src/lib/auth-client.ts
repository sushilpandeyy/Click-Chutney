// src/lib/auth-client.ts
"use client"

import { createAuthClient } from "better-auth/react"
import type { Session, User } from "./auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient

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
    "Server error": "Our kitchen is having issues! Chef is fixing it 👨‍🍳",
  }

  return errorMessages[error] || `Something's not right in the kitchen! ${error} 🤔`
}