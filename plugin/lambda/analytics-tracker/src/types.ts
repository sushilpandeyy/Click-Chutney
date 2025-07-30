export interface AnalyticsEvent {
  trackingId: string
  event: string
  domain: string
  timestamp: string
  sessionId: string
  userId?: string
  data: Record<string, any>
  userAgent?: string
  url?: string
  referrer?: string
  ipAddress?: string
  country?: string
  city?: string
}

export interface BatchAnalyticsRequest {
  events: AnalyticsEvent[]
  trackingId: string
  domain: string
}

export interface AnalyticsResponse {
  success: boolean
  eventIds?: string[]
  verified?: boolean
  error?: string
}

export interface Project {
  _id: string
  trackingId: string
  domain: string
  url: string
  isVerified: boolean
  verifiedAt?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface EventDocument {
  _id?: string
  projectId: string
  type: string
  data: Record<string, any>
  userAgent?: string
  ipAddress?: string
  country?: string
  city?: string
  createdAt: Date
}