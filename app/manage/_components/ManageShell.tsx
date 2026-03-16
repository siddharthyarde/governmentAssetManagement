"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Calendar, Building2, QrCode, Star,
  FileText, Users, AlertTriangle, Scan, Bell, Settings, ClipboardList,
  Warehouse, BarChart3, Menu, X, LogOut, ChevronDown, CheckCircle2,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Role-aware nav config ────────────────────────────────────────────────────

type NavItem = { icon: React.ElementType; label: string; href: string; badge?: number };
type NavSection = { label: string; items: NavItem[] };

const FULL_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",      href: "/manage" },
      { icon: Bell,             label: "Notifications",  href: "/manage/notifications", badge: 4 },
    ],
  },
  {
    label: "Asset Management",
    items: [
      { icon: Package,   label: "Asset Registry", href: "/manage/assets" },
      { icon: Warehouse, label: "Warehouse",       href: "/manage/warehouse" },
      { icon: QrCode,    label: "Scan QR",         href: "/manage/scan" },
    ],
  },
  {
    label: "Events",
    items: [
      { icon: Calendar,      label: "Events",       href: "/manage/events" },
      { icon: ClipboardList, label: "Event Assets", href: "/manage/event-assets" },
    ],
  },
  {
    label: "People",
    items: [
      { icon: Building2,   label: "Companies",    href: "/manage/companies",    badge: 3 },
      { icon: Users,       label: "Users & Roles",href: "/manage/users" },
      { icon: LayoutDashboard, label: "Institutions", href: "/manage/institutions", badge: 7 },
      { icon: CheckCircle2, label: "Approvals",   href: "/manage/approvals",    badge: 3 },
    ],
  },
  {
    label: "Post-Event",
    items: [
      { icon: Star,          label: "Rate Assets",    href: "/manage/rating" },
      { icon: AlertTriangle, label: "Defects",        href: "/manage/defects" },
      { icon: Package,       label: "Redistribution", href: "/manage/redistribution" },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: FileText, label: "Reports",   href: "/manage/reports" },
      { icon: BarChart3,label: "Analytics", href: "/manage/analytics" },
      { icon: Bell,     label: "Audit Log", href: "/manage/audit" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings", href: "/manage/settings" },
    ],
  },
];

const INSPECTOR_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Inspector Home", href: "/manage/inspector" },
      { icon: Bell,             label: "Notifications",  href: "/manage/notifications" },
    ],
  },
  {
    label: "Inspection Tasks",
    items: [
      { icon: Star,    label: "Rate Assets",     href: "/manage/rating" },
      { icon: AlertTriangle, label: "Report Defects", href: "/manage/defects" },
      { icon: QrCode,  label: "Scan QR",         href: "/manage/scan" },
    ],
  },
  {
    label: "Reference",
    items: [
      { icon: Package,   label: "Asset Registry",  href: "/manage/assets" },
      { icon: Calendar,  label: "Events",           href: "/manage/events" },
      { icon: FileText,  label: "Reports",          href: "/manage/reports" },
    ],
  },
];

const VOLUNTEER_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Volunteer Home", href: "/manage/volunteer" },
      { icon: Bell,             label: "Notifications",  href: "/manage/notifications" },
    ],
  },
  {
    label: "On-Ground",
    items: [
      { icon: QrCode,  label: "Scan QR",         href: "/manage/scan" },
      { icon: AlertTriangle, label: "Report Defect", href: "/manage/defects" },
    ],
  },
  {
    label: "Reference",
    items: [
      { icon: Calendar,  label: "My Events",     href: "/manage/events" },
      { icon: Package,   label: "Asset Lookup",  href: "/manage/assets" },
    ],
  },
];

const VIEWER_NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",     href: "/manage/viewer" },
      { icon: Bell,             label: "Notifications", href: "/manage/notifications" },
    ],
  },
  {
    label: "View",
    items: [
      { icon: Package,       label: "Assets",        href: "/manage/assets" },
      { icon: Calendar,      label: "Events",        href: "/manage/events" },
      { icon: Building2,     label: "Companies",     href: "/manage/companies" },
      { icon: ClipboardList, label: "Institutions",  href: "/manage/institutions" },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: FileText,  label: "Reports",   href: "/manage/reports" },
      { icon: BarChart3, label: "Analytics", href: "/manage/analytics" },
      { icon: Bell,      label: "Audit Log", href: "/manage/audit" },
    ],
  },
];

export type ManageRole = "admin" | "inspector" | "volunteer" | "viewer";

function navForRole(role: ManageRole): NavSection[] {
  if (role === "inspector") return INSPECTOR_NAV;
  if (role === "volunteer") return VOLUNTEER_NAV;
  if (role === "viewer")    return VIEWER_NAV;
  return FULL_NAV;
}

const ROLE_LABELS: Record<ManageRole, string> = {
  admin:     "Admin",
  inspector: "Inspector",
  volunteer: "Volunteer",
  viewer:    "Viewer",
};

const ROLE_COLORS: Record<ManageRole, string> = {
  admin:     "bg-red-100 text-red-700",
  inspector: "bg-gold-100 text-gold-700",
  volunteer: "bg-green-100 text-green-700",
  viewer:    "bg-gray-100 text-gray-600",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  open, onClose, role, userName, initials,
}: {
  open: boolean; onClose: () => void; role: ManageRole; userName: string; initials: string;
}) {
  const pathname = usePathname();
  const nav = navForRole(role);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-40
        flex flex-col transition-transform duration-300 overflow-hidden
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-auto md:flex md:shrink-0
      `}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
            <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
          </div>
          <button className="md:hidden p-1 rounded-lg hover:bg-surface" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm flex items-center justify-center border border-saffron-200 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{userName}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[role]}`}>
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {nav.map((section) => (
            <div key={section.label} className="mb-1">
              <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-widest px-3 py-2">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/manage" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <span className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer mb-0.5 ${
                      active ? "bg-saffron-50 text-saffron-700 font-semibold" : "text-[#5A5A5A] hover:bg-surface hover:text-[#1A1A1A]"
                    }`}>
                      <span className="flex items-center gap-3">
                        <item.icon size={16} className={active ? "text-saffron-600" : "text-[#9A9A9A]"} />
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <span className="bg-saffron-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-border shrink-0">
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50 transition-colors">
              <LogOut size={16} /> Sign Out
            </button>
          </form>
          <p className="text-[10px] text-[#B0B0A8] px-3 pt-2">GAMS v1.0 · Ministry of Finance</p>
        </div>
      </aside>
    </>
  );
}

// ─── ManageShell component ────────────────────────────────────────────────────

export function ManageShell({
  children,
  role = "admin",
  title,
  subtitle,
  userName = "Staff User",
  initials = "SU",
  actions,
}: {
  children: React.ReactNode;
  role?: ManageRole;
  title: string;
  subtitle?: string;
  userName?: string;
  initials?: string;
  actions?: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);

  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        userName={userName}
        initials={initials}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="md:hidden p-2 rounded-xl hover:bg-surface border border-border shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-[#1A1A1A] truncate">{title}</h1>
                {subtitle && <p className="text-xs text-[#7A7A7A] truncate">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {actions}

              {/* Notifications */}
              <div className="relative">
                {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2.5 rounded-xl border border-border hover:bg-surface"
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-[#5A5A5A]" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-saffron-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">4</span>
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-sm font-black text-[#1A1A1A]">Notifications</span>
                      <button className="text-xs font-bold text-saffron-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="divide-y divide-border max-h-72 overflow-y-auto">
                      {[
                        { icon: "🏢", title: "New Company Registration", sub: "ABC Exports awaiting approval", time: "10 min ago", read: false },
                        { icon: "📍", title: "QR Code Scanned", sub: "Asset #QR-5521 at Warehouse B", time: "32 min ago", read: false },
                        { icon: "🏛️", title: "Institution Pending", sub: "7 institutions awaiting verification", time: "1 hr ago", read: false },
                        { icon: "📅", title: "Event Scheduled", sub: "National Surplus Fair — 15 Mar 2026", time: "Yesterday", read: true },
                      ].map((n, i) => (
                        <div key={i} className={`flex items-start gap-3 px-4 py-3 ${n.read ? "opacity-60" : ""}`}>
                          <span className="text-base shrink-0 mt-0.5">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1A1A1A]">{n.title}</p>
                            <p className="text-xs text-[#7A7A7A] truncate">{n.sub}</p>
                            <p className="text-[10px] text-[#9A9A9A] mt-0.5">{n.time}</p>
                          </div>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-saffron-500 shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border text-center">
                      <Link href="/manage/notifications" className="text-xs font-bold text-saffron-600 hover:underline">View all notifications</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar */}
              <div className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center border ${ROLE_COLORS[role]} border-current/20`}>
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        <footer className="px-6 py-3 border-t border-border bg-white text-xs text-[#9A9A9A] flex flex-wrap gap-4 justify-between">
          <span>© 2026 Ministry of Finance, Government of India · GAMS v1.0</span>
          <span>Hosted by NIC · GIGW Compliant · WCAG 2.1 AA</span>
        </footer>
      </div>
    </div>
  );
}
