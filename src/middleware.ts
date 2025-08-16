import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { NextRequest, NextResponse } from "next/server"

export default async function authMiddleware(request: NextRequest) {
  const isStaticRequest = !request.headers.get('user-agent') ||
    request.headers.get('purpose') === 'prefetch' ||
    process.env.NODE_ENV !== 'production' && request.nextUrl.pathname.includes('_next/static')

  if (isStaticRequest) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        retry: {
          type: "linear",
          attempts: 2,
          delay: 200
        },
        timeout: 10000,
      },
    )

    const isAuthPage = ["/login", "/signup"].includes(request.nextUrl.pathname)
    const isPublicPage = ["/", "/login", "/signup"].includes(request.nextUrl.pathname)

    if (!session && !isPublicPage) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.warn('Auth middleware error:', error);
    const isPublicPage = ["/", "/login", "/signup"].includes(request.nextUrl.pathname)
    
    // If it's an AbortError or timeout, allow the request to continue
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      console.warn('Auth check timed out, allowing request to continue');
      if (!isPublicPage) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
    
    if (!isPublicPage) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).+)",
  ],
}