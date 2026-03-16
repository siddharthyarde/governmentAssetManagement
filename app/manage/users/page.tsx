"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Plus, Search, Shield, Eye,
  CheckCircle2, Clock, XCircle, Mail, Phone, X, Lock,
  UserCheck, LayoutDashboard, Calendar, FileText,
  ChevronLeft, Award, Activity, UserPlus, AlertTriangle, Settings, Scan
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

const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  "Super Admin": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Admin":       { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Inspector":   { bg: "bg-blue-50",    text: "text-blue-700", border: "border-blue-200"    },
  "Volunteer":   { bg: "bg-emerald-50",   text: "text-emerald-700", border: "border-emerald-200"   },
  "Viewer":      { bg: "bg-slate-100",   text: "text-slate-600", border: "border-slate-200"    },
};

const STATUS_META: Record<Status, { icon: React.ReactNode; label: string; cls: string }> = {
  active:    { icon: <CheckCircle2 size={12} />, label: "Active",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"   },
  suspended: { icon: <XCircle      size={12} />, label: "Suspended", cls: "bg-red-50 text-red-700 border-red-200 shadow-sm"         },
  pending:   { icon: <Clock        size={12} />, label: "Pending",   cls: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm" },
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

  const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 bg-slate-50/50 hover:bg-white transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-saffron-100 text-saffron-600 rounded-xl">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Invite Team Member</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Send a secure invitation link</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-500">*</span></label>
              <input className={inputCls} placeholder="e.g. Ramesh Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Official Email <span className="text-red-500">*</span></label>
              <input type="email" className={inputCls} placeholder="name@gams.gov.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
              <input type="tel" className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assign Role <span className="text-red-500">*</span></label>
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                {(["Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 mt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="text-sm font-bold text-slate-600 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 shadow-md shadow-saffron-500/20 active:scale-[0.98] transition-all">
              <Mail size={16} /> Send Invitation
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm transition-all" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 ring-1 ring-slate-200">
        
        {/* Header Cover */}
        <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white backdrop-blur-md shadow-sm transition-colors text-slate-500 hover:text-slate-800">
            <X size={16} />
          </button>
        </div>
        
        <div className="px-6 pb-6 relative">
          {/* Avatar overlap */}
          <div className="flex justify-between items-end -mt-10 mb-4">
            <div className={`w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center text-3xl font-black border-4 border-white ${rc.bg} ${rc.text}`}>
              {user.avatar}
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${sm.cls} mb-2`}>
              {sm.icon} {sm.label}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{user.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{user.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rc.bg} ${rc.text} ${rc.border}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Calendar size={14} /> <p className="text-[10px] uppercase font-bold">Joined</p>
              </div>
              <p className="text-sm font-bold text-slate-700">{user.joinedDate}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Activity size={14} /> <p className="text-[10px] uppercase font-bold">Events</p>
              </div>
              <p className="text-sm font-bold text-slate-700">{user.eventsHandled} Handled</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 mb-6 shadow-sm">
            {[
              { icon: Mail,  label: user.email, title: "Email Address" },
              { icon: Phone, label: user.phone || "Not provided", title: "Phone Number" },
              { icon: Clock, label: user.lastLogin, title: "Last Login" },
            ].map(({ icon: Icon, label, title }) => (
              <div key={title} className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Icon size={14} className="text-saffron-500" /> {label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Change Role</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 bg-slate-50 hover:bg-white transition-all shadow-sm font-medium"
                value={user.role}
                onChange={(e) => onChangeRole(user.id, e.target.value as Role)}
                disabled={user.role === "Super Admin"}
              >
                {(["Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div className="flex gap-3">
              {user.status !== "pending" && user.role !== "Super Admin" && (
                <button
                  onClick={() => onToggleStatus(user.id)}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border shadow-sm transition-all active:scale-[0.98] ${
                    user.status === "active" 
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300" 
                      : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"
                  }`}
                >
                  {user.status === "active" ? <><Lock size={16} /> Suspend Access</> : <><UserCheck size={16} /> Reinstate Access</>}
                </button>
              )}
              {user.status === "pending" && (
                <button
                  onClick={() => onToggleStatus(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all shadow-sm active:scale-[0.98]"
                >
                  <CheckCircle2 size={16} /> Approve Access
                </button>
              )}
            </div>
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
              lastLogin: "Just now",
              eventsHandled: Math.floor(Math.random() * 20), // Placeholder data for visualization
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
    <div className="min-h-dvh bg-slate-50/50 flex text-slate-800">
      {/* Sidebar navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white font-black shadow-lg shadow-saffron-500/30">
            G
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">भारत सरकार · GOI</p>
            <p className="text-sm font-black text-slate-800 leading-tight">GAMS Manage</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          <Link href="/manage" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/manage/events" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
            <Calendar size={18} /> Events
          </Link>
          <Link href="/manage/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
            <FileText size={18} /> Analytics
          </Link>
          <div className="my-2 border-t border-slate-100 mx-3"></div>
          <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Administration</p>
          <Link href="/manage/users" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-saffron-50 text-saffron-700 shadow-sm border border-saffron-100/50">
            <Users size={18} className="text-saffron-500" /> Users & Roles
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-dvh overflow-hidden w-full relative">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0 shadow-sm z-10 sticky top-0">
          <Link href="/manage" className="p-2 -ml-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 md:hidden shadow-sm transition-all text-slate-500">
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Users &amp; Roles</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Manage platform access, roles and permissions for your team</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 shadow-md shadow-saffron-500/20 active:scale-[0.98] transition-all"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Invite User</span>
          </button>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-y-auto">

          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users",   value: counts.total,     icon: Users,      color: "blue",     cls: "text-blue-600",    bg: "bg-blue-50" },
              { label: "Active",        value: counts.active,    icon: CheckCircle2, color: "emerald", cls: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Pending",       value: counts.pending,   icon: Clock,      color: "amber",    cls: "text-amber-600",   bg: "bg-amber-50" },
              { label: "Suspended",     value: counts.suspended, icon: XCircle,    color: "red",      cls: "text-red-600",     bg: "bg-red-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                <div className="flex items-center justify-between mb-4 relative">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <div className={`p-2 rounded-xl ${stat.bg} ${stat.cls} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <p className={`text-4xl font-black relative tracking-tight ${stat.cls}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            
            <div className="flex-1 w-full min-w-0">
              
              {/* Search & Filters */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 shadow-sm relative z-0">
                <div className="relative flex-1 min-w-48 group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-saffron-500 transition-colors" />
                  <input
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 bg-slate-50/50 hover:bg-white transition-all shadow-sm font-medium placeholder:text-slate-400"
                    placeholder="Search by name, email or ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <select
                      className="border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 bg-slate-50/50 hover:bg-white transition-all shadow-sm font-bold text-slate-600 appearance-none min-w-[140px]"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as Role | "All")}
                    >
                      <option value="All">All Roles</option>
                      {(["Super Admin", "Admin", "Inspector", "Volunteer", "Viewer"] as Role[]).map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      className="border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 bg-slate-50/50 hover:bg-white transition-all shadow-sm font-bold text-slate-600 appearance-none min-w-[140px]"
                      value={statusFilter}
                      onChange={(e) => setStatus(e.target.value as Status | "All")}
                    >
                      <option value="All">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>User Details</span>
                  <span>Contact Info</span>
                  <span>Access Role</span>
                  <span>Account Status</span>
                  <span>Last Activity</span>
                  <span className="w-8"></span>
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-20 px-6">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="text-slate-300" size={24} />
                    </div>
                    <p className="text-base font-bold text-slate-700 mb-1">No users found</p>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">We couldn't find anyone matching your current search filters. Try adjusting them.</p>
                  </div>
                )}

                <div className="divide-y divide-slate-100">
                  {filtered.map((user) => {
                    const rc = ROLE_COLORS[user.role];
                    const sm = STATUS_META[user.status];
                    return (
                      <div
                        key={user.id}
                        className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-4 bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelected(user)}
                      >
                        {/* Name Cell */}
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-sm border ${rc.bg} ${rc.text} ${rc.border}`}>
                            {user.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-saffron-600 transition-colors">{user.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{user.id}</p>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col justify-center gap-1">
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-slate-400" />
                            <p className="text-xs font-medium text-slate-600">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-400" />
                            <p className="text-[10px] text-slate-500 font-medium">{user.phone || "Not provided"}</p>
                          </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${rc.bg} ${rc.text} ${rc.border}`}>
                            <Shield size={12} /> {user.role}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shadow-sm ${sm.cls}`}>
                            {sm.icon} {sm.label}
                          </span>
                        </div>

                        {/* Last Activity */}
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{user.lastLogin}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-saffron-600 hover:border-saffron-200 hover:bg-saffron-50 transition-all shadow-sm"
                            aria-label="View details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right sidebar: Role Guide */}
            <div className="w-full xl:w-72 shrink-0 space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Award size={18} className="text-saffron-500" />
                  <h3 className="text-sm font-black tracking-tight">Access Tiers</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                  The GAMS portal designates access through predefined roles ensuring secure compartmentalization of state assets.
                </p>
                
                <div className="flex flex-col gap-3">
                  {[
                    { role: "Super Admin", icon: Shield, desc: "Full root access & administration" },
                    { role: "Admin",       icon: Settings, desc: "Manage operational workflows" },
                    { role: "Inspector",   icon: Scan,   desc: "Asset grading and QC reporting" },
                    { role: "Volunteer",   icon: Users,  desc: "Event assistance and scanning" },
                    { role: "Viewer",      icon: Eye,    desc: "Read-only access & audit trails" },
                  ].map((r) => {
                    const rc = ROLE_COLORS[r.role as Role];
                    return (
                      <div key={r.role} className={`rounded-2xl p-3 border ${rc.bg} ${rc.border} transition-all hover:scale-[1.02]`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <r.icon size={14} className={rc.text} />
                          <p className={`text-xs font-black ${rc.text}`}>{r.role}</p>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500">{r.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
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
