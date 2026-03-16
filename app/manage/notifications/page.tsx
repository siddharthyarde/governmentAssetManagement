"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, CheckCheck, X, Filter, Package, Building2, Users,
  Calendar, AlertTriangle, FileText, CheckCircle2, Clock,
  Info, LayoutDashboard, Warehouse, QrCode, Star, Settings,
  ClipboardList, ChevronRight,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type NotifType = "approval" | "alert" | "info" | "event" | "system";
type NotifStatus = "unread" | "read";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  source: string;
  time: string;
  status: NotifStatus;
  link?: string;
}

const NOTIFS: Notification[] = [
  { id: "N001", type: "approval", title: "New Company Registration", body: "Jai Hind Traders Pvt. Ltd. has submitted registration. GSTIN: 07AAACJ1234F1Z5", source: "System", time: "2 min ago", status: "unread", link: "/companies" },
  { id: "N002", type: "approval", title: "Institution Approval Pending", body: "AIIMS Bhopal requests asset access approval for Diwali Sports Meet assets.", source: "System", time: "14 min ago", status: "unread", link: "/institutions" },
  { id: "N003", type: "alert", title: "QR Scan Mismatch Detected", body: "Asset QR PRD-2024-00298 scanned at Delhi warehouse but registered in Mumbai. Requires review.", source: "QR Scanner", time: "1 hr ago", status: "unread", link: "/scan" },
  { id: "N004", type: "approval", title: "Bulk Product Upload", body: "Surya Electricals uploaded 184 products via CSV. 4 rows failed validation.", source: "Company Portal", time: "2 hrs ago", status: "unread", link: "/companies" },
  { id: "N005", type: "event", title: "Event Closed — G20 Summit 2023", body: "Assets from G20 Summit are now available for marketplace listing. 2,400 items pending allocation.", source: "Events Module", time: "3 hrs ago", status: "read", link: "/events" },
  { id: "N006", type: "alert", title: "Defect Report Submitted", body: "Ravi Logistics marked 12 folding tables as defective (cracked frame). Photos attached.", source: "Defects Module", time: "5 hrs ago", status: "read", link: "/defects" },
  { id: "N007", type: "info", title: "Monthly Analytics Ready", body: "January 2025 analytics report is ready. QR scans +31%, asset value redistributed ₹142 Cr.", source: "Analytics", time: "6 hrs ago", status: "read", link: "/analytics" },
  { id: "N008", type: "system", title: "System Backup Complete", body: "Nightly database backup completed successfully. 3.2 GB backed up to NIC cloud.", source: "System", time: "Yesterday", status: "read" },
  { id: "N009", type: "approval", title: "New User Registration", body: "Vikram Singh (Ministry of Jal Shakti) registered as Buyer. Pending role assignment.", source: "User Module", time: "Yesterday", status: "read", link: "/users" },
  { id: "N010", type: "event", title: "Redistribution Scheduled", body: "150 AV sets from Digital India Conclave will be redistributed to IIT Bombay on Jan 20.", source: "Redistribution", time: "2 days ago", status: "read", link: "/redistribution" },
];

const TYPE_META: Record<NotifType, { icon: React.ElementType; bg: string; fg: string; label: string }> = {
  approval: { icon: CheckCircle2, bg: "bg-saffron-50", fg: "text-saffron-600", label: "Approval" },
  alert:    { icon: AlertTriangle, bg: "bg-red-50",     fg: "text-red-500",     label: "Alert"    },
  info:     { icon: Info,          bg: "bg-blue-50",    fg: "text-blue-600",    label: "Info"     },
  event:    { icon: Calendar,      bg: "bg-green-50",   fg: "text-green-600",   label: "Event"    },
  system:   { icon: Settings,      bg: "bg-gray-100",   fg: "text-gray-500",    label: "System"   },
};

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/notifications", icon: Bell, label: "Notifications" },
  { href: "/manage/assets", icon: Package, label: "Asset Registry" },
  { href: "/manage/companies", icon: Building2, label: "Companies" },
  { href: "/manage/events", icon: Calendar, label: "Events" },
  { href: "/manage/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/manage/analytics", icon: FileText, label: "Analytics" },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(NOTIFS);
  const [filter, setFilter] = useState<"all" | NotifType | "unread">("all");

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await db.from("notifications")
        .select("id, title, body, link, is_read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data && data.length > 0) {
        setItems(data.map((n) => ({
          id: n.id,
          type: "info" as NotifType,
          title: n.title,
          body: n.body,
          source: "System",
          time: new Date(n.created_at).toLocaleDateString("en-IN"),
          status: (n.is_read ? "read" : "unread") as NotifStatus,
          link: n.link ?? undefined,
        })));
      }
    });
  }, []);

  const unreadCount = items.filter((n) => n.status === "unread").length;

  const filtered = items.filter((n) => {
    if (filter === "unread") return n.status === "unread";
    if (filter === "all") return true;
    return n.type === filter;
  });

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, status: "read" } : n));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, status: "read" as NotifStatus })));
  }

  function dismiss(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/notifications" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[10px] text-[#9A9A9A]">GAMS v1.0 · Ministry of Finance</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-saffron-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount} unread</span>
            )}
          </div>
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:text-saffron-700">
            <CheckCheck size={14} /> Mark all read
          </button>
        </header>

        <main className="flex-1 px-6 py-6 max-w-3xl">
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-5">
            {(["all", "unread", "approval", "alert", "event", "info", "system"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${filter === f ? "bg-saffron-500 text-white" : "bg-white border border-border text-gray-600 hover:bg-surface"}`}
              >
                {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : TYPE_META[f]?.label}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <div className="bg-white border border-border rounded-2xl p-12 text-center">
                <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-semibold text-gray-400">No notifications</p>
              </div>
            )}
            {filtered.map((n) => {
              const meta = TYPE_META[n.type];
              const Icon = meta.icon;
              return (
                <div
                  key={n.id}
                  className={`bg-white border rounded-2xl p-4 flex gap-4 transition-all ${n.status === "unread" ? "border-saffron-200 shadow-sm" : "border-border"}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                    <Icon size={16} className={meta.fg} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-bold text-gray-900 ${n.status === "unread" ? "" : "font-semibold"}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {n.status === "unread" && (
                          <button onClick={() => markRead(n.id)} className="p-1.5 text-gray-400 hover:text-saffron-600 rounded-lg hover:bg-saffron-50" title="Mark read">
                            <CheckCheck size={13} />
                          </button>
                        )}
                        <button onClick={() => dismiss(n.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Dismiss">
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] font-medium text-gray-400">{n.source}</span>
                      {n.link && (
                        <Link href={n.link} className="text-[10px] font-bold text-saffron-600 hover:underline ml-auto flex items-center gap-0.5">
                          View <ChevronRight size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
