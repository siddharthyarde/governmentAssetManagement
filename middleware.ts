/**
 * GAMS — Unified Portal Middleware
 *
 * Single Next.js app serving all four portals on one port:
 *   /manage   → Management portal  (govt staff only)
 *   /company  → Supplier portal    (supplier companies)
 *   /buyer    → Institutional       (NGOs, institutions)
 *   /public   → Citizen marketplace (public)
 *
 * Each portal section has its own auth rules enforced here.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser, isAlwaysPublic } from "@gams/lib/supabase/middleware";

function passThrough(request: NextRequest) {
  return NextResponse.next({ request });
}

// ─── Manage: everything protected except /manage/login ────────────────────────

const MANAGE_PUBLIC = ["/manage/login", "/manage/auth/callback", "/manage/auth/confirm"];

function isManagePublic(pathname: string): boolean {
  return MANAGE_PUBLIC.some((p) => pathname.startsWith(p));
}

// ─── Company: / and /company/login and /company/register are public ──────────

const COMPANY_PUBLIC_EXACT = ["/company"];
const COMPANY_PUBLIC_PREFIX = ["/company/login", "/company/register", "/company/auth"];

function isCompanyPublic(pathname: string): boolean {
  if (COMPANY_PUBLIC_EXACT.some((p) => pathname === p)) return true;
  return COMPANY_PUBLIC_PREFIX.some((p) => pathname.startsWith(p));
}

// ─── Buyer: homepage and auth routes public ───────────────────────────────────

const BUYER_PUBLIC_EXACT = ["/buyer"];
const BUYER_PUBLIC_PREFIX = ["/buyer/login", "/buyer/register", "/buyer/auth"];

function isBuyerPublic(pathname: string): boolean {
  if (BUYER_PUBLIC_EXACT.some((p) => pathname === p)) return true;
  return BUYER_PUBLIC_PREFIX.some((p) => pathname.startsWith(p));
}

// ─── Public portal: most routes open, only account/checkout/orders protected ──

const PUBLIC_PROTECTED = ["/public/account", "/public/checkout", "/public/orders", "/public/wishlist"];

function isPublicPortalProtected(pathname: string): boolean {
  return PUBLIC_PROTECTED.some((p) => pathname.startsWith(p));
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip always-public assets
  if (isAlwaysPublic(pathname)) {
    return passThrough(request);
  }

  // ── Root redirect ──
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/public", request.url));
  }

  // ── MANAGE portal ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/manage")) {
    if (isManagePublic(pathname)) {
      return passThrough(request);
    }
    const { user, response } = await getSessionUser(request);
    if (!user) {
      const loginUrl = new URL("/manage/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── COMPANY portal ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/company")) {
    if (isCompanyPublic(pathname)) {
      return passThrough(request);
    }
    const { user, response } = await getSessionUser(request);
    if (!user) {
      const loginUrl = new URL("/company/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── BUYER portal ───────────────────────────────────────────────────────────
  if (pathname.startsWith("/buyer")) {
    if (isBuyerPublic(pathname)) {
      return passThrough(request);
    }
    const { user, response } = await getSessionUser(request);
    if (!user) {
      const loginUrl = new URL("/buyer/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ── PUBLIC portal ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/public")) {
    if (isPublicPortalProtected(pathname)) {
      const { user, response } = await getSessionUser(request);
      if (!user) {
        const loginUrl = new URL("/public/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }
    return passThrough(request);
  }

  // ── Unknown routes — just pass through ────────────────────────────────────
  return passThrough(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
