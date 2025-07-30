"use client"

import { createAuthClient } from "better-auth/react"

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
})

export const authActions = {
  async signInWithGitHub() {
    try {
      return await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      throw new Error("GitHub sign-in failed")
    }
  },

  async signIn(email: string, password: string) {
    try {
      return await signIn.email({ email, password })
    } catch (error) {
      throw new Error("Email sign-in failed")
    }
  },

  async signUp(email: string, password: string, name: string) {
    try {
      return await signUp.email({ email, password, name })
    } catch (error) {
      throw new Error("Registration failed")
    }
  },

  async signOut() {
    try {
      return await signOut()
    } catch (error) {
      throw new Error("Sign out failed")
    }
  },
}