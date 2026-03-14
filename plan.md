# GAMS — Government Asset Management System
## Complete Project Plan & Progress Tracker

> **Last Audited:** March 11, 2026  
> **Overall Completion: ~18–22% of total planned scope**

---

## What Is GAMS?

A full-stack, government-grade monorepo platform consisting of **4 separate Next.js portals**:

| Portal | Subdomain | Users | Port |
|--------|-----------|-------|------|
| Management | manage.gams.gov.in | Super Admin, Dept Admins, Volunteers, Inspectors, Warehouse Staff | 3001 |
| Public | public.gams.gov.in | Citizens — buy discounted surplus assets | 3002 |
| Company | company.gams.gov.in | Supplier companies | 3003 |
| Buyer/Institution | buyer.gams.gov.in | NGOs, Private Orgs, Govt Institutions | 3004 |

**Stack:** Next.js 15.5 · TypeScript · Tailwind CSS · Supabase · Turborepo · Shadcn/ui

---

## ⚠️ CAN THIS PROJECT RUN RIGHT NOW?

### Short Answer: **Technically it starts, but it cannot function as a real application.**

### Startup Issues (Infrastructure)
| Issue | Status |
|-------|--------|
| CSS `@import` placed after `@tailwind` directives in all 4 `globals.css` | ✅ Fixed this session |
| Servers take 90–120s to serve first HTTP response when all 4 run concurrently | 🔴 Resource contention on dev machine |
| `DEV_BYPASS_AUTH=true` in all `.env.local` — bypasses Supabase auth | ✅ Intentional (dev mode) |
| Supabase keys are placeholders (`REPLACE_WITH_ANON_KEY_FROM_SUPABASE_DASHBOARD`) | 🔴 No real DB connection |
| TypeScript: all 4 apps pass `tsc --noEmit` with **EXIT:0** | ✅ Clean |

### Why It Cannot Function as a Real App

1. **No Supabase project connected** — All Supabase keys are placeholders. Every DB call, auth check, file upload, and real-time subscription will silently fail or throw. Pages render their static/demo UI but no live data loads.

2. **Auth is bypassed in dev** — `DEV_BYPASS_AUTH=true` means the middleware skips real authentication. In production this must be removed and real Supabase auth tokens must be verified.

3. **All data is hardcoded demo data** — Every page that shows stats, lists, or records uses `const MOCK_DATA = [...]` arrays defined in the component files. Nothing reads from a real database.

4. **No Supabase migrations applied** — 3 migration files exist (`001_initial_schema.sql`, `002_storage_setup.sql`, `003_functions.sql`) but they have never been run against a real Supabase instance.

5. **No payment integration** — Razorpay is planned but not implemented.

6. **No OTP/Aadhaar/DigiLocker integrations** — All are stubbed/not started.

### Verdict
The portals **render UI in development mode** when started correctly one at a time. They are **not functional applications** — they are detailed UI scaffolds with hardcoded demo data. To become a working system, Supabase must be provisioned, keys added, migrations applied, and all the Phase 2–12 features built.

---

## Phase-by-Phase Progress

### Phase 1 — Monorepo Foundation ✅ ~70% Complete

| Task | Status | Notes |
|------|--------|-------|
| Turborepo monorepo setup | ✅ Done | `turbo.json`, root `package.json` |
| 4 Next.js app skeletons | ✅ Done | `apps/manage`, `apps/public-portal`, `apps/company`, `apps/buyer` |
| Shared packages: `ui`, `lib`, `types`, `i18n` | ✅ Done | All 4 packages scaffolded |
| Tailwind Saffron/Green/Gold token system | ✅ Done | `tailwind.config.js` at root |
| Shadcn/ui installed | ✅ Done | Components present |
| Bento grid base components | ✅ Done | `BentoGrid.tsx`, `StatCard.tsx`, `Badge.tsx` in `packages/ui` |
| Government Header component | ✅ Done | `GovHeader.tsx` with Ashoka Chakra |
| Supabase project creation | ❌ Not done | Keys are placeholders |
| Database schema migrations | ⚠️ Partial | 3 SQL files written but never applied |
| Environment config per portal | ✅ Done | `.env.local` in each app |
| Auth middleware (role-based routing) | ⚠️ Partial | Middleware exists, but bypassed via `DEV_BYPASS_AUTH=true` |
| Hindi + English i18n scaffolded | ✅ Done | `packages/i18n/locales/` |

---

### Phase 2 — Registration & Identity Flows ❌ ~5% Complete

| Task | Status |
|------|--------|
| Public registration form (14-field) | ❌ Not built |
| Institution registration form (50-field, 6-section) | ❌ Not built |
| Company registration form (institution + 8 more) | ❌ Not built |
| Internal user creation panel | ❌ Not built |
| Govt admin verification dashboard | ❌ Not built (UI scaffold only) |
| DigiLocker API integration | ❌ Not built |
| Phone OTP (Supabase SMS OTP) | ❌ Not built |
| Credibility score computation | ❌ Not built |

---

### Phase 3 — Company Portal & Product Registry ❌ ~5% Complete

| Task | Status |
|------|--------|
| Company dashboard | ⚠️ UI scaffold with hardcoded data |
| Product listing form | ❌ Not built |
| Price threshold logic | ❌ Not built |
| CSV bulk upload | ❌ Not built |
| Unique ID engine (`GOV-SCOPE-CO_CODE-...`) | ❌ Not built |
| QR generation (HMAC-SHA256 JWT) | ❌ Not built |
| Print-ready QR PDF export | ❌ Not built |
| Batch job progress tracker | ❌ Not built |
| Govt admin product approval queue | ❌ Not built |

---

### Phase 4 — Warehousing & Delivery Confirmation ❌ ~5% Complete

| Task | Status |
|------|--------|
| Warehouse Staff scan interface (camera QR) | ⚠️ Demo scanner UI only |
| Zone + Shelf assignment | ❌ Not built |
| Warehouse dashboard | ⚠️ UI scaffold with hardcoded data |
| Delivery confirmation by company | ❌ Not built |
| Govt admin delivery verification | ❌ Not built |
| Stock status lifecycle | ❌ Not built |

---

### Phase 5 — Event Management ❌ ~5% Complete

| Task | Status |
|------|--------|
| Event creation form | ❌ Not built |
| Sub-area management within event | ❌ Not built |
| Asset assignment to event | ❌ Not built |
| Volunteer/Inspector assignment | ❌ Not built |
| Event dashboard (bento grid) | ⚠️ UI scaffold with hardcoded data |
| Event status lifecycle | ❌ Not built |

---

### Phase 6 — QR Scanning & Role-Based Actions ❌ ~10% Complete

| Task | Status |
|------|--------|
| Unified scan page at `/scan` | ⚠️ Demo UI only — no real QR validation |
| QR payload HMAC validation (server-side) | ❌ Not built |
| Role-based action panel renderer | ❌ Not built (same UI for all roles) |
| Volunteer flow (scan → condition → defect) | ❌ Not built |
| Warehouse flow (scan → receive/dispatch) | ❌ Not built |
| Company flow (scan → confirm delivery) | ❌ Not built |
| Inspector flow (scan → rating → notes → photo) | ❌ Not built |
| Govt Admin flow (full history → override) | ❌ Not built |
| Audit log write on every scan | ❌ Not built |
| GPS capture on scan | ❌ Not built |

---

### Phase 7 — Post-Event Processing ❌ 0% Complete

All tasks not started.

---

### Phase 8 — Redistribution & Marketplace ❌ 0% Complete

All tasks not started.

---

### Phase 9 — Public Portal Homepage & Citizen UX ❌ ~10% Complete

| Task | Status |
|------|--------|
| Homepage hero + layout | ⚠️ Basic scaffold exists |
| Live stats ticker from DB | ❌ Not built |
| "How It Works" visual | ❌ Not built |
| Featured products grid | ❌ Not built |
| Category browser | ❌ Not built |
| Transparency section / open data | ❌ Not built |
| FAQ, About, Grievance | ❌ Not built |

---

### Phase 10 — Management Portal Analytics ❌ ~5% Complete

| Task | Status |
|------|--------|
| Homepage bento grid (pending approvals, active events…) | ⚠️ Hardcoded numbers |
| Super Admin analytics | ❌ Not built |
| Dept Admin analytics | ❌ Not built |
| Company analytics | ❌ Not built |
| CSV/PDF export reports | ❌ Not built |
| Audit log explorer | ❌ Not built |

---

### Phase 11 — Buyer/Institution Portal ❌ ~5% Complete

| Task | Status |
|------|--------|
| Institution homepage | ⚠️ Basic scaffold |
| Browse available stock | ❌ Not built |
| Requirement request form | ❌ Not built |
| My Allocations dashboard | ⚠️ UI scaffold with hardcoded data |
| Documents section | ❌ Not built |
| Institution analytics | ❌ Not built |

---

### Phase 12 — Hardening, Compliance & Scale ❌ 0% Complete

All tasks not started. This phase cannot begin until Phases 1–11 are done.

---

## What IS Built (Honest Inventory)

### ✅ Real Infrastructure
- **Turborepo monorepo** — workspace, build pipeline, shared configs
- **4 Next.js 15 apps** — correct folder structure, routing, layouts
- **Shared packages** — `@gams/ui`, `@gams/lib`, `@gams/types`, `@gams/i18n`
- **Tailwind design tokens** — Saffron, Government Green, Gold palette
- **Auth middleware** — structure correct, `DEV_BYPASS_AUTH` flag for dev
- **3 Supabase SQL migrations** — schema written (tables, RLS, storage, functions)
- **TypeScript** — all 4 apps clean (no compile errors)

### ⚠️ UI Scaffolds With Hardcoded Data (Not Functional)

| Portal | Pages that render |
|--------|------------------|
| manage | Dashboard, Assets, Warehouse, Scan, Events, Approvals, Analytics, Audit, Companies, Institutions, Users, Defects, Reports, Notifications, Settings, Redistribution, Rating |
| public-portal | Homepage, Marketplace, Scan, About, Auth pages |
| company | Dashboard, Auth pages |
| buyer | Dashboard, Auth pages |

All above pages load their UI but pull **zero live data** — everything shown is `const MOCK = [...]` arrays hardcoded in the component.

### ❌ Features That Are 0% Built
- User registration flows (any portal)
- Real QR code generation or scanning
- Aadhaar OTP, DigiLocker, SMS OTP
- Payment (Razorpay)
- File upload to Supabase Storage
- Email notifications
- Real audit logging
- Asset lifecycle state machine
- CSV bulk import
- PDF/QR label generation
- Role-based scan actions
- Marketplace (cart, checkout, orders)
- Institution allocation workflow
- Inspector rating workflow
- Any analytics backed by real DB queries

---

## Realistic Roadmap to Working MVP

To get to a **working MVP** (Phase 1 fully complete + Phase 2 registration working):

### Step 1 — Connect Supabase (1–2 days)
1. Create a Supabase project at supabase.com
2. Run the 3 migration files in the SQL editor
3. Copy real API keys into all `.env.local` files
4. Remove `DEV_BYPASS_AUTH=true` and test real auth flow

### Step 2 — Fix Server Stability (1 day)
- Start each dev server individually (not all 4 at once) or increase RAM/CPU
- Currently: starting all 4 simultaneously causes compilation timeout

### Step 3 — Phase 2 Registration (2–3 weeks)
- Public registration form (14 fields, Aadhaar OTP stub)
- Company + Institution registration (50+ fields)
- Admin verification dashboard (approve/reject)
- Internal user creation

### Step 4 — Phase 3 Core (2–3 weeks)
- Product listing form (real DB writes)
- Unique ID generation engine
- QR code generation (HMAC-JWT)
- CSV bulk upload

### Phases 4–12 represent 4–8 months of full-time development for a 2–3 person team.

---

## File Structure Summary

```
Government Asset Management/
├── apps/
│   ├── manage/          (port 3001) — ~20 page routes, all UI-only
│   ├── public-portal/   (port 3002) — ~5 page routes, all UI-only
│   ├── company/         (port 3003) — ~3 page routes, all UI-only
│   └── buyer/           (port 3004) — ~3 page routes, all UI-only
├── packages/
│   ├── ui/              — GovHeader, BentoGrid, StatCard, Badge
│   ├── lib/             — Supabase client/server helpers, types
│   ├── types/           — Shared TypeScript types
│   └── i18n/            — Hindi + English locale strings
├── supabase/
│   └── migrations/      — 3 SQL files (schema, storage, functions) — NOT YET APPLIED
├── turbo.json
├── package.json
├── tailwind.config.js
└── Plan.txt             — Original product specification
```

---

## Bug Log (This Session)

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| HTTP 500 on all pages | `@import url(...)` placed AFTER `@tailwind` directives in all 4 `globals.css` | Moved `@import` before `@tailwind base` |
| Servers time out HTTP when 4 run together | CPU/RAM resource contention during Turbopack compilation | Start servers one at a time in separate terminals |
| `Start-Job` without `Set-Location` → broken server | `npx next dev` ran from PowerShell home dir, not app dir | Always `Set-Location app_dir` before `npx next dev` |

---

## Summary Table

| Phase | Description | Status | Completion |
|-------|-------------|--------|------------|
| 1 | Monorepo Foundation | 🟡 Partial | ~70% |
| 2 | Registration & Identity | 🔴 Barely started | ~5% |
| 3 | Company Portal & Product Registry | 🔴 Barely started | ~5% |
| 4 | Warehousing & Delivery | 🔴 Barely started | ~5% |
| 5 | Event Management | 🔴 Barely started | ~5% |
| 6 | QR Scanning & Role Actions | 🔴 Demo UI only | ~10% |
| 7 | Post-Event Processing | ⬛ Not started | 0% |
| 8 | Redistribution & Marketplace | ⬛ Not started | 0% |
| 9 | Public Portal Homepage | 🔴 Barely started | ~10% |
| 10 | Management Analytics | 🔴 Hardcoded only | ~5% |
| 11 | Buyer/Institution Portal | 🔴 Barely started | ~5% |
| 12 | Hardening & Compliance | ⬛ Not started | 0% |

**Overall: ~18–22% of full planned scope is complete (infrastructure + UI scaffolds only)**
