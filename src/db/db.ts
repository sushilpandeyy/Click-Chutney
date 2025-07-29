// src/db/db.ts
import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import * as schema from "./schema"

// Environment validation
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please add it to your .env.local file."
  )
}

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
})

// Create Drizzle instance
export const db = drizzle(pool, { 
  schema,
  logger: process.env.NODE_ENV === "development" 
})

// Helper function to test database connection
export async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT 1 as test`)
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Close database connection (useful for serverless)
export async function closeConnection() {
  try {
    await pool.end()
    console.log("🔒 Database connection closed")
  } catch (error) {
    console.error("Error closing database connection:", error)
  }
}

// Export for BetterAuth adapter
export { schema }

// Helper function for transactions
export const transaction = db.transaction

// Import sql template for raw queries if needed
import { sql } from "drizzle-orm"
export { sql }