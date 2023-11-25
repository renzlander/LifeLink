import { NextResponse } from 'next/server';
import axios from 'axios';
// const jwt = require('jsonwebtoken');
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token');
  const isPublicPath = path === '/' || path.includes('/login') || path.includes('/register')
  // return NextResponse.redirect(new URL('', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/register', '/admin/:path*', '/user/:path*'],
}