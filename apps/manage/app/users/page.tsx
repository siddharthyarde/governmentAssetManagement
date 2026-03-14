"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Plus, Search, Filter, MoreVertical, Shield, Eye, Edit2,
  CheckCircle2, Clock, XCircle, Mail, Phone, Trash2, X, Lock,
  UserCheck, AlertTriangle, Menu, Bell, Settings, Scan,
  LayoutDashboard, Package, Calendar, Building2, QrCode,
  Star, FileText, ClipboardList, Warehouse, ChevronLeft,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import { inviteStaffUser } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "Super Admin" | "Admin" | "Inspector" | "Volunteer" | "Viewer";
type Status = "active" | "suspended" | "pending";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  lastLogin: string;
  eventsHandled: number;
  joinedDate: string;
  avatar: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  "Super Admin": { bg: "bg-purple-100", text: "text-purple-700" },
  "Admin":       { bg: "bg-saffron-50", text: "text-saffron-700" },
  "Inspector":   { bg: "bg-blue-50",    text: "text-blue-700"    },
  "Volunteer":   { bg: "bg-green-50",   text: "text-green-700"   },
  "Viewer":      { bg: "bg-gray-100",   text: "text-gray-600"    },
};

const STATUS_META: Record<Status, { icon: React.ReactNode; label: string; cls: string }> = {
  active:    { icon: <CheckCircle2 size={12} />, label: "Active",    cls: "bg-green-50 text-green-700 border-green-200"   },
  suspended: { icon: <XCircle      size={12} />, label: "Suspended", cls: "bg-red-50 text-red-700 border-red-200"         },
  pending:   { icon: <Clock        size={12} />, label: "Pending",   cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (u: Omit<StaffUser, "id" | "lastLogin" | "eventsHandled" | "joinedDate" | "avatar">) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Viewer" as Role });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError("Please enter a valid email address."); return; }
    onInvite({ ...form, status: "pending" });
    onClose();
  }

  const inputCls = "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-black text-gray-900">Invite Team Member</h2>
            <p className="text-xs text-gray-400">An invitation email will be sent to the address below.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name *</label>
            <input className={inputCls} placeholder="e.g. Ramesh Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Official Email *</label>
            <input type="email" className={inputCls} placeholder="name@gams.gov.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Phone</label>
            <input type="tel" className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Role *</label>
            <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {(["Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose} className="text-sm font-bold text-gray-600 px-4 py-2 rounded-xl border border-border hover:bg-surface">Cancel</button>
            <button type="submit" className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600">
              <Mail size={13} /> Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ user, onClose, onToggleStatus, onChangeRole }: {
  user: StaffUser;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onChangeRole: (id: string, role: Role) => void;
}) {
  const rc = ROLE_COLORS[user.role];
  const sm = STATUS_META[user.status];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron-100 text-saffron-700 font-black text-sm flex items-center justify-center">{user.avatar}</div>
            <div>
              <p className="text-sm font-black text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400">{user.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface"><X size={16} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface border border-border rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Status</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>{sm.icon} {sm.label}</span>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Events</p>
              <p className="text-sm font-black text-gray-900">{user.eventsHandled}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { icon: Mail,  label: user.email      },
              { icon: Phone, label: user.phone || "—" },
              { icon: Clock, label: `Last login: ${user.lastLogin}` },
              { icon: Users, label: `Joined: ${user.joinedDate}`    },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-700">
                <Icon size={14} className="text-gray-400 shrink-0" /> {label}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Role</label>
            <select
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 bg-white"
              value={user.role}
              onChange={(e) => onChangeRole(user.id, e.target.value as Role)}
              disabled={user.role === "Super Admin"}
            >
              {(["Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            {user.status !== "pending" && user.role !== "Super Admin" && (
              <button
                onClick={() => onToggleStatus(user.id)}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border ${user.status === "active" ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"}`}
              >
                {user.status === "active" ? <><Lock size={13} /> Suspend</> : <><UserCheck size={13} /> Reinstate</>}
              </button>
            )}
            {user.status === "pending" && (
              <button
                onClick={() => onToggleStatus(user.id)}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
              >
                <CheckCircle2 size={13} /> Activate
              </button>
            )}
            <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers]           = useState<StaffUser[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatus]   = useState<Status | "All">("All");
  const [showInvite, setShowInvite] = useState(false);
  const [selected, setSelected]     = useState<StaffUser | null>(null);

  useEffect(() => {
    const db = createClient();
    db.from("user_profiles")
      .select("id, full_name, email, mobile, role, is_active, created_at")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        const ROLE_MAP: Record<string, Role> = {
          super_admin: "Super Admin",
          gov_admin: "Admin",
          event_manager: "Admin",
          inspector: "Inspector",
          volunteer: "Volunteer",
          warehouse_officer: "Viewer",
          auditor: "Viewer",
        };
        setUsers(
          (data ?? []).map((u, i) => {
            const initials = u.full_name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
            return {
              id: `U${String(i + 1).padStart(3, "0")}`,
              name: u.full_name,
              email: u.email,
              phone: u.mobile ?? "—",
              role: (ROLE_MAP[u.role] ?? "Viewer") as Role,
              status: (u.is_active ? "active" : "suspended") as Status,
              lastLogin: "—",
              eventsHandled: 0,
              joinedDate: new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
              avatar: initials,
            };
          })
        );
        setLoading(false);
      });
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchR = roleFilter === "All" || u.role === roleFilter;
    const matchS = statusFilter === "All" || u.status === statusFilter;
    return matchQ && matchR && matchS;
  });

  async function handleInvite(data: Omit<StaffUser, "id" | "lastLogin" | "eventsHandled" | "joinedDate" | "avatar">) {
    await inviteStaffUser(data.email, data.name, data.role);
    const initials = data.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const newUser: StaffUser = {
      ...data,
      id: `U${String(users.length + 1).padStart(3, "0")}`,
      lastLogin: "Never",
      eventsHandled: 0,
      joinedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      avatar: initials,
    };
    setUsers((prev) => [...prev, newUser]);
  }

  function toggleStatus(id: string) {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u;
      const next: Status = u.status === "active" ? "suspended" : "active";
      return { ...u, status: next };
    }));
    setSelected((prev) => {
      if (!prev || prev.id !== id) return prev;
      const next: Status = prev.status === "active" ? "suspended" : "active";
      return { ...prev, status: next };
    });
  }

  function changeRole(id: string, role: Role) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
    setSelected((prev) => prev && prev.id === id ? { ...prev, role } : prev);
  }

  const counts = {
    total:     users.length,
    active:    users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending:   users.filter((u) => u.status === "pending").length,
  };

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Simplified sidebar back button for sub-pages */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link href="/approvals" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
            <CheckCircle2 size={15} /> Approvals
          </Link>
          <Link href="/events" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
            <Calendar size={15} /> Events
          </Link>
          <Link href="/analytics" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
            <FileText size={15} /> Analytics
          </Link>
          <Link href="/users" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-saffron-50 text-saffron-700">
            <Users size={15} /> Users & Roles
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/" className="p-2 rounded-lg border border-border hover:bg-surface md:hidden">
            <ChevronLeft size={16} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Users &amp; Roles</h1>
            <p className="text-xs text-gray-400">{counts.total} team members · {counts.active} active</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-sm"
          >
            <Plus size={14} /> Invite User
          </button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6">

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total",     value: counts.total,     cls: "text-gray-900"   },
              { label: "Active",    value: counts.active,    cls: "text-green-600"  },
              { label: "Suspended", value: counts.suspended, cls: "text-red-600"    },
              { label: "Pending",   value: counts.pending,   cls: "text-yellow-600" },
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-white border border-border rounded-2xl p-4 text-center">
                <p className={`text-2xl font-black ${cls}`}>{value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white border border-border rounded-2xl p-4 mb-5 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border border-border rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-saffron-400 bg-white"
                placeholder="Search by name, email or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "All")}
            >
              <option value="All">All Roles</option>
              {(["Super Admin", "Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 bg-white"
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value as Status | "All")}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-surface text-[10px] font-black text-gray-500 uppercase tracking-wider">
              <span>Name</span>
              <span>Contact</span>
              <span>Role</span>
              <span>Status</span>
              <span>Last Login</span>
              <span />
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">
                No users match your search filters.
              </div>
            )}

            <div className="divide-y divide-border">
              {filtered.map((user) => {
                const rc = ROLE_COLORS[user.role];
                const sm = STATUS_META[user.status];
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-surface/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(user)}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-saffron-100 text-saffron-700 font-black text-xs flex items-center justify-center shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.id}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-0.5 justify-center">
                      <p className="text-xs text-gray-700">{user.email}</p>
                      <p className="text-[10px] text-gray-400">{user.phone || "—"}</p>
                    </div>

                    {/* Role */}
                    <div className="flex items-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${rc.bg} ${rc.text}`}>
                        <Shield size={9} /> {user.role}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>
                        {sm.icon} {sm.label}
                      </span>
                    </div>

                    {/* Last Login */}
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">{user.lastLogin}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={() => setSelected(user)}
                        aria-label="View details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role legend */}
          <div className="mt-5 bg-white border border-border rounded-2xl p-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Role Permissions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {([
                { role: "Super Admin" as Role, perms: "Full system access, user management, system settings" },
                { role: "Admin" as Role,       perms: "Manage events, assets, companies and institutions"    },
                { role: "Inspector" as Role,   perms: "Inspect and rate assets, enter defect reports"        },
                { role: "Volunteer" as Role,   perms: "Assist at events, scan QR codes"                     },
                { role: "Viewer" as Role,      perms: "Read-only access to dashboard and reports"            },
              ]).map(({ role, perms }) => {
                const rc = ROLE_COLORS[role];
                return (
                  <div key={role} className={`rounded-xl p-3 ${rc.bg}`}>
                    <p className={`text-[11px] font-black mb-1 ${rc.text}`}>{role}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{perms}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
      {selected && (
        <DetailPanel
          user={selected}
          onClose={() => setSelected(null)}
          onToggleStatus={toggleStatus}
          onChangeRole={changeRole}
        />
      )}
    </div>
  );
}
