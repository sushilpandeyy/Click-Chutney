import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')

    console.log('🍛 GitHub OAuth callback received:', {
      code: code ? 'present' : 'missing',
      state: state ? 'present' : 'missing',
      error
    })

    // Handle OAuth errors
    if (error) {
      console.error('GitHub OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    // Ensure we have a code
    if (!code) {
      console.error('Missing authorization code')
      return NextResponse.redirect(
        new URL('/login?error=missing_code', request.url)
      )
    }

    // Let Better Auth handle the OAuth flow
    const authResponse = await auth.handler(request)
    
    // If Better Auth handled it successfully, it should redirect
    if (authResponse.status === 302 || authResponse.status === 307) {
      return authResponse
    }

    // Get the session to check if user was created/logged in
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (session) {
      console.log('🍛 GitHub OAuth successful for user:', session.user.id)
      
      // Update user with additional GitHub information
      await updateUserWithGitHubData(session.user.id, code)
      
      // Redirect to dashboard on success
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If no session, redirect to login with error
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    )

  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    
    // Redirect to login page with error message
    return NextResponse.redirect(
      new URL('/login?error=callback_error', request.url)
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle POST requests from Better Auth
  try {
    return await auth.handler(request)
  } catch (error) {
    console.error('GitHub OAuth POST callback error:', error)
    return NextResponse.json(
      { error: 'OAuth callback failed' },
      { status: 500 }
    )
  }
}

async function updateUserWithGitHubData(userId: string, code: string) {
  try {
    // Fetch GitHub user data using the authorization code
    const githubUser = await fetchGitHubUserData(code)
    
    if (githubUser) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          githubId: githubUser.id?.toString(),
          githubLogin: githubUser.login,
          image: githubUser.avatar_url,
          name: githubUser.name || githubUser.login,
          emailVerified: true,
          updatedAt: new Date()
        }
      })

      console.log('🍛 User updated with GitHub data:', {
        userId,
        githubLogin: githubUser.login,
        name: githubUser.name
      })
    }
  } catch (error) {
    console.error('Failed to update user with GitHub data:', error)
    // Don't throw - this is optional enhancement
  }
}

async function fetchGitHubUserData(code: string) {
  try {
    const clientId = process.env.AUTH_GITHUB_ID
    const clientSecret = process.env.AUTH_GITHUB_SECRET

    if (!clientId || !clientSecret) {
      console.warn('GitHub OAuth credentials not configured')
      return null
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      console.error('Failed to get GitHub access token:', tokenData)
      return null
    }

    // Fetch user data from GitHub API
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ClickChutney-Analytics'
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch GitHub user data:', userResponse.status)
      return null
    }

    const userData = await userResponse.json()
    
    return {
      id: userData.id,
      login: userData.login,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      company: userData.company,
      location: userData.location,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at
    }
  } catch (error) {
    console.error('Error fetching GitHub user data:', error)
    return null
  }
}