"use client"

import { createAuthClient } from "better-auth/react"

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    cache: "no-store",
  }
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession
} = authClient