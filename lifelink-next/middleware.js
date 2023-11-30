import { NextResponse } from 'next/server';
import axios from 'axios';
 
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token');
  const isPublicPath = path === '/' || path.includes('/login') || path.includes('/register')
  // return NextResponse.redirect(new URL('', request.url))
}
 
export const config = {
  matcher: ['/', '/login', '/register', '/admin/:path*', '/user/:path*'],
}