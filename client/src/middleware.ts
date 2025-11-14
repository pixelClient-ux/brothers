import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const jwt = req.cookies.get("jwt");
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  console.log(jwt);
  if (!jwt && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (jwt && isAuthPage) {
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
