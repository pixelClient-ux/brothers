import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const jwt = req.cookies.get("jwt")?.value;
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If user is not authenticated and trying to access a protected page
  if (!jwt && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and tries to access a public page like login/signup
  if (jwt && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// 👇 Add this part to prevent blocking static assets
export const config = {
  matcher: [
    // Run middleware on all routes except these
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|css|js)).*)",
  ],
};
