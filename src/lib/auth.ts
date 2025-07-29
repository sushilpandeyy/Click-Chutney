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
    },
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  // 🌶️ NEW: Add GitHub OAuth
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Optional: Request specific scopes
      scope: ["user:email", "read:user"],
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-change-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
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
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
        input: true,
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
  
  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    disabled: false,
  },

  // 🌶️ Optional: Add custom callbacks for GitHub login
  callbacks: {
    after: [
      {
        matcher(context: { path: string }) {
          return context.path === "/sign-up/social"
        },
        handler: async (ctx: { user?: { email?: string } }) => {
          console.log("🎉 New chef joined via GitHub!", ctx.user?.email)
          // You can add custom logic here (e.g., send welcome email, analytics)
        }
      }
    ]
  }
})

export default auth.handler
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user