"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  LayoutDashboard,
  QrCode,
  Calendar,
  Bell,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  Package,
  Clock,
  CheckCircle2,
  LogOut,
  Scan,
  User,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentScan {
  id: string;
  asset_id: string;
  action: string;
  scanned_at: string;
}

interface ActiveEvent {
  id: string;
  name: string;
  location: string;
  start_date: string;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV = [
  {
    label: "Overview",
    items: [
      { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/manage/volunteer" },
    ],
  },
  {
    label: "Tasks",
    items: [
      { icon: <QrCode size={18} />, label: "Scan QR", href: "/manage/scan" },
      { icon: <Calendar size={18} />, label: "My Events", href: "/manage/events" },
      { icon: <Bell size={18} />, label: "Notifications", href: "/manage/notifications" },
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
            <p className="text-sm font-bold text-[#1A1A1A]">GAMS · Volunteer</p>
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
            <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center border border-green-200 shrink-0">
              {userInitials}
            </div>
            <div>
              <p className="text-[10px] text-[#9A9A9A] font-medium">GAMS v1.0</p>
              <p className="text-[10px] text-[#B0B0A8]">Volunteer Portal</p>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VolunteerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("VL");
  const [stats, setStats] = useState({
    scansToday: 0,
    myEvents: 0,
    defectsReported: 0,
    assetsTracked: 0,
    loaded: false,
  });
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);

  useEffect(() => {
    const db = createClient();
    let userId = "";

    db.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      userId = data.user.id;

      // Build initials
      const email = data.user.email ?? "";
      const meta = data.user.user_metadata;
      const name: string = meta?.full_name ?? meta?.name ?? email;
      const parts = name.trim().split(" ");
      setUserInitials(
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase()
      );

      const today = new Date().toISOString().split("T")[0];

      const [scansRes, eventsRes, defectsRes, assetsRes, recentScansRes, activeEventsRes] =
        await Promise.all([
          // Scans today by this user
          db.from("scans")
            .select("*", { count: "exact", head: true })
            .eq("scanned_by", userId)
            .gte("scanned_at", `${today}T00:00:00Z`),
          // Events this user is assigned to (via volunteer_event_assignments or events table)
          db.from("events")
            .select("*", { count: "exact", head: true })
            .eq("status", "ongoing"),
          // Defects reported by this user
          db.from("defects")
            .select("*", { count: "exact", head: true })
            .eq("reported_by", userId),
          // Assets scanned ever by this user (distinct)
          db.from("scans")
            .select("*", { count: "exact", head: true })
            .eq("scanned_by", userId),
          // Recent scans (last 10)
          db.from("scans")
            .select("id, product_instance_id, action, scanned_at")
            .eq("scanned_by", userId)
            .order("scanned_at", { ascending: false })
            .limit(10),
          // Active events
          db.from("events")
            .select("id, name, location, start_date")
            .eq("status", "ongoing")
            .order("start_date", { ascending: true })
            .limit(5),
        ]);

      setStats({
        scansToday: scansRes.count ?? 0,
        myEvents: eventsRes.count ?? 0,
        defectsReported: defectsRes.count ?? 0,
        assetsTracked: assetsRes.count ?? 0,
        loaded: true,
      });

      if (recentScansRes.data) {
        setRecentScans(
          recentScansRes.data.map((s: any) => ({
            id: s.id,
            asset_id: s.product_instance_id ?? "N/A",
            action: s.action ?? "scanned",
            scanned_at: s.scanned_at,
          }))
        );
      }

      if (activeEventsRes.data) {
        setActiveEvents(
          activeEventsRes.data.map((e: any) => ({
            id: e.id,
            name: e.name,
            location: e.location ?? "—",
            start_date: e.start_date,
          }))
        );
      }
    });
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
                <h1 className="text-base font-bold text-[#1A1A1A]">Volunteer Dashboard</h1>
                <p className="text-xs text-[#7A7A7A]">स्वयंसेवक डैशबोर्ड · QR Scanner Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center border border-green-200">
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

          {/* ── Quick Stats ── */}
          <section>
            <h2 className="page-title mb-4">My Activity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickStat
                label="Scans Today"
                value={stats.loaded ? stats.scansToday.toLocaleString("en-IN") : "—"}
                sub="QR codes scanned today"
                icon={<Scan size={20} />}
                variant="saffron"
              />
              <QuickStat
                label="My Events"
                value={stats.loaded ? stats.myEvents.toLocaleString("en-IN") : "—"}
                sub="Currently active events"
                icon={<Calendar size={20} />}
                variant="green"
              />
              <QuickStat
                label="Defects Reported"
                value={stats.loaded ? stats.defectsReported.toLocaleString("en-IN") : "—"}
                sub="Total by me"
                icon={<AlertTriangle size={20} />}
                variant="danger"
              />
              <QuickStat
                label="Assets Tracked"
                value={stats.loaded ? stats.assetsTracked.toLocaleString("en-IN") : "—"}
                sub="Total scans ever"
                icon={<Package size={20} />}
                variant="default"
              />
            </div>
          </section>

          {/* ── QR Scan CTA ── */}
          <section>
            <Link href="/manage/scan">
              <div className="bento-card flex flex-col sm:flex-row items-center gap-6 cursor-pointer hover:border-saffron-300 hover:bg-saffron-50 transition-colors group">
                <div className="shrink-0 w-24 h-24 rounded-2xl bg-saffron-100 flex items-center justify-center group-hover:bg-saffron-200 transition-colors">
                  <QrCode size={48} className="text-saffron-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">Scan QR Code</h3>
                  <p className="text-sm text-[#5A5A5A] mt-1 max-w-xs">
                    Open the QR scanner to activate, transfer, or inspect a government asset.
                    Point your camera at the asset QR label.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 text-white text-sm font-semibold group-hover:bg-saffron-600 transition-colors">
                    <Scan size={16} />
                    Open Scanner
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* ── Bottom Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Recent Scans */}
            <div className="bento-card md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Recent Scans</h3>
                <span className="text-xs text-[#9A9A9A]">Last 10 entries</span>
              </div>

              {recentScans.length === 0 && stats.loaded ? (
                <div className="text-center py-10 text-[#9A9A9A]">
                  <QrCode size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No scans recorded yet. Start scanning assets!</p>
                </div>
              ) : recentScans.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-surface rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-[#7A7A7A] pb-2 pr-4">Asset ID</th>
                        <th className="text-left text-xs font-semibold text-[#7A7A7A] pb-2 pr-4">Action</th>
                        <th className="text-left text-xs font-semibold text-[#7A7A7A] pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan) => (
                        <tr key={scan.id} className="border-b border-border last:border-0">
                          <td className="py-2.5 pr-4">
                            <span className="font-mono text-xs text-[#1A1A1A]">
                              {scan.asset_id.slice(0, 16)}…
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="badge bg-saffron-100 text-saffron-700 capitalize">
                              {scan.action}
                            </span>
                          </td>
                          <td className="py-2.5 text-xs text-[#7A7A7A]">
                            {formatTime(scan.scanned_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right column: Active Events + Quick Actions */}
            <div className="flex flex-col gap-4">

              {/* Active Events */}
              <div className="bento-card flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#1A1A1A]">Active Events</h3>
                  <Link href="/manage/events" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                    All <ChevronRight size={12} />
                  </Link>
                </div>

                {activeEvents.length === 0 && stats.loaded ? (
                  <p className="text-xs text-[#9A9A9A] py-4 text-center">No active events right now.</p>
                ) : activeEvents.length === 0 ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-12 bg-surface rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeEvents.map((event) => (
                      <div key={event.id} className="p-2.5 rounded-xl bg-green-50 border border-green-100">
                        <p className="text-sm font-semibold text-[#1A1A1A] leading-tight">{event.name}</p>
                        <p className="text-xs text-[#7A7A7A] mt-0.5">
                          {event.location} · {formatDate(event.start_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bento-card">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/manage/scan" className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-saffron-50 border border-border hover:border-saffron-200 transition-colors">
                    <Scan size={16} className="text-saffron-600 shrink-0" />
                    <span className="text-sm font-medium text-[#1A1A1A]">Scan QR Code</span>
                    <ChevronRight size={12} className="ml-auto text-[#9A9A9A]" />
                  </Link>
                  <Link href="/manage/defects" className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-red-50 border border-border hover:border-red-200 transition-colors">
                    <AlertTriangle size={16} className="text-danger shrink-0" />
                    <span className="text-sm font-medium text-[#1A1A1A]">Report Defect</span>
                    <ChevronRight size={12} className="ml-auto text-[#9A9A9A]" />
                  </Link>
                  <Link href="/manage/events" className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-green-50 border border-border hover:border-green-200 transition-colors">
                    <Calendar size={16} className="text-green-600 shrink-0" />
                    <span className="text-sm font-medium text-[#1A1A1A]">View Events</span>
                    <ChevronRight size={12} className="ml-auto text-[#9A9A9A]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-white text-xs text-[#9A9A9A] flex flex-wrap gap-4 justify-between">
          <span>© 2026 Ministry of Finance, Government of India · GAMS v1.0</span>
          <span>Volunteer Portal · WCAG 2.1 AA</span>
        </footer>
      </div>
    </div>
  );
}
