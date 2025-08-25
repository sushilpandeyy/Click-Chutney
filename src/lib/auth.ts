import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"


const getDatabaseConfig = () => {
  const baseUrl = process.env.DATABASE_URL
  const dbName = 'DEV'
  
  if (!baseUrl) {
    return {
      url: `mongodb://localhost:27017/${dbName}`,
      dbName
    }
  }
  
  // Handle different URL formats
  if (baseUrl.includes('mongodb://') || baseUrl.includes('mongodb+srv://')) {
    const urlParts = baseUrl.split('/')
    if (urlParts.length > 3 && urlParts[3] && !urlParts[3].startsWith('?')) {
      return {
        url: baseUrl,
        dbName: urlParts[3].split('?')[0]
      }
    } else {
      const hasQuery = baseUrl.includes('?')
      return {
        url: hasQuery ? baseUrl.replace('?', `/${dbName}?`) : `${baseUrl}/${dbName}`,
        dbName
      }
    }
  }
  
  return {
    url: baseUrl,
    dbName
  }
}

const getGitHubConfig = () => {
  // During build time, skip credential validation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      clientId: "build-time-dummy",
      clientSecret: "build-time-dummy",
    }
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    console.warn('⚠️ GitHub OAuth credentials not found, using dummy values')
    return {
      clientId: "dummy-client-id",
      clientSecret: "dummy-client-secret",
    }
  }
  
  return { clientId, clientSecret }
}

const getBaseURL = () => {
  const url = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  return url.endsWith('/') ? url.slice(0, -1) : url
}

// Initialize MongoDB client for Better Auth (separate from Prisma)
let authClient: MongoClient | null = null
let authDb: ReturnType<MongoClient['db']> | null = null

// Skip database initialization during build time
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  try {
    const dbConfig = getDatabaseConfig()
    authClient = new MongoClient(dbConfig.url, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 5,
      retryWrites: true,
      retryReads: true
    })
    authDb = authClient.db(dbConfig.dbName)
    
    // Log successful connection in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Better Auth connected to database: ${dbConfig.dbName}`)
    }
  } catch (error) {
    console.warn("Better Auth MongoDB client initialization failed:", error)
    authClient = null
    authDb = null
  }
}

const githubConfig = getGitHubConfig()

const createAuthConfig = () => {
  const baseConfig = {
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: githubConfig,
    },
    plugins: [nextCookies()],
    baseURL: getBaseURL(),
    secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "default-secret-change-in-production",
    logger: {
      level: 'error' as const  // Reduce logging noise
    },
    user: {
      additionalFields: {
        githubId: {
          type: "string" as const,
          required: false,
        },
        githubLogin: {
          type: "string" as const, 
          required: false,
        }
      }
    }
  }

  // Add database configuration if available
  if (process.env.NEXT_PHASE !== 'phase-production-build' && authDb && typeof authDb.collection === 'function') {
    return {
      ...baseConfig,
      database: mongodbAdapter(authDb)
    }
  }

  return baseConfig
}

export const auth = betterAuth(createAuthConfig())