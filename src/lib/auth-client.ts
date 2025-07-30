"use client"

import { createAuthClient } from "better-auth/react"

export const {
  signIn,
  signOut,
  useSession,
  getSession,
} = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
})

export const authActions = {
  async signInWithGitHub(redirectTo?: string) {
    try {
      const result = await signIn.social({
        provider: "github",
        callbackURL: redirectTo || "/dashboard",
      })
      return { success: true, data: result }
    } catch (error) {
      console.error("GitHub sign-in failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "GitHub sign-in failed"
      }
    }
  },

  async signOut() {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login"
          },
        },
      })
      return { success: true }
    } catch (error) {
      console.error("Sign out failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign out failed"
      }
    }
  },
}
