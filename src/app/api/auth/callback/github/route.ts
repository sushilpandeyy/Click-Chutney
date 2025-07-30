import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      console.error('GitHub OAuth Error:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'GitHub authentication failed')
      return NextResponse.redirect(loginUrl)
    }
    
    if (!code) {
      console.error('GitHub OAuth: Missing authorization code')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'Authorization code missing')
      return NextResponse.redirect(loginUrl)
    }
    
    const authUrl = new URL('/api/auth/callback/github', request.url)
    authUrl.search = url.search
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('GitHub callback error:', error)
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'Authentication failed')
    return NextResponse.redirect(loginUrl)
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed for OAuth callback' },
    { status: 405 }
  )
}