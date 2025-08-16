import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const baseURL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const githubClientId = process.env.AUTH_GITHUB_ID
    const callbackURL = `${baseURL}/api/auth/callback/github`
    
    return NextResponse.json({
      status: 'ok',
      config: {
        baseURL,
        callbackURL,
        githubConfigured: !!githubClientId,
        environment: process.env.NODE_ENV,
        databaseName: 'DEV'
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Configuration test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}