/**
 * GAMS — Management Portal Middleware
 * Every route (except /login and auth callbacks) requires a verified
 * management user. Unauthenticated requests are redirected to /login.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser, isAlwaysPublic } from "@gams/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/confirm"];

function isPublicPath(pathname: string): boolean {
  if (isAlwaysPublic(pathname)) return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    // Still run getUser to refresh the session cookie
    const { response } = await getSessionUser(request);
    return response;
  }

  const { user, response } = await getSessionUser(request);

  if (!user) {
    // Preserve the intended destination so we can redirect after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated — let the request through.
  // Role-based access control is enforced by RLS on the DB level
  // and checked per-page in server components.
  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - public asset files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
