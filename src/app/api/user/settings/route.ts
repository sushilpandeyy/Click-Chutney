import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

async function getUserFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    return session?.user
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}

interface UserSettings {
  emailNotifications: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  dataRetentionDays: number
  timezone: string
  theme: 'light' | 'dark' | 'system'
}

const DEFAULT_SETTINGS: UserSettings = {
  emailNotifications: true,
  weeklyReports: true,
  monthlyReports: true,
  dataRetentionDays: 365,
  timezone: 'UTC',
  theme: 'dark'
}

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return default settings
    // In the future, this could be stored in a separate UserSettings table
    const settings = DEFAULT_SETTINGS

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/user/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      emailNotifications,
      weeklyReports,
      monthlyReports,
      dataRetentionDays,
      timezone,
      theme
    } = await request.json()

    // Validate input
    const updatedSettings: Partial<UserSettings> = {}

    if (typeof emailNotifications === 'boolean') {
      updatedSettings.emailNotifications = emailNotifications
    }

    if (typeof weeklyReports === 'boolean') {
      updatedSettings.weeklyReports = weeklyReports
    }

    if (typeof monthlyReports === 'boolean') {
      updatedSettings.monthlyReports = monthlyReports
    }

    if (typeof dataRetentionDays === 'number' && dataRetentionDays >= 30 && dataRetentionDays <= 3650) {
      updatedSettings.dataRetentionDays = dataRetentionDays
    }

    if (typeof timezone === 'string' && timezone.length > 0) {
      updatedSettings.timezone = timezone
    }

    if (typeof theme === 'string' && ['light', 'dark', 'system'].includes(theme)) {
      updatedSettings.theme = theme as 'light' | 'dark' | 'system'
    }

    // For now, just return the updated settings
    // In the future, store in database
    const finalSettings = {
      ...DEFAULT_SETTINGS,
      ...updatedSettings
    }

    return NextResponse.json({ settings: finalSettings })
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}