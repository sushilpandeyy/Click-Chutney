// src/app/middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth',
]

const authRoutes = [
  '/login',
  '/register',
]

const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/settings',
  '/api/protected',
]

function matchesPath(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.includes('/api/')) {
      return pathname.startsWith(pattern)
    }
    return pathname === pattern || pathname.startsWith(pattern + '/')
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = matchesPath(pathname, protectedRoutes)

  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    const isAuthenticated = !!session?.user
    const isPublicRoute = matchesPath(pathname, publicRoutes)
    const isAuthRoute = matchesPath(pathname, authRoutes)

    if (isAuthRoute && isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get('redirectTo') || '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isPublicRoute || isAuthenticated) {
      return NextResponse.next()
    }

    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\..*$).*)',
  ],
}

export async function requireAuth(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return {
        authenticated: false,
        user: null,
        error: 'Authentication required'
      }
    }

    return {
      authenticated: true,
      user: session.user,
      error: null
    }
  } catch (error) {
    return {
      authenticated: false,
      user: null,
      error: 'Session validation failed'
    }
  }
}

export async function getCurrentUser(request: NextRequest) {
  const authResult = await requireAuth(request)
  return authResult.authenticated ? authResult.user : null
}