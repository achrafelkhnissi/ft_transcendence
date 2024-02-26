import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  // if (!request.cookies.get('pong-time.sid')?.value) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }
  try {
    jwt.verify(
      request.cookies.get('pong-time.auth')?.value,
      process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const token = request.nextUrl.searchParams.get('token');

  if (request.url.includes('/verify')) {
    try {
      const decoded = jwt.verify(
        token ?? '',
        process.env.JWT_SECRET ?? 'secret',
      );
      if (decoded) {
        return NextResponse.next();
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
