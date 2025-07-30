import { MongoClient, Db, Collection } from 'mongodb'
import { Project, EventDocument } from './types.js'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb
  }

  const uri = process.env.DATABASE_URL
  if (!uri) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri)
    await cachedClient.connect()
  }

  cachedDb = cachedClient.db()
  return cachedDb
}

export async function getProjectByTrackingId(trackingId: string): Promise<Project | null> {
  const db = await connectToDatabase()
  const projects = db.collection<Project>('projects')
  
  return await projects.findOne({ trackingId })
}

export async function updateProjectVerification(trackingId: string): Promise<void> {
  const db = await connectToDatabase()
  const projects = db.collection<Project>('projects')
  
  await projects.updateOne(
    { trackingId },
    {
      $set: {
        isVerified: true,
        verifiedAt: new Date(),
        updatedAt: new Date()
      }
    }
  )
}

export async function insertEvents(events: EventDocument[]): Promise<string[]> {
  const db = await connectToDatabase()
  const eventsCollection = db.collection<EventDocument>('events')
  
  const result = await eventsCollection.insertMany(events)
  return Object.values(result.insertedIds).map(id => id.toString())
}

export async function getEventCount(projectId: string, timeframe: 'day' | 'week' | 'month' = 'day'): Promise<number> {
  const db = await connectToDatabase()
  const eventsCollection = db.collection<EventDocument>('events')
  
  const now = new Date()
  let startDate: Date
  
  switch (timeframe) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }
  
  return await eventsCollection.countDocuments({
    projectId,
    createdAt: { $gte: startDate }
  })
}