import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'vd_session'
const PROTECTED_PATHS = ['/tutorial', '/dashboard']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const session = request.cookies.get(AUTH_COOKIE)
  if (session?.value === 'authenticated') return NextResponse.next()

  // Redirect to login with next param
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/tutorial/:path*', '/dashboard'],
}
