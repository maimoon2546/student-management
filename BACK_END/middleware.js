import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  const allowedOrigins = [
    "http://localhost:3000",
    "https://student-management-zco5.vercel.app"
  ];

  const origin = request.headers.get("origin");

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
