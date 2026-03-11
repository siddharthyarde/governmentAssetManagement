/**
 * GAMS — Buyer (Institutional) Portal Middleware
 * Homepage / is public.
 * All dashboard / browse / request routes require institutional login.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser, isAlwaysPublic } from "@gams/lib/supabase/middleware";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/auth/callback",
  "/auth/confirm",
];

function isPublicPath(pathname: string): boolean {
  if (isAlwaysPublic(pathname)) return true;
  return PUBLIC_PATHS.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    const { response } = await getSessionUser(request);
    return response;
  }

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
