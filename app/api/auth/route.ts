import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { username, password } = body

  // Simple credential check (replace with real DB call)
  if (username === 'admin' && password === 'admin') {
    const response = NextResponse.json({ success: true })
    response.cookies.set('vd_session', 'authenticated', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('vd_session')
  return response
}
