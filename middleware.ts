import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'unsafe-eval' 'unsafe-inline' 'self' https:; style-src 'unsafe-inline' 'self'; img-src 'self' data:;"
  );
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = { matcher: '/api/:path*' };