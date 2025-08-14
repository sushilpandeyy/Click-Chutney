import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    return "mongodb://localhost:27017/clickchutney"
  }
  return url
}

const getGitHubConfig = () => {
  const clientId = process.env.AUTH_GITHUB_ID
  const clientSecret = process.env.AUTH_GITHUB_SECRET
  
  if (!clientId || !clientSecret) {
    return {
      clientId: "dummy-client-id",
      clientSecret: "dummy-client-secret",
    }
  }
  
  return { clientId, clientSecret }
}

let client: MongoClient
let db: any

try {
  client = new MongoClient(getDatabaseUrl())
  db = client.db()
} catch (error) {
  console.warn("MongoDB client initialization failed during build:", error)
  client = {} as MongoClient
  db = {}
}

const githubConfig = getGitHubConfig()

export const auth = betterAuth({
  database: db && typeof db.collection === 'function' ? mongodbAdapter(db) : undefined,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: githubConfig,
  },
  plugins: [nextCookies()],
  baseURL: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "default-secret-change-in-production",
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
  }
})