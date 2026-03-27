// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set(
    'Access-Control-Allow-Origin',
    'http://localhost:3000'
  );
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  // ===== เพิ่มส่วนนี้ (รองรับ localhost) =====
  const origin = request.headers.get('origin');

  if (origin === 'http://localhost:3000') {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  // ==========================================

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
