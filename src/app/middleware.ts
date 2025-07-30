// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { betterAuth } from 'better-auth'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile', 
  '/settings',
  '/projects',
  '/analytics',
  '/team'
]

// Define auth routes that should redirect if already authenticated
const authRoutes = ['/login', '/register', '/forgot-password']

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/terms',
  '/privacy',
  '/api/auth',
  '/api/public'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes (except auth API)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Get session from Better Auth
  const sessionToken = request.cookies.get('better-auth.session_token')?.value
  let isAuthenticated = false
  let user: { id: string; email: string } | null = null

  if (sessionToken) {
    try {
      // Verify session with Better Auth
      // This would typically involve validating the token
      // For now, we'll assume the presence of the token means authenticated
      isAuthenticated = true
      // Example: Assign a mock user object for demonstration
      user = { id: '123', email: 'user@example.com' }
      // In production, fetch user info from your auth provider here
    } catch (error) {
      console.error('Session validation error:', error)
      // Remove invalid session
      const response = NextResponse.next()
      response.cookies.delete('better-auth.session_token')
      return response
    }
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle auth routes (redirect if already authenticated)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  // Add user info to headers for authenticated requests
  if (isAuthenticated && user) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-email', user.email)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - except /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\..*).*)/',
  ],
}