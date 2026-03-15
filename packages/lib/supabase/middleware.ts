import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

/**
 * Creates a Supabase client for use inside Next.js middleware.
 * Handles cookie refresh so sessions stay alive between hot requests.
 * Returns both the client and the response to forward.
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First update the request cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Then rebuild the response so new cookies are forwarded
          response = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response };
}

/**
 * Refreshes the session (must be called in every middleware invocation).
 * Returns the authenticated user or null.
 *
 * When DEV_BYPASS_AUTH=true is set in .env.local the middleware returns a
 * synthetic user so every dashboard route is accessible without real
 * Supabase credentials — useful for UI development and demos.
 */
export async function getSessionUser(request: NextRequest) {
  // ── Development bypass ──────────────────────────────────────────────────
  if (process.env.DEV_BYPASS_AUTH === "true") {
    const response = NextResponse.next();
    const devUser = {
      id: "dev-bypass-user",
      email: "dev@gams.gov.in",
      app_metadata: {},
      user_metadata: { name: "Dev User" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as import("@supabase/supabase-js").User;
    return { user: devUser, response, supabase: null as never };
  }
  // ────────────────────────────────────────────────────────────────────────
  const { supabase, response } = createMiddlewareClient(request);
  // getUser() triggers a token refresh if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, response, supabase };
}

/** Paths that are always public (no auth check needed). */
export const ALWAYS_PUBLIC = [
  "/auth/callback",
  "/auth/confirm",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export function isAlwaysPublic(pathname: string): boolean {
  return ALWAYS_PUBLIC.some((p) => pathname.startsWith(p));
}
