"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock, Search, Download, Filter, LayoutDashboard, Bell,
  Package, FileText, CheckCircle2, BarChart3, Settings,
  User, Shield, Package2, Calendar, Building2, LogIn,
  Pencil, Trash2, Key, Eye, AlertTriangle,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type AuditModule = "assets" | "users" | "events" | "approvals" | "auth" | "redistribution" | "reports" | "settings";
type AuditAction = "create" | "update" | "delete" | "view" | "approve" | "reject" | "login" | "export";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: AuditAction;
  module: AuditModule;
  description: string;
  ip: string;
  severity: "info" | "warning" | "critical";
}

const LOG: AuditEntry[] = [
  { id: "AUD-001", timestamp: "2024-02-15 14:32:11", user: "Suresh Kumar", userRole: "Super Admin", action: "approve", module: "approvals", description: "Approved company registration: Jai Hind Traders (CMP-041)", ip: "10.0.0.12", severity: "info" },
  { id: "AUD-002", timestamp: "2024-02-15 13:55:04", user: "Priya Verma", userRole: "Asset Manager", action: "update", module: "assets", description: "Updated condition of AST-010 (UPS) from 'Excellent' to 'Defective' after event inspection", ip: "10.0.0.25", severity: "warning" },
  { id: "AUD-003", timestamp: "2024-02-15 12:44:58", user: "Meena Shah", userRole: "Event Coordinator", action: "create", module: "events", description: "Created new event: Smart Cities Conclave 2024 (EVT-048)", ip: "10.0.0.31", severity: "info" },
  { id: "AUD-004", timestamp: "2024-02-15 11:20:33", user: "Anil Tripathi", userRole: "Warehouse Manager", action: "export", module: "reports", description: "Exported QR Scan Audit Log Q4 2023 (CSV, 2.8 MB)", ip: "10.0.0.18", severity: "info" },
  { id: "AUD-005", timestamp: "2024-02-15 10:05:17", user: "Unknown", userRole: "—", action: "login", module: "auth", description: "Failed login attempt: 5 consecutive failures for user 'admin@gov.in'. IP blocked for 30 min.", ip: "203.45.67.89", severity: "critical" },
  { id: "AUD-006", timestamp: "2024-02-14 17:42:51", user: "Suresh Kumar", userRole: "Super Admin", action: "delete", module: "users", description: "Deactivated user account: ravi.sharma@ministry.gov.in (USR-019)", ip: "10.0.0.12", severity: "warning" },
  { id: "AUD-007", timestamp: "2024-02-14 16:15:22", user: "Rajesh Nair", userRole: "Logistics Officer", action: "update", module: "redistribution", description: "Marked RDT-001 (200 Chairs to AIIMS Delhi) status as 'Delivered'", ip: "10.0.0.44", severity: "info" },
  { id: "AUD-008", timestamp: "2024-02-14 14:08:39", user: "Priya Verma", userRole: "Asset Manager", action: "create", module: "assets", description: "Added 50 new units to AST-007 (Crowd Barriers). Total: 800 units.", ip: "10.0.0.25", severity: "info" },
  { id: "AUD-009", timestamp: "2024-02-14 12:30:00", user: "Suresh Kumar", userRole: "Super Admin", action: "update", module: "settings", description: "Changed system notification email to: gams-alerts@ministry.gov.in", ip: "10.0.0.12", severity: "warning" },
  { id: "AUD-010", timestamp: "2024-02-14 09:00:00", user: "Meena Shah", userRole: "Event Coordinator", action: "approve", module: "approvals", description: "Approved redistribution request RDT-003 (50 LED Lights → NDA Pune)", ip: "10.0.0.31", severity: "info" },
  { id: "AUD-011", timestamp: "2024-02-13 18:11:42", user: "Anil Tripathi", userRole: "Warehouse Manager", action: "view", module: "assets", description: "Accessed full asset registry export (all 1,247 records)", ip: "10.0.0.18", severity: "info" },
  { id: "AUD-012", timestamp: "2024-02-13 15:55:19", user: "Rajesh Nair", userRole: "Logistics Officer", action: "reject", module: "redistribution", description: "Rejected RDT-005 (Amplifiers → Pune University). Reason: Audit lock.", ip: "10.0.0.44", severity: "info" },
];

const MODULE_META: Record<AuditModule, { label: string; icon: React.ElementType; cls: string }> = {
  assets: { label: "Assets", icon: Package2, cls: "text-blue-600" },
  users: { label: "Users", icon: User, cls: "text-purple-600" },
  events: { label: "Events", icon: Calendar, cls: "text-green-600" },
  approvals: { label: "Approvals", icon: CheckCircle2, cls: "text-saffron-600" },
  auth: { label: "Auth", icon: Key, cls: "text-red-600" },
  redistribution: { label: "Redistribution", icon: Building2, cls: "text-indigo-600" },
  reports: { label: "Reports", icon: FileText, cls: "text-gray-600" },
  settings: { label: "Settings", icon: Settings, cls: "text-orange-600" },
};

const ACTION_META: Record<AuditAction, { label: string; icon: React.ElementType; cls: string }> = {
  create: { label: "Create", icon: Package, cls: "text-green-600" },
  update: { label: "Update", icon: Pencil, cls: "text-blue-600" },
  delete: { label: "Delete", icon: Trash2, cls: "text-red-600" },
  view: { label: "View", icon: Eye, cls: "text-gray-500" },
  approve: { label: "Approve", icon: CheckCircle2, cls: "text-green-600" },
  reject: { label: "Reject", icon: AlertTriangle, cls: "text-orange-600" },
  login: { label: "Login", icon: LogIn, cls: "text-purple-600" },
  export: { label: "Export", icon: Download, cls: "text-saffron-600" },
};

const SEV_CLS = { info: "bg-blue-50 text-blue-600", warning: "bg-yellow-50 text-yellow-700", critical: "bg-red-100 text-red-700 font-bold" };

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/audit", icon: Clock, label: "Audit Log" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<"all" | AuditModule>("all");
  const [sevFilter, setSevFilter] = useState<"all" | "info" | "warning" | "critical">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [log, setLog] = useState<AuditEntry[]>(LOG);

  useEffect(() => {
    const db = createClient();
    db.from("audit_logs")
      .select("id, logged_at, actor_role, action, entity_type, entity_id, ip_address")
      .order("logged_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const MODULE_MAP: Record<string, AuditModule> = {
          products: "assets",
          product_instances: "assets",
          users: "users",
          user_profiles: "users",
          events: "events",
          companies: "approvals",
          institutions: "approvals",
          redistribution_listings: "redistribution",
          redistribution_requests: "redistribution",
          orders: "redistribution",
          audit_logs: "settings",
          settings: "settings",
        };
        const SEV_MAP: Record<string, AuditEntry["severity"]> = {
          delete: "warning",
          login: "critical",
          reject: "warning",
        };
        const ROLE_MAP: Record<string, string> = {
          super_admin: "Super Admin",
          gov_admin: "Asset Manager",
          event_manager: "Event Coordinator",
          inspector: "Inspector",
          volunteer: "Volunteer",
          warehouse_officer: "Warehouse Manager",
          auditor: "Auditor",
        };
        setLog(data.map((e, i) => ({
          id: `AUD-${String(i + 1).padStart(3, "0")}`,
          timestamp: new Date(e.logged_at).toLocaleString("en-IN"),
          user: e.actor_role ? ROLE_MAP[e.actor_role] ?? e.actor_role : "System",
          userRole: e.actor_role ? ROLE_MAP[e.actor_role] ?? e.actor_role : "—",
          action: (e.action as AuditAction) || "view",
          module: (MODULE_MAP[e.entity_type] ?? "assets") as AuditModule,
          description: `${e.action} on ${e.entity_type}${e.entity_id ? ` (${e.entity_id.slice(0, 8)})` : ""}`,
          ip: e.ip_address ?? "0.0.0.0",
          severity: SEV_MAP[e.action] ?? "info",
        })));
      });
  }, []);

  const filtered = log.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = e.user.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.id.toLowerCase().includes(q);
    const matchModule = moduleFilter === "all" || e.module === moduleFilter;
    const matchSev = sevFilter === "all" || e.severity === sevFilter;
    return matchSearch && matchModule && matchSev;
  });

  function exportCSV() {
    const headers = ["ID", "Timestamp", "User", "Role", "Action", "Module", "Description", "IP Address", "Severity"];
    const rows = filtered.map((e) => [
      e.id, e.timestamp, e.user, e.userRole,
      ACTION_META[e.action].label, MODULE_META[e.module].label,
      e.description, e.ip, e.severity,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GAMS-AuditLog-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="min-h-dvh bg-surface flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/audit" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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

        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-gray-900">Audit Log</h1>
            <p className="text-xs text-gray-400">Full history of system actions — user operations, auth events, exports</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600">
            <Download size={13} /> Export Log
          </button>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, description, ID…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as typeof moduleFilter)} className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none">
              <option value="all">All Modules</option>
              {(Object.keys(MODULE_META) as AuditModule[]).map((m) => <option key={m} value={m}>{MODULE_META[m].label}</option>)}
            </select>
            <div className="flex gap-2">
              {(["all", "info", "warning", "critical"] as const).map((s) => (
                <button key={s} onClick={() => setSevFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-bold capitalize ${sevFilter === s ? s === "critical" ? "bg-red-600 text-white" : s === "warning" ? "bg-yellow-500 text-white" : "bg-saffron-500 text-white" : "bg-white border border-border text-gray-600"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <th className="text-left px-4 py-3">Timestamp</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Action</th>
                  <th className="text-left px-4 py-3">Module</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-left px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const ActionIcon = ACTION_META[e.action].icon;
                  const ModIcon = MODULE_META[e.module].icon;
                  return (
                    <React.Fragment key={e.id}>
                      <tr className={`border-b border-border hover:bg-surface cursor-pointer ${expandedId === e.id ? "bg-surface" : ""}`} onClick={() => setExpandedId(e.id === expandedId ? null : e.id)}>
                        <td className="px-4 py-3 text-[11px] font-mono text-gray-500 whitespace-nowrap">{e.timestamp}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-gray-800">{e.user}</p>
                          <p className="text-[10px] text-gray-400">{e.userRole}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-bold ${ACTION_META[e.action].cls}`}>
                            <ActionIcon size={11} /> {ACTION_META[e.action].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-semibold ${MODULE_META[e.module].cls}`}>
                            <ModIcon size={11} /> {MODULE_META[e.module].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700 max-w-xs truncate">{e.description}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize ${SEV_CLS[e.severity]}`}>{e.severity}</span>
                        </td>
                      </tr>
                      {expandedId === e.id && (
                        <tr className="bg-blue-50 border-b border-border">
                          <td colSpan={6} className="px-6 py-3">
                            <div className="flex items-start gap-6 text-xs">
                              <div><p className="text-[10px] font-bold text-gray-400 uppercase">Entry ID</p><p className="font-mono font-bold text-gray-700">{e.id}</p></div>
                              <div><p className="text-[10px] font-bold text-gray-400 uppercase">IP Address</p><p className="font-mono text-gray-700">{e.ip}</p></div>
                              <div className="flex-1"><p className="text-[10px] font-bold text-gray-400 uppercase">Full Description</p><p className="text-gray-700 leading-relaxed">{e.description}</p></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No audit entries found</td></tr>}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
