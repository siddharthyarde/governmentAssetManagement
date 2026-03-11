/**
 * GAMS — Public Portal Middleware
 * Most routes are public (marketplace browsing).
 * Account, checkout, and order routes require citizen login.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser, isAlwaysPublic } from "@gams/lib/supabase/middleware";

/** Route prefixes that require authentication */
const PROTECTED_PATHS = [
  "/account",
  "/checkout",
  "/orders",
  "/wishlist",
];

function requiresAuth(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAlwaysPublic(pathname)) {
    const { response } = await getSessionUser(request);
    return response;
  }

  if (!requiresAuth(pathname)) {
    // Public page — still refresh session cookie if present
    const { response } = await getSessionUser(request);
    return response;
  }

  // Protected page
  const { user, response } = await getSessionUser(request);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
