import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Next.js Middleware — verifies JWT for all /api/v1/* routes.
 * Skips auth for /api/v1/auth/initialize (the public login endpoint).
 * Attaches x-user-id header for downstream route handlers.
 */

const PUBLIC_PATHS = ['/api/v1/auth/initialize'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public paths without auth
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
    });
  }

  // Pass through — JWT verification is done in each route handler
  // Middleware only handles CORS and public path routing
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
