export function middleware(request) {
  const response = NextResponse.next();

  const origin = request.headers.get("origin");

  response.headers.set(
    "Access-Control-Allow-Origin",
    origin || "*"
  );

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
