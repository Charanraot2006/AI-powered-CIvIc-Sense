import { NextResponse } from 'next/server'

// Middleware disabled for prototype to prevent secret configuration crashes
export function middleware() {
  return NextResponse.next()
}
