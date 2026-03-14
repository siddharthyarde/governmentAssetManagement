"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRightLeft, Package, Search, CheckCircle2, XCircle,
  LayoutDashboard, Bell, Calendar, FileText, AlertTriangle,
  Building2, MapPin, Truck, Clock, ChevronRight,
} from "lucide-react";

type RedistStatus = "pending" | "approved" | "in_transit" | "delivered" | "rejected";

interface RedistRequest {
  id: string;
  assetId: string;
  assetName: string;
  fromLocation: string;
  toInstitution: string;
  toCity: string;
  requestedBy: string;
  requestedDate: string;
  qty: number;
  status: RedistStatus;
  approvedBy: string | null;
  approvedDate: string | null;
  expectedDelivery: string | null;
  deliveredDate: string | null;
  rejectedReason: string | null;
  priority: "normal" | "urgent";
}

const REQUESTS: RedistRequest[] = [
  { id: "RDT-001", assetId: "AST-001", assetName: "Folding Chairs — Steel Frame", fromLocation: "WH-DEL-A, Delhi", toInstitution: "AIIMS Delhi", toCity: "Delhi", requestedBy: "Dr. Ramesh Gupta", requestedDate: "2024-02-08", qty: 200, status: "delivered", approvedBy: "Suresh Kumar", approvedDate: "2024-02-09", expectedDelivery: "2024-02-12", deliveredDate: "2024-02-12", rejectedReason: null, priority: "normal" },
  { id: "RDT-002", assetId: "AST-008", assetName: "Industrial Air Coolers", fromLocation: "WH-LKO-E, Lucknow", toInstitution: "IIT Bombay", toCity: "Mumbai", requestedBy: "Prof. Sinha", requestedDate: "2024-02-10", qty: 30, status: "in_transit", approvedBy: "Meena Shah", approvedDate: "2024-02-11", expectedDelivery: "2024-02-15", deliveredDate: null, rejectedReason: null, priority: "urgent" },
  { id: "RDT-003", assetId: "AST-005", assetName: "LED Par Lights RGBW", fromLocation: "WH-BLR-C, Bangalore", toInstitution: "NDA, Pune", toCity: "Pune", requestedBy: "Brig. Kapoor", requestedDate: "2024-02-12", qty: 50, status: "approved", approvedBy: "Anil Tripathi", approvedDate: "2024-02-13", expectedDelivery: "2024-02-18", deliveredDate: null, rejectedReason: null, priority: "normal" },
  { id: "RDT-004", assetId: "AST-009", assetName: "1.5 Ton Window ACs", fromLocation: "WH-AHM-D, Ahmedabad", toInstitution: "High Court of Gujarat", toCity: "Ahmedabad", requestedBy: "Justice Sharma", requestedDate: "2024-02-14", qty: 20, status: "pending", approvedBy: null, approvedDate: null, expectedDelivery: null, deliveredDate: null, rejectedReason: null, priority: "urgent" },
  { id: "RDT-005", assetId: "AST-002", assetName: "JBL Amplifiers 2000W", fromLocation: "WH-MUM-B, Mumbai", toInstitution: "Pune University", toCity: "Pune", requestedBy: "Principal Desai", requestedDate: "2024-02-05", qty: 10, status: "rejected", approvedBy: null, approvedDate: null, expectedDelivery: null, deliveredDate: null, rejectedReason: "Asset scheduled for audit. Request can be resubmitted after March 2024.", priority: "normal" },
  { id: "RDT-006", assetId: "AST-007", assetName: "Crowd Barriers — Metal", fromLocation: "WH-DEL-A, Delhi", toInstitution: "Delhi Police HQ", toCity: "Delhi", requestedBy: "DCP Singh", requestedDate: "2024-02-15", qty: 100, status: "pending", approvedBy: null, approvedDate: null, expectedDelivery: null, deliveredDate: null, rejectedReason: null, priority: "urgent" },
];

import { createClient } from "@gams/lib/supabase/client";
import type { RedistributionRequestRow } from "@gams/lib/supabase/database.types";

function mapRedistRow(row: RedistributionRequestRow): RedistRequest {
  const statusMap: Record<string, RedistStatus> = {
    listed: "pending", reserved: "approved",
    dispatched: "in_transit", completed: "delivered", cancelled: "rejected",
  };
  return {
    id: row.id,
    assetId: row.listing_id,
    assetName: "Asset Listing",
    fromLocation: "—",
    toInstitution: row.requested_by_institution ?? "—",
    toCity: "—",
    requestedBy: row.requested_by_user ?? "—",
    requestedDate: row.created_at.split("T")[0],
    qty: row.quantity_requested,
    status: (statusMap[row.status] as RedistStatus) ?? "pending",
    approvedBy: row.approved_by ?? null,
    approvedDate: row.approved_at ? row.approved_at.split("T")[0] : null,
    expectedDelivery: null,
    deliveredDate: null,
    rejectedReason: row.rejection_reason ?? null,
    priority: "normal",
  };
}

const STATUS_META: Record<RedistStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending: { label: "Pending", cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved: { label: "Approved", cls: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  in_transit: { label: "In Transit", cls: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Delivered", cls: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700", icon: XCircle },
};

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/warehouse", icon: Building2, label: "Warehouse" },
  { href: "/redistribution", icon: ArrowRightLeft, label: "Redistribution" },
  { href: "/defects", icon: AlertTriangle, label: "Defects" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/reports", icon: FileText, label: "Reports" },
];

export default function RedistributionPage() {
  const [items, setItems] = useState<RedistRequest[]>(REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RedistStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  useEffect(() => {
    createClient()
      .from("redistribution_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setItems((data as RedistributionRequestRow[]).map(mapRedistRow));
        }
      });
  }, []);

  const filtered = items.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.assetName.toLowerCase().includes(q) || r.toInstitution.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = items.find((r) => r.id === selectedId) ?? null;
  const pendingCount = items.filter((r) => r.status === "pending").length;
  const inTransitCount = items.filter((r) => r.status === "in_transit").length;
  const deliveredCount = items.filter((r) => r.status === "delivered").length;

  function approve(id: string) {
    const today = new Date().toISOString().slice(0, 10);
    const delivery = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved", approvedBy: "Admin Officer", approvedDate: today, expectedDelivery: delivery } : r));
    createClient().from("redistribution_requests")
      .update({ status: "reserved", approved_at: new Date().toISOString() })
      .eq("id", id);
    setShowRejectBox(false);
  }

  function reject(id: string) {
    const reason = rejectNote || "Request denied by admin.";
    setItems((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected", rejectedReason: reason } : r));
    createClient().from("redistribution_requests")
      .update({ status: "cancelled", rejection_reason: reason })
      .eq("id", id);
    setRejectNote("");
    setShowRejectBox(false);
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
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/redistribution" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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

        <header className="bg-white border-b border-border px-6 py-4">
          <h1 className="text-lg font-black text-gray-900">Redistribution</h1>
          <p className="text-xs text-gray-400">Asset reallocation requests from institutions and government bodies</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending Approval", value: pendingCount, cls: "bg-yellow-50", iconCls: "text-yellow-500", Icon: Clock },
              { label: "In Transit", value: inTransitCount, cls: "bg-purple-50", iconCls: "text-purple-500", Icon: Truck },
              { label: "Delivered", value: deliveredCount, cls: "bg-green-50", iconCls: "text-green-600", Icon: CheckCircle2 },
            ].map(({ label, value, cls, iconCls, Icon }) => (
              <div key={label} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${cls} flex items-center justify-center`}><Icon size={18} className={iconCls} /></div>
                <div><p className="text-xs text-gray-400 font-semibold">{label}</p><p className="text-xl font-black text-gray-900">{value}</p></div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by asset, institution, ID…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none">
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_META) as RedistStatus[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
          </div>

          <div className="flex gap-5 min-h-0">
            <div className={`bg-white border border-border rounded-2xl overflow-auto ${selected ? "flex-1" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <th className="text-left px-4 py-3">Request</th>
                    <th className="text-left px-4 py-3">Asset</th>
                    <th className="text-left px-4 py-3">To Institution</th>
                    <th className="text-left px-4 py-3">Qty</th>
                    <th className="text-left px-4 py-3">Priority</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const StatusIcon = STATUS_META[r.status].icon;
                    return (
                      <tr key={r.id} className={`border-b border-border hover:bg-surface cursor-pointer ${selectedId === r.id ? "bg-saffron-50" : ""}`} onClick={() => setSelectedId(r.id === selectedId ? null : r.id)}>
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 font-mono">{r.id}</p>
                          <p className="text-[10px] text-gray-400">{r.requestedDate}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-800">{r.assetName}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-gray-800">{r.toInstitution}</p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin size={9} /> {r.toCity}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-gray-800">{r.qty}</td>
                        <td className="px-4 py-3">
                          {r.priority === "urgent" ? <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-100 text-red-700">Urgent</span> : <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-600">Normal</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[r.status].cls}`}>
                            <StatusIcon size={10} /> {STATUS_META[r.status].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No requests found</td></tr>}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="w-80 bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[70vh]">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-black text-gray-900">{selected.assetName}</h2>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[selected.status].cls}`}>{STATUS_META[selected.status].label}</span>
                </div>
                {[
                  { label: "Request ID", value: selected.id },
                  { label: "From", value: selected.fromLocation },
                  { label: "To Institution", value: selected.toInstitution },
                  { label: "Quantity", value: String(selected.qty) },
                  { label: "Requested By", value: selected.requestedBy },
                  { label: "Requested Date", value: selected.requestedDate },
                  { label: "Priority", value: selected.priority.toUpperCase() },
                  ...(selected.approvedBy ? [{ label: "Approved By", value: selected.approvedBy }, { label: "Approved Date", value: selected.approvedDate! }] : []),
                  ...(selected.expectedDelivery ? [{ label: "Expected Delivery", value: selected.expectedDelivery }] : []),
                  ...(selected.deliveredDate ? [{ label: "Delivered Date", value: selected.deliveredDate }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
                {selected.rejectedReason && (
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Rejection Reason</p>
                    <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{selected.rejectedReason}</p>
                  </div>
                )}

                {selected.status === "pending" && (
                  <>
                    {showRejectBox ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Reason for rejection…" rows={3} className="text-xs border border-border rounded-xl p-2 outline-none resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => reject(selected.id)} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700">Confirm Reject</button>
                          <button onClick={() => setShowRejectBox(false)} className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-gray-600">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => approve(selected.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700">
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button onClick={() => setShowRejectBox(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200">
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </>
                )}
                <button onClick={() => setSelectedId(null)} className="py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-surface">Close</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
