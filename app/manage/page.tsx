"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Building2,
  QrCode,
  Star,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Scan,
  ChevronRight,
  Menu,
  X,
  Bell,
  Settings,
  ClipboardList,
  Warehouse,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavSection {
  label: string;
  items: {
    icon: React.ReactNode;
    label: string;
    href: string;
    badge?: string | number;
  }[];
}

// ─── Sidebar Nav Data ─────────────────────────────────────────────────────────

const NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/manage" },
      { icon: <Bell size={18} />, label: "Notifications", href: "/manage/notifications", badge: 4 },
    ],
  },
  {
    label: "Asset Management",
    items: [
      { icon: <Package size={18} />, label: "Asset Registry", href: "/manage/assets" },
      { icon: <Warehouse size={18} />, label: "Warehouse", href: "/manage/warehouse" },
      { icon: <QrCode size={18} />, label: "Scan QR", href: "/manage/scan" },
    ],
  },
  {
    label: "Events",
    items: [
      { icon: <Calendar size={18} />, label: "Events", href: "/manage/events" },
      { icon: <ClipboardList size={18} />, label: "Event Assets", href: "/manage/event-assets" },
    ],
  },
  {
    label: "People",
    items: [
      { icon: <Building2 size={18} />, label: "Companies", href: "/manage/companies", badge: 3 },
      { icon: <Users size={18} />, label: "Users & Roles", href: "/manage/users" },
      { icon: <CheckCircle2 size={18} />, label: "Institutions", href: "/manage/institutions", badge: 7 },
    ],
  },
  {
    label: "Post-Event",
    items: [
      { icon: <Star size={18} />, label: "Rate Assets", href: "/manage/rating" },
      { icon: <AlertTriangle size={18} />, label: "Defects", href: "/manage/defects" },
      { icon: <Package size={18} />, label: "Redistribution", href: "/manage/redistribution" },
    ],
  },
  {
    label: "Reports",
    items: [
      { icon: <FileText size={18} />, label: "Reports", href: "/manage/reports" },
      { icon: <Clock size={18} />, label: "Audit Log", href: "/manage/audit" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: <Settings size={18} />, label: "Settings", href: "/manage/settings" },
    ],
  },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-40
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-auto md:flex md:shrink-0
        `}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">
              भारत सरकार · GOI
            </p>
            <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
          </div>
          <button className="md:hidden p-1 rounded-lg hover:bg-surface" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          {NAV.map((section) => (
            <div key={section.label} className="mb-1">
              <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-widest px-3 py-2">
                {section.label}
              </p>
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="nav-item group flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className="text-[#7A7A7A] group-hover:text-saffron-600 transition-colors">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="bg-saffron-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-[#9A9A9A] font-medium">
            GAMS v1.0 · Ministry of Finance
          </p>
          <p className="text-[10px] text-[#B0B0A8]">Powered by NIC</p>
        </div>
      </aside>
    </>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function QuickStat({
  label,
  value,
  sub,
  icon,
  variant,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  variant: "saffron" | "green" | "gold" | "danger" | "default";
}) {
  const border = {
    saffron: "border-l-4 border-l-saffron-500",
    green:   "border-l-4 border-l-green-500",
    gold:    "border-l-4 border-l-gold-500",
    danger:  "border-l-4 border-l-danger",
    default: "border-l-4 border-l-border",
  }[variant];

  const iconBg = {
    saffron: "bg-saffron-100 text-saffron-600",
    green:   "bg-green-100 text-green-700",
    gold:    "bg-gold-100 text-gold-700",
    danger:  "bg-red-100 text-danger",
    default: "bg-surface text-[#5A5A5A]",
  }[variant];

  return (
    <div className={`bento-card ${border} flex items-center gap-4`}>
      <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#1A1A1A] leading-tight">{value}</p>
        {sub && <p className="text-xs text-[#7A7A7A] mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Recent Activity Row ──────────────────────────────────────────────────────

function ActivityRow({
  time,
  action,
  user,
  entity,
  type,
}: {
  time: string;
  action: string;
  user: string;
  entity: string;
  type: "scan" | "approve" | "defect" | "rating" | "event";
}) {
  const typeColor = {
    scan:    "bg-saffron-100 text-saffron-700",
    approve: "bg-green-100 text-green-700",
    defect:  "bg-red-100 text-red-700",
    rating:  "bg-gold-100 text-gold-700",
    event:   "bg-[#E8F0FE] text-[#3C4043]",
  }[type];

  const typeLabel = {
    scan:    "Scan",
    approve: "Approved",
    defect:  "Defect",
    rating:  "Rated",
    event:   "Event",
  }[type];

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <span className={`badge ${typeColor} shrink-0`}>{typeLabel}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#1A1A1A] font-medium truncate">
          {action} — <span className="text-[#5A5A5A] font-normal">{entity}</span>
        </p>
        <p className="text-xs text-[#7A7A7A]">by {user}</p>
      </div>
      <p className="text-xs text-[#9A9A9A] shrink-0">{time}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeEvents: 0,
    assetsCount: 0,
    openDefects: 0,
    awaitingRating: 0,
    todayScans: 0,
    loaded: false,
  });

  useEffect(() => {
    const db = createClient();
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      db.from("companies").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
      db.from("institutions").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
      db.from("products").select("*", { count: "exact", head: true }).eq("status", "pending_approval"),
      db.from("events").select("*", { count: "exact", head: true }).eq("status", "ongoing"),
      db.from("product_instances").select("*", { count: "exact", head: true }),
      db.from("defects").select("*", { count: "exact", head: true }).eq("is_resolved", false),
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "pending_rating"),
      db.from("scans").select("*", { count: "exact", head: true }).gte("scanned_at", `${today}T00:00:00Z`),
    ]).then(([cos, ins, pros, evts, assets, defects, rating, scans]) => {
      setStats({
        pendingApprovals: (cos.count ?? 0) + (ins.count ?? 0) + (pros.count ?? 0),
        activeEvents: evts.count ?? 0,
        assetsCount: assets.count ?? 0,
        openDefects: defects.count ?? 0,
        awaitingRating: rating.count ?? 0,
        todayScans: scans.count ?? 0,
        loaded: true,
      });
    });
  }, []);
  const [notifItems, setNotifItems] = useState([
    { id: 1, read: false, icon: "🏢", title: "New Company Registration",  sub: "ABC Exports Pvt Ltd awaiting approval",           time: "10 min ago" },
    { id: 2, read: false, icon: "📍", title: "QR Code Scanned",          sub: "Asset #QR-5521 scanned at Warehouse B",           time: "32 min ago" },
    { id: 3, read: false, icon: "🏛️", title: "Institution Pending",      sub: "7 institutions awaiting verification",            time: "1 hr ago"   },
    { id: 4, read: true,  icon: "📅", title: "Event Scheduled",          sub: "National Surplus Asset Fair — 15 Mar 2026",       time: "Yesterday"  },
  ]);
  const unreadCount = notifItems.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border">
          <div className="tiranga-accent" />
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-xl hover:bg-surface border border-border"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-base font-bold text-[#1A1A1A]">Management Dashboard</h1>
                <p className="text-xs text-[#7A7A7A]">प्रबंधन डैशबोर्ड · March 10, 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/manage/scan" className="btn-primary gap-2 text-sm">
                <Scan size={16} />
                <span className="hidden sm:inline">Scan QR</span>
              </Link>
              <div className="relative">
                {notifOpen && <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />}
                <button
                  className="relative p-2.5 rounded-xl border border-border hover:bg-surface"
                  onClick={() => setNotifOpen(!notifOpen)}
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-[#5A5A5A]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-saffron-500 rounded-full text-[9px] font-black text-white flex items-center justify-center px-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <span className="text-sm font-black text-gray-900">Notifications</span>
                      <button
                        className="text-xs font-bold text-saffron-600 hover:underline"
                        onClick={() => setNotifItems((n) => n.map((item) => ({ ...item, read: true })))}
                      >Mark all read</button>
                    </div>
                    <div className="divide-y divide-border max-h-72 overflow-y-auto">
                      {notifItems.map((notif) => (
                        <button
                          key={notif.id}
                          className={`w-full text-left px-4 py-3 hover:bg-surface transition-colors flex items-start gap-3 ${notif.read ? "opacity-60" : ""}`}
                          onClick={() => setNotifItems((n) => n.map((item) => item.id === notif.id ? { ...item, read: true } : item))}
                        >
                          <span className="text-base shrink-0 mt-0.5">{notif.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 truncate">{notif.sub}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                          </div>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-saffron-500 shrink-0 mt-1" />}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border">
                      <button className="text-xs font-bold text-saffron-600 hover:underline w-full text-center">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm flex items-center justify-center border border-saffron-200">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 md:p-6 space-y-6">

          {/* ── Quick Stats ── */}
          <section>
            <h2 className="page-title mb-4">System Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <QuickStat
                label="Pending Approvals"
                value={stats.loaded ? stats.pendingApprovals.toLocaleString("en-IN") : "—"}
                sub="Companies, institutions & products"
                icon={<Clock size={20} />}
                variant="saffron"
              />
              <QuickStat
                label="Active Events"
                value={stats.loaded ? stats.activeEvents.toLocaleString("en-IN") : "—"}
                sub="Currently ongoing"
                icon={<Calendar size={20} />}
                variant="green"
              />
              <QuickStat
                label="Assets In Stock"
                value={stats.loaded ? stats.assetsCount.toLocaleString("en-IN") : "—"}
                sub="Total product instances"
                icon={<Package size={20} />}
                variant="default"
              />
              <QuickStat
                label="Open Defects"
                value={stats.loaded ? stats.openDefects.toLocaleString("en-IN") : "—"}
                sub="Pending resolution"
                icon={<AlertTriangle size={20} />}
                variant="danger"
              />
              <QuickStat
                label="Awaiting Rating"
                value={stats.loaded ? stats.awaitingRating.toLocaleString("en-IN") : "—"}
                sub="Post-event inspections"
                icon={<Star size={20} />}
                variant="gold"
              />
              <QuickStat
                label="Today's Scans"
                value={stats.loaded ? stats.todayScans.toLocaleString("en-IN") : "—"}
                sub="QR scans logged today"
                icon={<Scan size={20} />}
                variant="green"
              />
            </div>
          </section>

          {/* ── Bento Row 1 ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Recent Activity */}
            <div className="bento-card md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Recent Activity</h3>
                <Link href="/manage/audit" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              <div>
                <ActivityRow
                  time="2 min ago"
                  action="QR Scanned — Activated"
                  user="Vol. Ramesh Kumar"
                  entity="GOI-DLH001-R-ELEC-2024-00003842"
                  type="scan"
                />
                <ActivityRow
                  time="14 min ago"
                  action="Company Approved"
                  user="Admin Priya Singh"
                  entity="TechnoCraft Solutions Pvt Ltd"
                  type="approve"
                />
                <ActivityRow
                  time="1 hr ago"
                  action="Defect Reported"
                  user="Vol. Anjali Sharma"
                  entity="GOI-MHT002-R-FURN-2023-00000181 · ₹2,400"
                  type="defect"
                />
                <ActivityRow
                  time="2 hr ago"
                  action="Asset Rated — 8/10"
                  user="Insp. Mukesh Verma"
                  entity="GOI-KAR003-R-APPL-2024-00001020"
                  type="rating"
                />
                <ActivityRow
                  time="3 hr ago"
                  action="Event Created"
                  user="Admin Suresh Nair"
                  entity="State Cultural Fest 2026, Kochi"
                  type="event"
                />
                <ActivityRow
                  time="4 hr ago"
                  action="Institution Approved"
                  user="Admin Priya Singh"
                  entity="Asha Foundation NGO, Mumbai"
                  type="approve"
                />
              </div>
            </div>

            {/* Pending Queue */}
            <div className="bento-card flex flex-col gap-3">
              <h3 className="font-semibold text-[#1A1A1A]">Pending Actions</h3>

              <Link href="/manage/companies?status=pending" className="flex items-center justify-between p-3 rounded-xl bg-saffron-50 hover:bg-saffron-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-saffron-600" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Company Approvals</p>
                    <p className="text-xs text-[#7A7A7A]">3 pending review</p>
                  </div>
                </div>
                <span className="bg-saffron-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </Link>

              <Link href="/manage/institutions?status=pending" className="flex items-center justify-between p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Institution Verifications</p>
                    <p className="text-xs text-[#7A7A7A]">7 awaiting documents</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">7</span>
              </Link>

              <Link href="/manage/assets?status=pending_approval" className="flex items-center justify-between p-3 rounded-xl bg-gold-50 hover:bg-gold-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-gold-600" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Product Approvals</p>
                    <p className="text-xs text-[#7A7A7A]">2 listings to verify</p>
                  </div>
                </div>
                <span className="bg-gold-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
              </Link>

              <Link href="/manage/defects?status=open" className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-danger" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Open Defects</p>
                    <p className="text-xs text-[#7A7A7A]">₹4.2L repair cost total</p>
                  </div>
                </div>
                <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">38</span>
              </Link>
            </div>
          </div>

          {/* ── Bento Row 2 ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Active Events */}
            <div className="bento-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Active Events</h3>
                <Link href="/manage/events" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                  All events <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "National Youth Festival 2026", location: "New Delhi", assets: "12,840", level: "Central" },
                  { name: "Kochi State Cultural Fest", location: "Kerala", assets: "3,210", level: "State" },
                  { name: "Pune District Sports Meet", location: "Maharashtra", assets: "870", level: "Municipal" },
                  { name: "G20 Preparatory Meet", location: "Mumbai", assets: "5,480", level: "Central" },
                ].map((event) => (
                  <div key={event.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A] leading-tight">{event.name}</p>
                      <p className="text-xs text-[#7A7A7A]">{event.location} · {event.assets} assets</p>
                    </div>
                    <span className={`badge text-[10px] ${
                      event.level === "Central" ? "badge-saffron" :
                      event.level === "State"   ? "badge-active" : "badge-pending"
                    }`}>
                      {event.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Status Distribution */}
            <div className="bento-card">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Asset Status Distribution</h3>
              <div className="space-y-3">
                {[
                  { label: "In Warehouse",      value: 284391, total: 412840, color: "bg-[#E2E2DC]" },
                  { label: "At Active Events",   value: 22340,  total: 412840, color: "bg-saffron-500" },
                  { label: "Redistributed",      value: 98210,  total: 412840, color: "bg-green-500" },
                  { label: "Post-Event (Rating Pending)", value: 5204, total: 412840, color: "bg-gold-500" },
                  { label: "Condemned/Lost",     value: 2695,   total: 412840, color: "bg-danger" },
                ].map((item) => {
                  const pct = Math.round((item.value / item.total) * 100);
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5A5A5A] font-medium">{item.label}</span>
                        <span className="text-[#1A1A1A] font-semibold">{item.value.toLocaleString("en-IN")} <span className="text-[#9A9A9A] font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bento-card">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Scan size={20} />, label: "Scan QR", href: "/manage/scan", color: "saffron" },
                  { icon: <Calendar size={20} />, label: "New Event", href: "/manage/events/create", color: "green" },
                  { icon: <Users size={20} />, label: "Add User", href: "/manage/users/new", color: "gold" },
                  { icon: <Star size={20} />, label: "Rate Assets", href: "/manage/rating", color: "default" },
                  { icon: <FileText size={20} />, label: "Reports", href: "/manage/reports", color: "default" },
                  { icon: <Package size={20} />, label: "List Asset", href: "/manage/assets/new", color: "default" },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-saffron-300 hover:bg-saffron-50 transition-colors text-center`}>
                      <span className="text-[#7A7A7A]">{action.icon}</span>
                      <span className="text-xs font-semibold text-[#3D3D3D]">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-white text-xs text-[#9A9A9A] flex flex-wrap gap-4 justify-between">
          <span>© 2026 Ministry of Finance, Government of India · GAMS v1.0</span>
          <span>Hosted by NIC · GIGW Compliant · WCAG 2.1 AA</span>
        </footer>
      </div>
    </div>
  );
}
