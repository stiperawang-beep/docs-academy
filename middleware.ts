import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'vd_session'
const PROTECTED_PATHS = ['/tutorial', '/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const session = request.cookies.get(AUTH_COOKIE)
  
  // Already authenticated — allow through
  if (session?.value === 'authenticated') return NextResponse.next()

  // Not authenticated — redirect to login exactly once
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/tutorial/:path*', '/dashboard'],
}
