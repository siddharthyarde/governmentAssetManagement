"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Search, CheckCircle2, XCircle, Clock, Eye,
  Mail, Phone, MapPin, FileText, Download, X,
  LayoutDashboard, Users, Calendar, AlertTriangle, BadgeCheck,
  ChevronLeft, ShieldAlert, Shield, GraduationCap, Landmark,
  Stethoscope, BookOpen, Siren,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { InstitutionRow } from "@gams/lib/supabase/database.types";
import { approveInstitution, rejectInstitution, requestInfoInstitution } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type InstitutionStatus = "pending" | "approved" | "info_required" | "suspended";
type InstitutionType   = "Central University" | "State Library" | "Central Hospital" | "Police HQ" | "District Court" | "Municipal Body" | "Defence Unit";

interface Institution {
  id: string;
  name: string;
  ministry: string;
  type: InstitutionType;
  state: string;
  district: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  registeredAt: string;
  status: InstitutionStatus;
  docs: number;
  assetsRequested: number;
  budgetAllotted: string;
  notes?: string;
}

// ─── DB → UI Mapper ─────────────────────────────────────────────────────────

function mapInstitutionRow(row: InstitutionRow): Institution {
  const statusMap: Record<string, InstitutionStatus> = {
    pending_review: "pending",
    documents_requested: "info_required",
    approved: "approved",
    suspended: "suspended",
  };
  const addr = (row.registered_address as Record<string, string>) ?? {};
  const docs = row.documents as Record<string, unknown> ?? {};
  return {
    id: row.institution_code,
    name: row.name,
    ministry: addr.ministry ?? "—",
    type: "Central University" as InstitutionType,
    state: addr.state ?? "—",
    district: addr.district ?? addr.city ?? "—",
    contactPerson: row.nodal_officer ?? row.head_of_organisation ?? "—",
    designation: "—",
    email: row.contact_email,
    phone: row.contact_mobile,
    registeredAt: row.created_at.split("T")[0],
    status: (statusMap[row.status] as InstitutionStatus) ?? "pending",
    docs: Object.values(docs).filter(Boolean).length,
    assetsRequested: 0,
    budgetAllotted: "—",
    notes: row.review_notes ?? undefined,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadInstitutionDocs(inst: Institution) {
  const docTypes = [
    "Official Authorisation Letter", "Institution Registration Certificate",
    "Ministry / Department Approval", "Government ID of Contact Person",
    "Budget Sanction Letter", "Audit Report (Last FY)",
  ].slice(0, inst.docs);
  const rows: string[][] = [
    ["GAMS — Institution Document Manifest"],
    ["Institution ID", inst.id],
    ["Institution Name", inst.name],
    ["Ministry", inst.ministry],
    ["Type", inst.type],
    ["State", inst.state],
    ["Status", inst.status],
    [""],
    ["#", "Document Name", "Status"],
    ...docTypes.map((d, i) => [String(i + 1), d, "Uploaded"]),
    [""],
    ["Generated", new Date().toLocaleString("en-IN")],
  ];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Docs-${inst.id}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

const STATUS_META: Record<InstitutionStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending:      { label: "Pending",       icon: <Clock size={11} />,        cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  approved:     { label: "Approved",      icon: <CheckCircle2 size={11} />, cls: "bg-green-50 text-green-700 border-green-200"   },
  info_required:{ label: "Info Needed",   icon: <AlertTriangle size={11} />,cls: "bg-orange-50 text-orange-700 border-orange-200" },
  suspended:    { label: "Suspended",     icon: <ShieldAlert size={11} />,  cls: "bg-red-50 text-red-700 border-red-200"         },
};

const TYPE_META: Record<InstitutionType, { icon: React.ReactNode; color: string }> = {
  "Central University": { icon: <GraduationCap size={14} />, color: "bg-blue-50 text-blue-700"    },
  "State Library":      { icon: <BookOpen size={14} />,      color: "bg-purple-50 text-purple-700" },
  "Central Hospital":   { icon: <Stethoscope size={14} />,   color: "bg-rose-50 text-rose-700"     },
  "Police HQ":          { icon: <Shield size={14} />,         color: "bg-slate-50 text-slate-700"   },
  "District Court":     { icon: <Landmark size={14} />,       color: "bg-indigo-50 text-indigo-700" },
  "Municipal Body":     { icon: <Building2 size={14} />,      color: "bg-teal-50 text-teal-700"     },
  "Defence Unit":       { icon: <Siren size={14} />,          color: "bg-green-50 text-green-800"   },
};

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function InstitutionDetailPanel({
  inst, onClose, onApprove, onRequestInfo, onSuspend,
}: {
  inst: Institution;
  onClose: () => void;
  onApprove:     (id: string) => void;
  onRequestInfo: (id: string, note: string) => void;
  onSuspend:     (id: string) => void;
}) {
  const [infoNote, setInfoNote]   = useState("");
  const [infoMode, setInfoMode]   = useState(false);
  const sm  = STATUS_META[inst.status];
  const tm  = TYPE_META[inst.type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:w-[420px] h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-2xl sm:rounded-l-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-gray-400">{inst.id}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>{sm.icon} {sm.label}</span>
            </div>
            <p className="text-sm font-black text-gray-900 mt-0.5 leading-snug">{inst.name}</p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg mt-1 ${tm.color}`}>{tm.icon} {inst.type}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface ml-2 shrink-0"><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Assets Req.",  value: inst.assetsRequested },
              { label: "Budget",       value: inst.budgetAllotted },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
                <p className="text-base font-black text-gray-900">{value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Ministry & Location */}
          <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2.5 text-sm">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Institution Details</h3>
            {[
              { icon: Landmark,  label: "Ministry",  value: inst.ministry                          },
              { icon: MapPin,    label: "Location",  value: `${inst.district}, ${inst.state}`      },
              { icon: FileText,  label: "Docs",      value: `${inst.docs} document(s) uploaded`   },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon size={13} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-bold">{label}  </span>
                  <span className="text-xs font-semibold text-gray-800">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2 text-sm">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Contact Person</h3>
            <p className="text-sm font-bold text-gray-900">{inst.contactPerson}</p>
            <p className="text-xs text-gray-500">{inst.designation}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={12} className="text-gray-400" /> {inst.email}</div>
            <div className="flex items-center gap-2 text-xs text-gray-600"><Phone size={12} className="text-gray-400" /> +91 {inst.phone}</div>
          </div>

          {/* Documents */}
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{inst.docs} document{inst.docs !== 1 ? "s" : ""} uploaded</span>
            </div>
            <button onClick={() => downloadInstitutionDocs(inst)} className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700">
              <Download size={12} /> Download All
            </button>
          </div>

          {/* Notes */}
          {inst.notes && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2">
              <AlertTriangle size={13} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700 font-medium">{inst.notes}</p>
            </div>
          )}

          {/* Info Request Input */}
          {infoMode && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Information Required *</label>
              <textarea
                rows={3}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400"
                placeholder="Specify what information or documents are needed…"
                value={infoNote}
                onChange={(e) => setInfoNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border shrink-0 flex flex-col gap-2">
          {inst.status === "pending" && !infoMode && (
            <div className="flex gap-2">
              <button
                onClick={() => { onApprove(inst.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button
                onClick={() => setInfoMode(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-sm font-bold hover:bg-orange-100"
              >
                <AlertTriangle size={14} /> Request Info
              </button>
            </div>
          )}
          {inst.status === "pending" && infoMode && (
            <div className="flex gap-2">
              <button
                onClick={() => { if (infoNote.trim()) { onRequestInfo(inst.id, infoNote); onClose(); } }}
                disabled={!infoNote.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertTriangle size={14} /> Send Request
              </button>
              <button onClick={() => setInfoMode(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
                Cancel
              </button>
            </div>
          )}
          {inst.status === "approved" && (
            <button
              onClick={() => { onSuspend(inst.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-bold hover:bg-red-100"
            >
              <ShieldAlert size={14} /> Suspend Institution
            </button>
          )}
          {inst.status === "suspended" && (
            <button
              onClick={() => { onApprove(inst.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold hover:bg-green-100"
            >
              <CheckCircle2 size={14} /> Reinstate Institution
            </button>
          )}
          {inst.status === "info_required" && (
            <button
              onClick={() => { onApprove(inst.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold hover:bg-green-100"
            >
              <CheckCircle2 size={14} /> Mark as Approved
            </button>
          )}
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusF, setStatusF]           = useState<InstitutionStatus | "All">("All");
  const [typeF, setTypeF]               = useState<InstitutionType   | "All">("All");
  const [selected, setSelected]         = useState<Institution | null>(null);

  useEffect(() => {
    createClient()
      .from("institutions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setInstitutions(!error && data ? (data as InstitutionRow[]).map(mapInstitutionRow) : []);
        setLoading(false);
      });
  }, []);

  const filtered = institutions.filter((i) => {
    const q = search.toLowerCase();
    const matchQ = !q || i.name.toLowerCase().includes(q) || i.ministry.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.contactPerson.toLowerCase().includes(q);
    const matchS = statusF === "All" || i.status === statusF;
    const matchT = typeF   === "All" || i.type   === typeF;
    return matchQ && matchS && matchT;
  });

  async function approve(id: string) {
    setInstitutions((p) => p.map((i) => i.id === id ? { ...i, status: "approved" } : i));
    await approveInstitution(id);
  }
  async function requestInfo(id: string, note: string) {
    setInstitutions((p) => p.map((i) => i.id === id ? { ...i, status: "info_required", notes: note } : i));
    await requestInfoInstitution(id, note);
  }
  async function suspend(id: string) {
    setInstitutions((p) => p.map((i) => i.id === id ? { ...i, status: "suspended" } : i));
    await rejectInstitution(id, "Suspended by administrator");
  }

  function exportCSV() {
    const headers = ["ID", "Name", "Ministry", "Type", "State", "District", "Contact Person", "Designation", "Email", "Phone", "Status", "Docs", "Assets Requested", "Budget Allotted", "Registered At"];
    const rows = filtered.map((i) => [
      i.id, i.name, i.ministry, i.type, i.state, i.district,
      i.contactPerson, i.designation, i.email, i.phone,
      i.status, i.docs, i.assetsRequested, i.budgetAllotted, i.registeredAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GAMS-Institutions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const counts = {
    total:     institutions.length,
    pending:   institutions.filter((i) => i.status === "pending").length,
    approved:  institutions.filter((i) => i.status === "approved").length,
    infoNeeded:institutions.filter((i) => i.status === "info_required").length,
  };

  const INSTITUTION_TYPES: InstitutionType[] = ["Central University","State Library","Central Hospital","Police HQ","District Court","Municipal Body","Defence Unit"];

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {[
            { href: "/",          icon: LayoutDashboard, label: "Dashboard"    },
            { href: "/approvals", icon: CheckCircle2,    label: "Approvals"    },
            { href: "/events",    icon: Calendar,        label: "Events"       },
            { href: "/analytics", icon: FileText,        label: "Analytics"    },
            { href: "/users",     icon: Users,           label: "Users & Roles"},
            { href: "/companies", icon: Building2,       label: "Companies"    },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
              <Icon size={15} /> {label}
            </Link>
          ))}
          <Link href="/institutions" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-700">
            <Shield size={15} /> Institutions
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/" className="p-2 rounded-lg border border-border hover:bg-surface md:hidden">
            <ChevronLeft size={16} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Institutions</h1>
            <p className="text-xs text-gray-400">{counts.total} registered · {counts.pending} pending review</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-sm">
            <Download size={14} /> Export CSV
          </button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6">

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total",       value: counts.total,      cls: "text-gray-900"   },
              { label: "Pending",     value: counts.pending,    cls: "text-yellow-600" },
              { label: "Approved",    value: counts.approved,   cls: "text-green-600"  },
              { label: "Info Needed", value: counts.infoNeeded, cls: "text-orange-600" },
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
                className="w-full border border-border rounded-xl pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
                placeholder="Search by name, ministry or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
              value={statusF}
              onChange={(e) => setStatusF(e.target.value as InstitutionStatus | "All")}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="info_required">Info Needed</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-white"
              value={typeF}
              onChange={(e) => setTypeF(e.target.value as InstitutionType | "All")}
            >
              <option value="All">All Types</option>
              {INSTITUTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[2.5fr_1.5fr_1fr_0.8fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-surface text-[10px] font-black text-gray-500 uppercase tracking-wider">
              <span>Institution</span>
              <span>Ministry</span>
              <span>Type</span>
              <span>Assets Req.</span>
              <span>Status</span>
              <span />
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">No institutions match your filters.</div>
            )}

            <div className="divide-y divide-border">
              {filtered.map((inst) => {
                const sm = STATUS_META[inst.status];
                const tm = TYPE_META[inst.type];
                return (
                  <div
                    key={inst.id}
                    className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr_1fr_0.8fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-surface/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(inst)}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                        {tm.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{inst.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin size={9} /> {inst.district}, {inst.state}
                        </div>
                      </div>
                    </div>

                    {/* Ministry */}
                    <div className="hidden md:flex items-center">
                      <p className="text-xs text-gray-600 leading-tight line-clamp-2">{inst.ministry}</p>
                    </div>

                    {/* Type */}
                    <div className="hidden md:flex items-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg leading-snug ${tm.color}`}>{inst.type}</span>
                    </div>

                    {/* Assets */}
                    <div className="hidden md:flex items-center">
                      <span className="text-sm font-bold text-gray-800">{inst.assetsRequested}</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>
                        {sm.icon} {sm.label}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(inst); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-surface hover:text-gray-700"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Detail panel */}
      {selected && (
        <InstitutionDetailPanel
          inst={selected}
          onClose={() => setSelected(null)}
          onApprove={(id) => { approve(id); setSelected((p) => p && p.id === id ? { ...p, status: "approved" } : p); }}
          onRequestInfo={(id, note) => { requestInfo(id, note); setSelected(null); }}
          onSuspend={(id) => { suspend(id); setSelected((p) => p && p.id === id ? { ...p, status: "suspended" } : p); }}
        />
      )}
    </div>
  );
}
