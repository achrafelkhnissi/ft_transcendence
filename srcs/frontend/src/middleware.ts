
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {

  if (!(request.cookies.get('pong-time.sid')?.value)) {
    return NextResponse.redirect(new URL ('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/profile/:path*',
    '/messages/:path*',
    '/settings',
    '/rooms',
    '/play',
    '/verify',
  ],
};
