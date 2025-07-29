// src/lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
   
  database: drizzleAdapter(db, {
    provider: "pg",  
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  
 
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,  
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  
 
  session: {
    expiresIn: 60 * 60 * 24 * 7, 
    updateAge: 60 * 60 * 24, 
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, 
    },
  },
  
  // Security configuration
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Cookie configuration
  cookies: {
    sessionToken: {
      name: "clickchutney.session-token",
      attributes: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,  
      },
    },
  },
   
  rateLimit: {
    window: 10000,  
    max: 100, 
    storage: "memory", 
  },
  
   
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false, 
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  
   
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
        input: true, 
      },
      avatar: {
        type: "string",
        required: false,
        input: false,  
      },
      createdAt: {
        type: "date",
        required: false,
        input: false,
        defaultValue: () => new Date(),
      },
      updatedAt: {
        type: "date",
        required: false,
        input: false,
        defaultValue: () => new Date(),
      },
    },
  },
  
   
  plugins: [
     
  ],
   
  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    disabled: false,
  },
})

export default auth.handler
 
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user