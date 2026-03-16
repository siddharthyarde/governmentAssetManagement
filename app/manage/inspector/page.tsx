"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  LayoutDashboard,
  Star,
  AlertTriangle,
  Clock,
  Calendar,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  Package,
  LogOut,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingAsset {
  id: string;
  product_name: string;
  event_name: string;
  qr_code: string;
  rating: number;
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────

const NAV = [
  {
    label: "Overview",
    items: [
      { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/manage/inspector" },
    ],
  },
  {
    label: "Inspection",
    items: [
      { icon: <Star size={18} />, label: "Rate Assets", href: "/manage/rating" },
      { icon: <AlertTriangle size={18} />, label: "Defects", href: "/manage/defects" },
      { icon: <Clock size={18} />, label: "Audit Log", href: "/manage/audit" },
    ],
  },
  {
    label: "Events",
    items: [
      { icon: <ClipboardList size={18} />, label: "Event Assets", href: "/manage/event-assets" },
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
            <p className="text-sm font-bold text-[#1A1A1A]">GAMS · Inspector</p>
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
            <div className="w-7 h-7 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center border border-saffron-200 shrink-0">
              {userInitials}
            </div>
            <div>
              <p className="text-[10px] text-[#9A9A9A] font-medium">GAMS v1.0</p>
              <p className="text-[10px] text-[#B0B0A8]">Inspector Portal</p>
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InspectorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("IN");
  const [stats, setStats] = useState({
    awaitingRating: 0,
    inspectedToday: 0,
    openDefects: 0,
    eventsThisWeek: 0,
    loaded: false,
  });
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

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
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    Promise.all([
      db.from("product_instances").select("*", { count: "exact", head: true }).eq("status", "pending_rating"),
      db.from("product_instances").select("*", { count: "exact", head: true })
        .gte("condition_rating", 1)
        .gte("updated_at", `${today}T00:00:00Z`),
      db.from("defects").select("*", { count: "exact", head: true }).eq("is_resolved", false),
      db.from("events").select("*", { count: "exact", head: true })
        .gte("start_date", `${today}T00:00:00Z`)
        .lte("start_date", `${weekEndStr}T23:59:59Z`),
    ]).then(([rating, inspected, defects, events]) => {
      setStats({
        awaitingRating: rating.count ?? 0,
        inspectedToday: inspected.count ?? 0,
        openDefects: defects.count ?? 0,
        eventsThisWeek: events.count ?? 0,
        loaded: true,
      });
    });

    // Fetch pending assets with product and event info
    db.from("product_instances")
      .select(`
        id,
        qr_code,
        status,
        products ( name ),
        event_asset_assignments ( events ( name ) )
      `)
      .eq("status", "pending_rating")
      .limit(10)
      .then(({ data }) => {
        if (data) {
          const mapped: PendingAsset[] = data.map((row: any) => ({
            id: row.id,
            qr_code: row.qr_code ?? row.id.slice(0, 8).toUpperCase(),
            product_name: row.products?.name ?? "Unknown Product",
            event_name:
              row.event_asset_assignments?.[0]?.events?.name ?? "No Event",
            rating: 0,
          }));
          setPendingAssets(mapped);
        }
      });
  }, []);

  function handleRatingChange(assetId: string, value: number) {
    setRatings((prev) => ({ ...prev, [assetId]: value }));
  }

  async function handleSubmitRating(assetId: string) {
    const rating = ratings[assetId];
    if (!rating || rating < 1 || rating > 10) return;
    setSubmitting((prev) => ({ ...prev, [assetId]: true }));
    const db = createClient();
    await db
      .from("product_instances")
      .update({ condition_rating: rating, status: "in_stock" })
      .eq("id", assetId);
    setSubmitting((prev) => ({ ...prev, [assetId]: false }));
    setSubmitted((prev) => ({ ...prev, [assetId]: true }));
    setStats((prev) => ({
      ...prev,
      awaitingRating: Math.max(0, prev.awaitingRating - 1),
      inspectedToday: prev.inspectedToday + 1,
    }));
  }

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
                <h1 className="text-base font-bold text-[#1A1A1A]">Inspector Dashboard</h1>
                <p className="text-xs text-[#7A7A7A]">निरीक्षक डैशबोर्ड · Asset Inspection Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm flex items-center justify-center border border-saffron-200">
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
            <h2 className="page-title mb-4">Inspection Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickStat
                label="Assets Awaiting Rating"
                value={stats.loaded ? stats.awaitingRating.toLocaleString("en-IN") : "—"}
                sub="Pending post-event inspection"
                icon={<Star size={20} />}
                variant="gold"
              />
              <QuickStat
                label="Inspections Done Today"
                value={stats.loaded ? stats.inspectedToday.toLocaleString("en-IN") : "—"}
                sub="Completed ratings today"
                icon={<CheckCircle2 size={20} />}
                variant="green"
              />
              <QuickStat
                label="Open Defects"
                value={stats.loaded ? stats.openDefects.toLocaleString("en-IN") : "—"}
                sub="Awaiting resolution"
                icon={<AlertTriangle size={20} />}
                variant="danger"
              />
              <QuickStat
                label="Events This Week"
                value={stats.loaded ? stats.eventsThisWeek.toLocaleString("en-IN") : "—"}
                sub="Upcoming in next 7 days"
                icon={<Calendar size={20} />}
                variant="saffron"
              />
            </div>
          </section>

          {/* ── Main Content Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Assets Pending Inspection */}
            <div className="bento-card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1A1A1A]">Assets Pending Inspection</h3>
                <Link href="/manage/rating" className="text-xs text-saffron-600 hover:underline flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </Link>
              </div>

              {pendingAssets.length === 0 && stats.loaded ? (
                <div className="text-center py-12 text-[#9A9A9A]">
                  <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
                  <p className="font-semibold text-[#5A5A5A]">All caught up!</p>
                  <p className="text-sm mt-1">No assets are currently pending inspection.</p>
                </div>
              ) : pendingAssets.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`p-3 rounded-xl border transition-colors ${
                        submitted[asset.id]
                          ? "border-green-200 bg-green-50"
                          : "border-border bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                            {asset.product_name}
                          </p>
                          <p className="text-xs text-[#7A7A7A]">
                            QR: {asset.qr_code} · Event: {asset.event_name}
                          </p>
                        </div>

                        {submitted[asset.id] ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle2 size={12} /> Submitted
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1">
                              <label className="text-xs text-[#7A7A7A] font-medium">Rating</label>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                step={1}
                                value={ratings[asset.id] ?? ""}
                                onChange={(e) =>
                                  handleRatingChange(asset.id, Number(e.target.value))
                                }
                                className="w-16 px-2 py-1 text-sm border border-border rounded-lg text-center focus:outline-none focus:border-saffron-400"
                                placeholder="1–10"
                              />
                            </div>
                            <button
                              onClick={() => handleSubmitRating(asset.id)}
                              disabled={submitting[asset.id] || !ratings[asset.id]}
                              className="px-3 py-1.5 text-xs font-semibold bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {submitting[asset.id] ? "Saving…" : "Submit Rating"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bento-card flex flex-col gap-3">
              <h3 className="font-semibold text-[#1A1A1A]">Quick Actions</h3>

              <Link href="/manage/rating" className="flex items-center gap-3 p-3 rounded-xl bg-gold-50 hover:bg-gold-100 transition-colors border border-gold-100">
                <div className="p-2 rounded-lg bg-gold-100 text-gold-700">
                  <Star size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Rate Asset</p>
                  <p className="text-xs text-[#7A7A7A]">Open rating module</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#9A9A9A]" />
              </Link>

              <Link href="/manage/defects" className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors border border-red-100">
                <div className="p-2 rounded-lg bg-red-100 text-danger">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Report Defect</p>
                  <p className="text-xs text-[#7A7A7A]">Log damage or issue</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#9A9A9A]" />
              </Link>

              <Link href="/manage/event-assets" className="flex items-center gap-3 p-3 rounded-xl bg-saffron-50 hover:bg-saffron-100 transition-colors border border-saffron-100">
                <div className="p-2 rounded-lg bg-saffron-100 text-saffron-700">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">View Event Assets</p>
                  <p className="text-xs text-[#7A7A7A]">Browse assigned assets</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#9A9A9A]" />
              </Link>

              <Link href="/manage/audit" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors border border-border">
                <div className="p-2 rounded-lg bg-surface text-[#5A5A5A]">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Audit Log</p>
                  <p className="text-xs text-[#7A7A7A]">Review inspection history</p>
                </div>
                <ChevronRight size={14} className="ml-auto text-[#9A9A9A]" />
              </Link>

              {/* Inspector info banner */}
              <div className="mt-auto p-3 rounded-xl bg-saffron-50 border border-saffron-100">
                <div className="flex items-center gap-2 mb-1">
                  <Package size={14} className="text-saffron-600" />
                  <span className="text-xs font-bold text-saffron-700">Inspection Role</span>
                </div>
                <p className="text-xs text-[#7A7A7A] leading-relaxed">
                  You are logged in as an <strong>Inspector</strong>. You can rate assets,
                  report defects, and review event asset assignments.
                </p>
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-border bg-white text-xs text-[#9A9A9A] flex flex-wrap gap-4 justify-between">
          <span>© 2026 Ministry of Finance, Government of India · GAMS v1.0</span>
          <span>Inspector Portal · WCAG 2.1 AA</span>
        </footer>
      </div>
    </div>
  );
}
