import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    database: {
      generateId: () => {
        // Generate a MongoDB-compatible string ID
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session['user']
