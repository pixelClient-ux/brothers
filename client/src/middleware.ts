// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const jwt = req.cookies.get("jwt")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
    "/confirm_email",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Skip API routes and static assets
  const isApiRoute =
    pathname.startsWith("/api") || pathname.startsWith("/_next");

  if (isApiRoute) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected page
  if (!jwt && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and tries to access a public page like login/signup
  if (jwt && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Otherwise, allow access
  return NextResponse.next();
}

// 👇 Only run middleware on pages, skip static assets and API
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|css|js)).*)",
  ],
};
