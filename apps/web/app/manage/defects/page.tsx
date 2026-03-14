"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle, Package, Search, CheckCircle2, XCircle,
  LayoutDashboard, Bell, Calendar, FileText, Star, Wrench,
  ChevronRight, Clock, Camera,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type DefectStatus = "reported" | "acknowledged" | "under_repair" | "resolved" | "disposed";
type DefectSeverity = "minor" | "major" | "critical";

interface Defect {
  id: string;
  assetId: string;
  assetName: string;
  event: string;
  company: string;
  severity: DefectSeverity;
  type: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  updatedDate: string;
  status: DefectStatus;
  estimatedCost: number;
  notes: string;
}

const DEFECTS: Defect[] = [
  { id: "DEF-001", assetId: "AST-008", assetName: "Industrial Air Coolers", event: "Pravasi Bharatiya Diwas", company: "CoolBreeze Corp.", severity: "major", type: "Physical Damage", description: "8 units returned with broken fan blades and cracked housings.", reportedBy: "Anil Tripathi", reportedDate: "2024-02-05", updatedDate: "2024-02-07", status: "under_repair", estimatedCost: 45000, notes: "Company dispute raised. Awaiting insurance claim." },
  { id: "DEF-002", assetId: "AST-004", assetName: "Modular Stage Platforms", event: "National Sports Games", company: "EventSetup Co.", severity: "minor", type: "Surface Wear", description: "Scratches and minor gouges on surface panels. One damaged joint connector.", reportedBy: "Rajesh Nair", reportedDate: "2024-02-01", updatedDate: "2024-02-03", status: "acknowledged", estimatedCost: 12000, notes: "Normal wear for outdoor event. Panels can be refinished." },
  { id: "DEF-003", assetId: "AST-010", assetName: "Online UPS 5KVA", event: "Digital India Conclave", company: "Surya Electricals", severity: "critical", type: "Electrical Failure", description: "3 UPS units showing no response on startup. Battery cells possibly damaged.", reportedBy: "Priya Verma", reportedDate: "2024-01-22", updatedDate: "2024-01-25", status: "under_repair", estimatedCost: 90000, notes: "Sent to OEM service center. Expected resolution in 2 weeks." },
  { id: "DEF-004", assetId: "AST-002", assetName: "JBL Amplifiers 2000W", event: "Republic Day 2024", company: "LightTech Pvt.", severity: "minor", type: "Cosmetic", description: "Protective grille dented on 2 units. All functional.", reportedBy: "Meena Shah", reportedDate: "2024-01-28", updatedDate: "2024-02-01", status: "resolved", estimatedCost: 3500, notes: "Grilles replaced from stock. Units cleared for deployment." },
  { id: "DEF-005", assetId: "AST-007", assetName: "Crowd Barriers — Metal", event: "Kumbh Mela 2024", company: "SafetyFirst", severity: "major", type: "Structural Damage", description: "12 barrier panels bent beyond safe use, likely from vehicle contact.", reportedBy: "Suresh Kumar", reportedDate: "2024-02-10", updatedDate: "2024-02-10", status: "reported", estimatedCost: 60000, notes: "Awaiting inspector visit on site." },
  { id: "DEF-006", assetId: "AST-003", assetName: "250kVA Silent Generators", event: "Vibrant Gujarat Summit", company: "ClimaWorks", severity: "critical", type: "Mechanical Failure", description: "Coolant leak detected in Gen-2. Engine overheated during event; unit is non-operational.", reportedBy: "Rajesh Nair", reportedDate: "2024-01-14", updatedDate: "2024-01-20", status: "disposed", estimatedCost: 350000, notes: "Engine seized. Disposed as scrap after insurance assessment." },
];

const STATUS_META: Record<DefectStatus, { label: string; cls: string }> = {
  reported: { label: "Reported", cls: "bg-gray-100 text-gray-700" },
  acknowledged: { label: "Acknowledged", cls: "bg-blue-100 text-blue-700" },
  under_repair: { label: "Under Repair", cls: "bg-yellow-100 text-yellow-700" },
  resolved: { label: "Resolved", cls: "bg-green-100 text-green-700" },
  disposed: { label: "Disposed", cls: "bg-red-100 text-red-700" },
};

const SEV_META: Record<DefectSeverity, { cls: string; dot: string }> = {
  minor: { cls: "text-blue-600", dot: "bg-blue-400" },
  major: { cls: "text-orange-600", dot: "bg-orange-400" },
  critical: { cls: "text-red-600", dot: "bg-red-500" },
};

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/rating", icon: Star, label: "Rate Assets" },
  { href: "/defects", icon: AlertTriangle, label: "Defects" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/reports", icon: FileText, label: "Reports" },
];

const NEXT_STATUS: Partial<Record<DefectStatus, DefectStatus>> = {
  reported: "acknowledged",
  acknowledged: "under_repair",
  under_repair: "resolved",
};

export default function DefectsPage() {
  const [defects, setDefects] = useState<Defect[]>(DEFECTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DefectStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient();
    db.from("defects")
      .select("id, severity, description, is_resolved, reported_by, created_at, resolution_note, instance_id, event_id")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setDefects(data.map((d, i) => {
          const sev = d.severity === "moderate" ? "major" : (d.severity as DefectSeverity);
          return {
            id: `DEF-${String(i + 1).padStart(3, "0")}`,
            assetId: d.instance_id ? d.instance_id.slice(0, 8) : "—",
            assetName: d.instance_id ? `Asset #${d.instance_id.slice(0, 8)}` : "Unknown Asset",
            event: d.event_id ? `Event #${d.event_id.slice(0, 8)}` : "—",
            company: "—",
            severity: sev,
            type: "Reported",
            description: d.description,
            reportedBy: d.reported_by ? d.reported_by.slice(0, 8) : "System",
            reportedDate: d.created_at.slice(0, 10),
            updatedDate: d.created_at.slice(0, 10),
            status: d.is_resolved ? "resolved" : "reported",
            estimatedCost: 0,
            notes: d.resolution_note ?? "",
          };
        }));
      });
  }, []);

  const filtered = defects.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = d.assetName.toLowerCase().includes(q) || d.event.toLowerCase().includes(q) || d.company.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selected = defects.find((d) => d.id === selectedId) ?? null;
  const totalCost = defects.reduce((s, d) => s + d.estimatedCost, 0);
  const criticalCount = defects.filter((d) => d.severity === "critical").length;
  const openCount = defects.filter((d) => !["resolved", "disposed"].includes(d.status)).length;

  function advance(id: string) {
    setDefects((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const next = NEXT_STATUS[d.status];
      return next ? { ...d, status: next, updatedDate: new Date().toISOString().slice(0, 10) } : d;
    }));
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
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/defects" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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
          <h1 className="text-lg font-black text-gray-900">Defect Reports</h1>
          <p className="text-xs text-gray-400">Post-event damage records — track, resolve or dispose</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle size={18} className="text-red-500" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Critical Defects</p><p className="text-xl font-black text-gray-900">{criticalCount}</p></div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center"><Wrench size={18} className="text-yellow-500" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Open Cases</p><p className="text-xl font-black text-gray-900">{openCount}</p></div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><FileText size={18} className="text-orange-500" /></div>
              <div><p className="text-xs text-gray-400 font-semibold">Est. Repair Cost</p><p className="text-xl font-black text-gray-900">₹{(totalCost / 100000).toFixed(2)} L</p></div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search defects, assets, events…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none">
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_META) as DefectStatus[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
          </div>

          <div className="flex gap-5 min-h-0">
            <div className={`bg-white border border-border rounded-2xl overflow-auto ${selected ? "flex-1" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <th className="text-left px-4 py-3">Asset / Event</th>
                    <th className="text-left px-4 py-3">Company</th>
                    <th className="text-left px-4 py-3">Severity</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Est. Cost</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className={`border-b border-border hover:bg-surface cursor-pointer ${selectedId === d.id ? "bg-saffron-50" : ""}`} onClick={() => setSelectedId(d.id === selectedId ? null : d.id)}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{d.assetName}</p>
                        <p className="text-[10px] text-gray-400">{d.event}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{d.company}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-bold capitalize ${SEV_META[d.severity].cls}`}>
                          <span className={`w-2 h-2 rounded-full ${SEV_META[d.severity].dot}`} />{d.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{d.type}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-800">₹{d.estimatedCost.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[d.status].cls}`}>{STATUS_META[d.status].label}</span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No defects found</td></tr>}
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
                  { label: "Defect ID", value: selected.id },
                  { label: "Event", value: selected.event },
                  { label: "Company", value: selected.company },
                  { label: "Severity", value: selected.severity.toUpperCase() },
                  { label: "Type", value: selected.type },
                  { label: "Reported By", value: selected.reportedBy },
                  { label: "Reported Date", value: selected.reportedDate },
                  { label: "Last Updated", value: selected.updatedDate },
                  { label: "Estimated Cost", value: `₹${selected.estimatedCost.toLocaleString("en-IN")}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-xs text-gray-700 leading-relaxed bg-surface rounded-xl px-3 py-2">{selected.description}</p>
                </div>
                {selected.notes && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-xs text-gray-600 italic bg-yellow-50 rounded-xl px-3 py-2">{selected.notes}</p>
                  </div>
                )}
                {NEXT_STATUS[selected.status] && (
                  <button onClick={() => advance(selected.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600">
                    <ChevronRight size={13} /> Move to {STATUS_META[NEXT_STATUS[selected.status]!].label}
                  </button>
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
