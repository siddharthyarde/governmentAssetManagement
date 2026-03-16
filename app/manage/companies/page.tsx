"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Search, Filter, CheckCircle2, XCircle, Clock, Eye,
  Mail, Phone, MapPin, FileText, Download, ExternalLink, X,
  LayoutDashboard, Users, Calendar, AlertTriangle, BadgeCheck,
  ChevronLeft, RefreshCw, ShieldAlert, Package, Shield,
  IndianRupee, Star, TrendingUp,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { CompanyRow } from "@gams/lib/supabase/database.types";
import { approveCompany as approveCompanyAction, rejectCompany as rejectCompanyAction, suspendCompany as suspendCompanyAction, reinstateCompany as reinstateCompanyAction } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type CompanyStatus = "pending" | "approved" | "suspended" | "rejected";
type CompanyType   = "Manufacturer" | "Trader" | "Importer" | "Service Provider";

interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  type: CompanyType;
  state: string;
  district: string;
  contact: string;
  email: string;
  phone: string;
  registeredAt: string;
  status: CompanyStatus;
  docs: number;
  productsListed: number;
  ordersCompleted: number;
  rating: number;
  msmeReg: string;
  turnover: string;
  notes?: string;
}

// ─── DB → UI Mapper ─────────────────────────────────────────────────────────

function mapCompanyRow(row: CompanyRow): Company {
  const statusMap: Record<string, CompanyStatus> = {
    pending_review: "pending",
    documents_requested: "pending",
    approved: "approved",
    suspended: "suspended",
    blacklisted: "rejected",
  };
  const addr = (row.registered_address as Record<string, string>) ?? {};
  const docs = row.documents as Record<string, unknown> ?? {};
  return {
    id: row.company_code,
    name: row.legal_name,
    gstin: row.gstin ?? "—",
    pan: row.pan,
    type: "Manufacturer",
    state: addr.state ?? "—",
    district: addr.district ?? addr.city ?? "—",
    contact: addr.contact_name ?? row.contact_email,
    email: row.contact_email,
    phone: row.contact_mobile,
    registeredAt: row.created_at.split("T")[0],
    status: (statusMap[row.status] as CompanyStatus) ?? "pending",
    docs: Object.values(docs).filter(Boolean).length,
    productsListed: 0,
    ordersCompleted: 0,
    rating: 0,
    msmeReg: row.msme_number ?? row.cin ?? "—",
    turnover: "—",
    notes: row.review_notes ?? undefined,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadCompanyDocs(company: Company) {
  const docTypes = [
    "GSTIN Certificate", "PAN Card Copy", "MSME / Udyam Certificate",
    "Cancelled Cheque / Bank Details", "Director / Proprietor ID Proof",
    "GST Returns (Last 2 Years)", "Audited Balance Sheet",
  ].slice(0, company.docs);
  const rows: string[][] = [
    ["GAMS — Company Document Manifest"],
    ["Company ID", company.id],
    ["Company Name", company.name],
    ["GSTIN", company.gstin],
    ["PAN", company.pan],
    ["Type", company.type],
    ["State", company.state],
    ["Status", company.status],
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
  link.download = `Docs-${company.id}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

const STATUS_META: Record<CompanyStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   icon: <Clock size={11} />,        cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  approved:  { label: "Approved",  icon: <CheckCircle2 size={11} />, cls: "bg-green-50 text-green-700 border-green-200"   },
  rejected:  { label: "Rejected",  icon: <XCircle size={11} />,      cls: "bg-red-50 text-red-700 border-red-200"         },
  suspended: { label: "Suspended", icon: <ShieldAlert size={11} />,  cls: "bg-orange-50 text-orange-700 border-orange-200" },
};

const TYPE_COLORS: Record<CompanyType, string> = {
  "Manufacturer":    "bg-blue-50 text-blue-700",
  "Trader":          "bg-purple-50 text-purple-700",
  "Importer":        "bg-indigo-50 text-indigo-700",
  "Service Provider":"bg-pink-50 text-pink-700",
};

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function CompanyDetailPanel({
  company, onClose, onApprove, onReject, onSuspend,
}: {
  company: Company;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject:  (id: string, note: string) => void;
  onSuspend: (id: string) => void;
}) {
  const [rejectNote, setRejectNote] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const sm = STATUS_META[company.status];

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
              <span className="text-[10px] font-bold text-gray-400">{company.id}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>{sm.icon} {sm.label}</span>
            </div>
            <p className="text-sm font-black text-gray-900 mt-0.5 leading-snug">{company.name}</p>
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg mt-1 ${TYPE_COLORS[company.type]}`}>{company.type}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface ml-2 shrink-0"><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Products",  value: company.productsListed },
              { label: "Orders",    value: company.ordersCompleted },
              { label: "Rating",    value: company.rating > 0 ? `${company.rating}★` : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-black text-gray-900">{value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2.5 text-sm">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Company Details</h3>
            {[
              { icon: FileText, label: "GSTIN",    value: company.gstin    },
              { icon: Shield,   label: "PAN",       value: company.pan      },
              { icon: BadgeCheck, label: "MSME",   value: company.msmeReg  },
              { icon: IndianRupee, label: "Turnover", value: company.turnover },
              { icon: MapPin,   label: "Location",  value: `${company.district}, ${company.state}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon size={13} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 font-bold">{label}  </span>
                  <span className="text-xs font-semibold text-gray-800 break-all">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2 text-sm">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Contact Person</h3>
            <p className="text-sm font-bold text-gray-900">{company.contact}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={12} className="text-gray-400" /> {company.email}</div>
            <div className="flex items-center gap-2 text-xs text-gray-600"><Phone size={12} className="text-gray-400" /> +91 {company.phone}</div>
          </div>

          {/* Documents */}
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{company.docs} document{company.docs !== 1 ? "s" : ""} uploaded</span>
            </div>
            <button onClick={() => downloadCompanyDocs(company)} className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:text-saffron-700">
              <Download size={12} /> Download All
            </button>
          </div>

          {/* Admin Notes */}
          {company.notes && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2">
              <AlertTriangle size={13} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700 font-medium">{company.notes}</p>
            </div>
          )}

          {/* Reject note input */}
          {rejectMode && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Rejection Reason *</label>
              <textarea
                rows={3}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-red-400"
                placeholder="Explain why this company is being rejected…"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="px-5 py-4 border-t border-border shrink-0 flex flex-col gap-2">
          {company.status === "pending" && !rejectMode && (
            <div className="flex gap-2">
              <button
                onClick={() => { onApprove(company.id); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button
                onClick={() => setRejectMode(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-bold hover:bg-red-100"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          )}
          {company.status === "pending" && rejectMode && (
            <div className="flex gap-2">
              <button
                onClick={() => { if (rejectNote.trim()) { onReject(company.id, rejectNote); onClose(); } }}
                disabled={!rejectNote.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={14} /> Confirm Rejection
              </button>
              <button onClick={() => setRejectMode(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
                Cancel
              </button>
            </div>
          )}
          {company.status === "approved" && (
            <button
              onClick={() => { onSuspend(company.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-sm font-bold hover:bg-orange-100"
            >
              <ShieldAlert size={14} /> Suspend Company
            </button>
          )}
          {company.status === "suspended" && (
            <button
              onClick={() => { onApprove(company.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold hover:bg-green-100"
            >
              <CheckCircle2 size={14} /> Reinstate Company
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

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState<CompanyStatus | "All">("All");
  const [typeF, setTypeF]         = useState<CompanyType | "All">("All");
  const [selected, setSelected]   = useState<Company | null>(null);

  useEffect(() => {
    createClient()
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setCompanies(!error && data ? (data as CompanyRow[]).map(mapCompanyRow) : []);
        setLoading(false);
      });
  }, []);

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.gstin.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q);
    const matchS = statusF === "All" || c.status === statusF;
    const matchT = typeF   === "All" || c.type   === typeF;
    return matchQ && matchS && matchT;
  });

  async function approve(id: string) {
    setCompanies((p) => p.map((c) => c.id === id ? { ...c, status: "approved" } : c));
    try { await approveCompanyAction(id); } catch (e) { console.error("approve failed", e); }
  }
  async function reject(id: string, note: string) {
    setCompanies((p) => p.map((c) => c.id === id ? { ...c, status: "rejected", notes: note } : c));
    try { await rejectCompanyAction(id, note); } catch (e) { console.error("reject failed", e); }
  }
  async function suspend(id: string) {
    setCompanies((p) => p.map((c) => c.id === id ? { ...c, status: "suspended" } : c));
    try { await suspendCompanyAction(id); } catch (e) { console.error("suspend failed", e); }
  }
  async function reinstate(id: string) {
    setCompanies((p) => p.map((c) => c.id === id ? { ...c, status: "approved" } : c));
    try { await reinstateCompanyAction(id); } catch (e) { console.error("reinstate failed", e); }
  }

  function exportCSV() {
    const headers = ["ID", "Name", "GSTIN", "PAN", "Type", "State", "District", "Contact", "Email", "Phone", "Status", "Docs", "Products Listed", "Orders Completed", "Rating", "Turnover", "Registered At"];
    const rows = filtered.map((c) => [
      c.id, c.name, c.gstin, c.pan, c.type, c.state, c.district,
      c.contact, c.email, c.phone, c.status, c.docs,
      c.productsListed, c.ordersCompleted, c.rating, c.turnover, c.registeredAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GAMS-Companies-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const counts = {
    total:     companies.length,
    pending:   companies.filter((c) => c.status === "pending").length,
    approved:  companies.filter((c) => c.status === "approved").length,
    suspended: companies.filter((c) => c.status === "suspended").length,
    rejected:  companies.filter((c) => c.status === "rejected").length,
  };

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
            { href: "/manage",            icon: LayoutDashboard, label: "Dashboard"   },
            { href: "/manage/approvals",   icon: CheckCircle2,    label: "Approvals"   },
            { href: "/manage/events",      icon: Calendar,        label: "Events"      },
            { href: "/manage/analytics",   icon: FileText,        label: "Analytics"   },
            { href: "/manage/users",       icon: Users,           label: "Users & Roles" },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
              <Icon size={15} /> {label}
            </Link>
          ))}
          <Link href="/manage/companies" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-saffron-50 text-saffron-700">
            <Building2 size={15} /> Companies
          </Link>
          <Link href="/manage/institutions" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-surface">
            <Shield size={15} /> Institutions
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/manage" className="p-2 rounded-lg border border-border hover:bg-surface md:hidden">
            <ChevronLeft size={16} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Companies</h1>
            <p className="text-xs text-gray-400">{counts.total} registered · {counts.pending} pending review</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-sm">
            <Download size={14} /> Export CSV
          </button>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6">

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total",     value: counts.total,     cls: "text-gray-900"    },
              { label: "Pending",   value: counts.pending,   cls: "text-yellow-600"  },
              { label: "Approved",  value: counts.approved,  cls: "text-green-600"   },
              { label: "Suspended", value: counts.suspended, cls: "text-orange-600"  },
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
                placeholder="Search by name, GSTIN or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 bg-white"
              value={statusF}
              onChange={(e) => setStatusF(e.target.value as CompanyStatus | "All")}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-400 bg-white"
              value={typeF}
              onChange={(e) => setTypeF(e.target.value as CompanyType | "All")}
            >
              <option value="All">All Types</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Trader">Trader</option>
              <option value="Importer">Importer</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-surface text-[10px] font-black text-gray-500 uppercase tracking-wider">
              <span>Company</span>
              <span>GSTIN / Location</span>
              <span>Type</span>
              <span>Products</span>
              <span>Status</span>
              <span />
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-gray-400">No companies match your filters.</div>
            )}

            <div className="divide-y divide-border">
              {filtered.map((co) => {
                const sm = STATUS_META[co.status];
                return (
                  <div
                    key={co.id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-surface/50 transition-colors cursor-pointer"
                    onClick={() => setSelected(co)}
                  >
                    {/* Company name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
                        <Building2 size={16} className="text-saffron-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{co.name}</p>
                        <p className="text-[10px] text-gray-400">{co.id}</p>
                      </div>
                    </div>

                    {/* GSTIN / Location */}
                    <div className="hidden md:flex flex-col justify-center gap-0.5">
                      <p className="text-xs font-mono text-gray-700">{co.gstin}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin size={9} /> {co.district}, {co.state}
                      </div>
                    </div>

                    {/* Type */}
                    <div className="hidden md:flex items-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${TYPE_COLORS[co.type]}`}>{co.type}</span>
                    </div>

                    {/* Products */}
                    <div className="hidden md:flex items-center">
                      <span className="text-sm font-bold text-gray-800">{co.productsListed}</span>
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
                        onClick={(e) => { e.stopPropagation(); setSelected(co); }}
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
        <CompanyDetailPanel
          company={selected}
          onClose={() => setSelected(null)}
          onApprove={(id) => { approve(id); setSelected((p) => p && p.id === id ? { ...p, status: "approved" } : p); }}
          onReject={(id, note) => { reject(id, note); setSelected(null); }}
          onSuspend={(id) => { suspend(id); setSelected((p) => p && p.id === id ? { ...p, status: "suspended" } : p); }}
        />
      )}
    </div>
  );
}
