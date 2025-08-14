import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

const getDatabaseConfig = () => {
  const baseUrl = process.env.DATABASE_URL
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  
  // Determine database name based on environment
  let dbName: string
  if (process.env.DATABASE_NAME) {
    dbName = process.env.DATABASE_NAME
  } else {
    dbName = isProduction ? 'clickchutney_prod' : 'clickchutney_dev'
  }
  
  // Handle different URL formats
  if (!baseUrl) {
    return {
      url: `mongodb://localhost:27017/${dbName}`,
      dbName
    }
  }
  
  // If URL already contains database name, use it as is
  if (baseUrl.includes('mongodb://') || baseUrl.includes('mongodb+srv://')) {
    // Check if database name is already in URL
    const urlParts = baseUrl.split('/')
    if (urlParts.length > 3 && urlParts[3] && !urlParts[3].startsWith('?')) {
      return {
        url: baseUrl,
        dbName: urlParts[3].split('?')[0]
      }
    } else {
      // Add database name to URL
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
  const clientId = process.env.AUTH_GITHUB_ID
  const clientSecret = process.env.AUTH_GITHUB_SECRET
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🍛 GitHub OAuth Config:', {
      clientId: clientId ? `${clientId.slice(0, 8)}...` : 'missing',
      clientSecret: clientSecret ? 'present' : 'missing'
    })
  }
  
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

let client: MongoClient
let db: ReturnType<MongoClient['db']>

try {
  const dbConfig = getDatabaseConfig()
  client = new MongoClient(dbConfig.url)
  db = client.db(dbConfig.dbName)
  
  // Log which database is being used (helpful for debugging)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🍛 ClickChutney connecting to database: ${dbConfig.dbName}`)
  }
} catch (error) {
  console.warn("MongoDB client initialization failed during build:", error)
  client = {} as MongoClient
  db = {} as ReturnType<MongoClient['db']>
}

const githubConfig = getGitHubConfig()

export const auth = betterAuth({
  database: db && typeof db.collection === 'function' ? mongodbAdapter(db) : undefined,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      ...githubConfig,
      redirectURI: `${getBaseURL()}/api/auth/callback/github`
    },
  },
  plugins: [nextCookies()],
  baseURL: getBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET || "default-secret-change-in-production",
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
  }
})