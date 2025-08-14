import { PrismaClient, $Enums } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

let prismaClient: PrismaClient

try {
  prismaClient = global.__prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV === 'development') {
    global.__prisma = prismaClient
  }
} catch (error) {
  console.warn('Prisma client initialization failed during build:', error)
  prismaClient = {} as PrismaClient
}

export const prisma = prismaClient
export default prisma

export type {
  User,
  Project,
  AnalyticsEvent,
  ProjectStats
} from '@prisma/client'

export const ProjectStatus = $Enums?.ProjectStatus || {
  PENDING_SETUP: 'PENDING_SETUP',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

export type ProjectStatus = $Enums.ProjectStatus