"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  Calendar,
  FileText,
  Clock,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  Star,
  Scan,
  CheckCircle2,
  Lock,
  LogOut,
  Eye,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  user_name: string;
  created_at: string;
  type: "scan" | "approve" | "defect" | "rating" | "event";
}

interface ActiveEvent {
  id: string;
  name: string;
  location: string;
  status: string;
  level: string;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV = [
  {
    label: "Overview",
    items: [
      { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/manage/viewer" },
    ],
  },
  {
    label: "Browse",
    items: [
      { icon: <Package size={18} />, label: "Asset Registry", href: "/manage/assets" },
      { icon: <Calendar size={18} />, label: "Events", href: "/manage/events" },
      { icon: <FileText size={18} />, label: "Reports", href: "/manage/reports" },
    ],
  },
  {
    label: "Audit",
    items: [
      { icon: <Clock size={18} />, label: "Audit Log", href: "/manage/audit" },
      { icon: <BarChart3 size={18} />, label: "Analytics", href: "/manage/analytics" },
    ],
  },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────

function Sidebar({ open, onClose, userInitials }: { open: boolean; onClose: () => void; userInitials: string }) {
  return (
    <>
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
            <p className="text-sm font-bold text-[#1A1A1A]">GAMS · Viewer</p>
          </div>
          <button className="md:hidden p-1 rounded-lg hover:bg-surface" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Read-only badge */}
        <div className="mx-3 mt-3 px-3 py-2 bg-[#F0F0EE] border border-border rounded-xl flex items-center gap-2">
          <Lock size={13} className="text-[#7A7A7A] shrink-0" />
          <span className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider">Read Only Access</span>
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
                  <span className="nav-item group flex items-center gap-3">
                    <span className="text-[#7A7A7A] group-hover:text-saffron-600 transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar user + logout */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#E8E8E4] text-[#5A5A5A] font-bold text-xs flex items-center justify-center border border-border shrink-0">
              {userInitials}
            </div>
            <div>
              <p className="text-[10px] text-[#9A9A9A] font-medium">GAMS v1.0</p>
              <p className="text-[10px] text-[#B0B0A8]">Viewer / Auditor</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-1.5 rounded-lg hover:bg-red-50 text-[#9A9A9A] hover:text-danger transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </form>
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

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({ item }: { item: ActivityItem }) {
  const typeColor: Record<string, string> = {
    scan:    "bg-saffron-100 text-saffron-700",
    approve: "bg-green-100 text-green-700",
    defect:  "bg-red-100 text-red-700",
    rating:  "bg-gold-100 text-gold-700",
    event:   "bg-[#E8F0FE] text-[#3C4043]",
  };
  const typeLabel: Record<string, string> = {
    scan: "Scan", approve: "Approved", defect: "Defect", rating: "Rated", event: "Event",
  };

  const timeStr = (() => {
    try {
      const d = new Date(item.created_at);
      const diffMs = Date.now() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "just now";
      if (diffMin < 60) return `${diffMin} min ago`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `${diffH} hr ago`;
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return "—";
    }
  })();

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <span className={`badge ${typeColor[item.type] ?? "bg-surface text-[#5A5A5A]"} shrink-0`}>
        {typeLabel[item.type] ?? item.type}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#1A1A1A] font-medium truncate">
          {item.action} — <span className="text-[#5A5A5A] font-normal">{item.entity}</span>
        </p>
        <p className="text-xs text-[#7A7A7A]">by {item.user_name}</p>
      </div>
      <p className="text-xs text-[#9A9A9A] shrink-0">{timeStr}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ViewerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("VW");
  const [stats, setStats] = useState({
    activeEvents: 0,
    assetsCount: 0,
    openDefects: 0,
    awaitingRating: 0,
    todayScans: 0,
    totalAuditEntries: 0,
    loaded: false,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
  const [distribution, setDistribution] = useState([
    { label: "In Warehouse",                   value: 0, total: 1, color: "bg-[#E2E2DC]" },
    { label: "At Active Events",               value: 0, total: 1, color: "bg-saffron-500" },
    { label: "Redistributed",                  value: 0, total: 1, color: "bg-green-500" },
    { label: "Post-Event (Rating Pending)",    value: 0, total: 1, color: "bg-gold-500" },
    { label: "Condemned / Lost",               value: 0, total: 1, color: "bg-danger" },
  ]);

  useEffect(() => {
    const db = createClient();

    // Fetch user initials
    db.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email ?? "";
        const meta = data.user.user_metadata;
        const name: string = meta?.full_name ?? meta?.name ?? email;
        const parts = name.trim().split(" ");
        setUserInitials(
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase()
        );
      }
    });

    const today = new Date().toISOString().split("T")[0];

    Promise.all([
      db.from("events").select("*", { count: "exact", head: true }).eq("status", "ongoing"),
      db.from("product_instances").select("*", { count: "exact", head: true }),
      db.from("defects").select("*", { count: "exact", head: true }).eq("is_resolved", false),
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "pending_rating"),
      db.from("scans").select("*", { count: "exact", head: true }).gte("scanned_at", `${today}T00:00:00Z`),
      // Asset status breakdown
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "in_stock"),
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "deployed"),
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "redistributed"),
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "condemned"),
      // Active events list
      db.from("events")
        .select("id, name, location, status, level")
        .eq("status", "ongoing")
        .order("start_date", { ascending: true })
        .limit(6),
    ]).then(([evts, assets, defects, rating, scans, warehouse, atEvent, redist, condemned, evtList]) => {
      const total = assets.count ?? 1;

      setStats({
        activeEvents: evts.count ?? 0,
        assetsCount: assets.count ?? 0,
        openDefects: defects.count ?? 0,
        awaitingRating: rating.count ?? 0,
        todayScans: scans.count ?? 0,
        totalAuditEntries: 0,
        loaded: true,
      });

      setDistribution([
        { label: "In Warehouse",                value: warehouse.count ?? 0,    total, color: "bg-[#E2E2DC]" },
        { label: "At Active Events",            value: atEvent.count ?? 0,      total, color: "bg-saffron-500" },
        { label: "Redistributed",               value: redist.count ?? 0,       total, color: "bg-green-500" },
        { label: "Post-Event (Rating Pending)", value: rating.count ?? 0,       total, color: "bg-gold-500" },
        { label: "Condemned / Lost",            value: condemned.count ?? 0,    total, color: "bg-danger" },
      ]);

      if (evtList.data) {
        setActiveEvents(
          evtList.data.map((e: any) => ({
            id: e.id,
            name: e.name,
            location: e.location ?? "—",
            status: e.status,
            level: e.level ?? "Central",
          }))
        );
      }
    });

    // Seed some static recent activity for demonstration (in a real system, fetch from audit_log table)
    setRecentActivity([
      { id: "1", action: "QR Scanned — Activated",  entity: "GOI-DLH001-R-ELEC-2024-00003842", user_name: "Vol. Ramesh Kumar",  created_at: new Date(Date.now() - 2 * 60000).toISOString(),          type: "scan"    },
      { id: "2", action: "Company Approved",          entity: "TechnoCraft Solutions Pvt Ltd",  user_name: "Admin Priya Singh",  created_at: new Date(Date.now() - 14 * 60000).toISOString(),         type: "approve" },
      { id: "3", action: "Defect Reported",           entity: "GOI-MHT002-R-FURN-2023-00000181", user_name: "Vol. Anjali Sharma", created_at: new Date(Date.now() - 60 * 60000).toISOString(),       type: "defect"  },
      { id: "4", action: "Asset Rated — 8/10",        entity: "GOI-KAR003-R-APPL-2024-00001020", user_name: "Insp. Mukesh Verma", created_at: new Date(Date.now() - 2 * 3600000).toISOString(),    type: "rating"  },
      { id: "5", action: "Event Created",             entity: "State Cultural Fest 2026, Kochi", user_name: "Admin Suresh Nair",  created_at: new Date(Date.now() - 3 * 3600000).toISOString(),     type: "event"   },
      { id: "6", action: "Institution Approved",      entity: "Asha Foundation NGO, Mumbai",    user_name: "Admin Priya Singh",  created_at: new Date(Date.now() - 4 * 3600000).toISOString(),     type: "approve" },
    ]);
  }, []);

  return (
    <div className="flex min-h-dvh bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} userInitials={userInitials} />

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
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-[#1A1A1A]">Viewer Dashboard</h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F0EE] border border-border text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider">
                    <Eye size={10} /> View Only
                  </span>
                </div>
                <p className="text-xs text-[#7A7A7A]">दर्शक डैशबोर्ड · Read-Only Audit View</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E8E8E4] text-[#5A5A5A] font-bold text-sm flex items-center justify-center border border-border">
                {userInitials}
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-sm text-[#5A5A5A] hover:bg-red-50 hover:text-danger hover:border-red-200 transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 md:p-6 space-y-6">

          {/* ── Read-Only Banner ── */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F5F5F2] border border-border">
            <Lock size={16} className="text-[#7A7A7A] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#3D3D3D]">Read Only Access</p>
              <p className="text-xs text-[#7A7A7A]">
                You are viewing GAMS data in read-only mode. No modifications can be made from this account.
                Contact your administrator to request elevated permissions.
              </p>
            </div>
          </div>

          {/* ── Quick Stats ── */}
          <section>
            <h2 className="page-title mb-4">System Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                sub="Unresolved issues"
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
                variant="saffron"
              />
            </div>
          </section>

          {/* ── Main Content Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Recent Activity */}
            <div className="bento-card md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Recent Activity</h3>
                <Link href="/manage/audit" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                  Full log <ChevronRight size={12} />
                </Link>
              </div>
              <div>
                {recentActivity.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Asset Status Distribution */}
            <div className="bento-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Asset Distribution</h3>
                <Link href="/manage/analytics" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                  Analytics <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {distribution.map((item) => {
                  const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5A5A5A] font-medium">{item.label}</span>
                        <span className="text-[#1A1A1A] font-semibold">
                          {item.value.toLocaleString("en-IN")}
                          {stats.loaded && <span className="text-[#9A9A9A] font-normal"> ({pct}%)</span>}
                        </span>
                      </div>
                      <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: stats.loaded ? `${pct}%` : "0%" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Active Events ── */}
          <div className="bento-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A1A1A]">Active Events</h3>
              <Link href="/manage/events" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                All events <ChevronRight size={12} />
              </Link>
            </div>

            {activeEvents.length === 0 && stats.loaded ? (
              <div className="text-center py-8 text-[#9A9A9A]">
                <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No active events at this time.</p>
              </div>
            ) : activeEvents.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] leading-tight truncate">{event.name}</p>
                      <p className="text-xs text-[#7A7A7A] mt-0.5">{event.location}</p>
                    </div>
                    <span className={`badge shrink-0 ml-2 text-[10px] ${
                      event.level === "Central" ? "badge-saffron" :
                      event.level === "State"   ? "badge-active" : "badge-pending"
                    }`}>
                      {event.level || "Central"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Browse Links ── */}
          <div className="bento-card">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Browse Data</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { icon: <Package size={20} />,    label: "Asset Registry", href: "/manage/assets",    note: "View all assets" },
                { icon: <Calendar size={20} />,   label: "Events",         href: "/manage/events",    note: "All events" },
                { icon: <FileText size={20} />,   label: "Reports",        href: "/manage/reports",   note: "Download reports" },
                { icon: <Clock size={20} />,      label: "Audit Log",      href: "/manage/audit",     note: "Full history" },
                { icon: <BarChart3 size={20} />,  label: "Analytics",      href: "/manage/analytics", note: "Charts & trends" },
                { icon: <AlertTriangle size={20} />, label: "Defects",     href: "/manage/defects",   note: "View all defects" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-saffron-300 hover:bg-saffron-50 transition-colors text-center group">
                    <span className="text-[#7A7A7A] group-hover:text-saffron-600 transition-colors">{action.icon}</span>
                    <span className="text-xs font-semibold text-[#3D3D3D]">{action.label}</span>
                    <span className="text-[10px] text-[#9A9A9A]">{action.note}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-white text-xs text-[#9A9A9A] flex flex-wrap gap-4 justify-between">
          <span>© 2026 Ministry of Finance, Government of India · GAMS v1.0</span>
          <span>Read-Only Viewer · WCAG 2.1 AA · NIC Hosted</span>
        </footer>
      </div>
    </div>
  );
}
