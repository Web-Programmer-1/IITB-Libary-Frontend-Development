import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedPaths = [
  '/dashboard',
  '/my-dashboard',
  '/profile',
  '/circulation',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // We check for the token in cookies or rely on client-side redirect
  // Since JWT is stored in localStorage (not cookies), we can't check server-side
  // The client-side AuthProvider and API interceptor will handle the redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
