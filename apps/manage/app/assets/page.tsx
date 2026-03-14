"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, Search, Filter, Eye, QrCode, MapPin, Tag,
  CheckCircle2, Clock, AlertTriangle, LayoutDashboard, Bell,
  Building2, Calendar, FileText, ChevronRight, Download,
  Layers, ScanLine, ArrowUpRight, IndianRupee,
} from "lucide-react";

type AssetStatus = "available" | "assigned" | "in_transit" | "defective" | "disposed";
type AssetCondition = "Excellent" | "Good" | "Serviceable" | "Fair" | "Defective";

interface Asset {
  id: string;
  name: string;
  category: string;
  qty: number;
  condition: AssetCondition;
  status: AssetStatus;
  event: string;
  location: string;
  company: string;
  valueINR: number;
  qrCode: string;
  listedDate: string;
}

const ASSETS: Asset[] = [
  { id: "AST-001", name: "Folding Chairs — Steel Frame", category: "Furniture", qty: 5200, condition: "Excellent", status: "available", event: "G20 Summit 2023", location: "Delhi Warehouse A", company: "Jai Hind Traders", valueINR: 1664000, qrCode: "QR-AST-001", listedDate: "2024-01-10" },
  { id: "AST-002", name: "JBL Amplifiers 2000W", category: "Electronics", qty: 80, condition: "Good", status: "assigned", event: "Digital India Conclave", location: "Mumbai Warehouse B", company: "Surya Electricals", valueINR: 1760000, qrCode: "QR-AST-002", listedDate: "2024-01-12" },
  { id: "AST-003", name: "125 kVA Diesel Generators", category: "Electrical", qty: 18, condition: "Good", status: "in_transit", event: "India Energy Week", location: "In Transit — Bangalore", company: "PowerGen India", valueINR: 17640000, qrCode: "QR-AST-003", listedDate: "2024-01-15" },
  { id: "AST-004", name: "Modular Stage Platforms", category: "Infrastructure", qty: 350, condition: "Serviceable", status: "available", event: "National Sports Games", location: "Ahmedabad Depot", company: "EventSetup Co.", valueINR: 1330000, qrCode: "QR-AST-004", listedDate: "2024-01-18" },
  { id: "AST-005", name: "LED Par Lights RGBW 100W", category: "Electronics", qty: 480, condition: "Excellent", status: "available", event: "Republic Day 2024", location: "Delhi Warehouse A", company: "LightTech Pvt.", valueINR: 1344000, qrCode: "QR-AST-005", listedDate: "2024-01-20" },
  { id: "AST-006", name: "Conference Tables — 10-seater", category: "Furniture", qty: 32, condition: "Excellent", status: "assigned", event: "PM Economic Meet", location: "PMO Annex Store", company: "Raj Furniture", valueINR: 304000, qrCode: "QR-AST-006", listedDate: "2024-01-22" },
  { id: "AST-007", name: "Crowd Control Barriers", category: "Safety", qty: 1760, condition: "Good", status: "available", event: "Kumbh Mela Setup", location: "Prayagraj Depot", company: "SafeBarrier India", valueINR: 1320000, qrCode: "QR-AST-007", listedDate: "2024-02-01" },
  { id: "AST-008", name: "Industrial Air Coolers", category: "Electrical", qty: 94, condition: "Serviceable", status: "defective", event: "Pravasi Bharatiya Diwas", location: "Jaipur Store", company: "CoolBreeze Corp.", valueINR: 1128000, qrCode: "QR-AST-008", listedDate: "2024-02-05" },
  { id: "AST-009", name: "1.5 Ton Window ACs", category: "Electrical", qty: 120, condition: "Good", status: "available", event: "Vibrant Gujarat Summit", location: "Ahmedabad Depot", company: "ClimaWorks", valueINR: 3600000, qrCode: "QR-AST-009", listedDate: "2024-02-10" },
  { id: "AST-010", name: "UPS 10 kVA Units", category: "Electrical", qty: 55, condition: "Good", status: "available", event: "Startup Mahakumbh", location: "Lucknow Warehouse", company: "UPower Systems", valueINR: 2750000, qrCode: "QR-AST-010", listedDate: "2024-02-14" },
];

import { createClient } from "@gams/lib/supabase/client";

function ratingToCondition(r: number | null): AssetCondition {
  if (!r) return "Good";
  if (r >= 9) return "Excellent";
  if (r >= 7) return "Good";
  if (r >= 5) return "Serviceable";
  if (r >= 3) return "Fair";
  return "Defective";
}

const STATUS_META: Record<AssetStatus, { label: string; cls: string }> = {
  available:  { label: "Available",   cls: "bg-green-100 text-green-700"   },
  assigned:   { label: "Assigned",    cls: "bg-blue-100 text-blue-700"     },
  in_transit: { label: "In Transit",  cls: "bg-yellow-100 text-yellow-700" },
  defective:  { label: "Defective",   cls: "bg-red-100 text-red-700"       },
  disposed:   { label: "Disposed",    cls: "bg-gray-100 text-gray-500"     },
};

const CONDITION_CLS: Record<AssetCondition, string> = {
  Excellent: "text-green-600",
  Good:      "text-blue-600",
  Serviceable:"text-yellow-600",
  Fair:      "text-orange-600",
  Defective: "text-red-600",
};

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/analytics", icon: FileText, label: "Analytics" },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    createClient()
      .from("v_marketplace")
      .select("*")
      .order("quantity_available", { ascending: false })
      .then(({ data, error }) => {
        setAssets(!error && data ? (data as any[]).map((row) => ({
          id: row.listing_code,
          name: row.product_name,
          category: row.category,
          qty: row.quantity_available,
          condition: ratingToCondition(row.condition_rating),
          status: "available" as AssetStatus,
          event: "—",
          location: "—",
          company: row.brand ?? "—",
          valueINR: Math.round(row.original_price_paise / 100),
          qrCode: row.listing_code,
          listedDate: new Date().toISOString().split("T")[0],
        })) : []);
        setLoading(false);
      });
  }, []);

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function exportCSV() {
    const headers = ["ID", "Name", "Category", "Qty", "Condition", "Status", "Event", "Location", "Company", "Value (INR)", "QR Code", "Listed Date"];
    const rows = filtered.map((a) => [
      a.id, a.name, a.category, a.qty, a.condition,
      a.status, a.event, a.location, a.company,
      a.valueINR, a.qrCode, a.listedDate,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `GAMS-Assets-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const totalValue = assets.reduce((s, a) => s + a.valueINR, 0);
  const totalQty = assets.reduce((s, a) => s + a.qty, 0);
  const availableCount = assets.filter((a) => a.status === "available").length;
  const defectiveCount = assets.filter((a) => a.status === "defective").length;

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
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/assets" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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
          <div>
            <h1 className="text-lg font-black text-gray-900">Asset Registry</h1>
            <p className="text-xs text-gray-400">{assets.length} assets · {totalQty.toLocaleString("en-IN")} total units</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600">
            <Download size={14} /> Export CSV
          </button>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Value", value: `₹${(totalValue / 10000000).toFixed(1)} Cr`, icon: IndianRupee, color: "text-saffron-600 bg-saffron-50" },
              { label: "Available", value: availableCount, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
              { label: "Total Units", value: totalQty.toLocaleString("en-IN"), icon: Layers, color: "text-blue-600 bg-blue-50" },
              { label: "Defective", value: defectiveCount, icon: AlertTriangle, color: "text-red-500 bg-red-50" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">{label}</p>
                  <p className="text-xl font-black text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets, ID, location…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-white border border-border rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
              <option value="defective">Defective</option>
            </select>
          </div>

          {/* Table + detail panel */}
          <div className="flex gap-5 min-h-0">
            <div className={`bg-white border border-border rounded-2xl overflow-auto ${selectedAsset ? "flex-1" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Asset</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Qty</th>
                    <th className="text-left px-4 py-3">Condition</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className={`border-b border-border hover:bg-surface cursor-pointer transition-colors ${selectedAsset?.id === a.id ? "bg-saffron-50" : ""}`} onClick={() => setSelectedAsset(a)}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{a.id}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{a.category}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{a.qty.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-semibold text-xs">
                        <span className={CONDITION_CLS[a.condition]}>{a.condition}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[a.status].cls}`}>{STATUS_META[a.status].label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px] truncate">
                        <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400 shrink-0" />{a.location}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedAsset(a); }} className="p-1.5 rounded-lg hover:bg-surface text-gray-400"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">No assets found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Detail panel */}
            {selectedAsset && (
              <div className="w-80 bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 shrink-0 overflow-y-auto max-h-[70vh]">
                <div className="flex items-start justify-between">
                  <h2 className="text-sm font-black text-gray-900 leading-snug">{selectedAsset.name}</h2>
                  <button onClick={() => setSelectedAsset(null)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400"><Package size={13} /></button>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${STATUS_META[selectedAsset.status].cls}`}>{STATUS_META[selectedAsset.status].label}</span>

                {[
                  { label: "Asset ID",   value: selectedAsset.id },
                  { label: "Category",   value: selectedAsset.category },
                  { label: "Quantity",   value: selectedAsset.qty.toLocaleString("en-IN") + " units" },
                  { label: "Condition",  value: selectedAsset.condition },
                  { label: "Value",      value: `₹${selectedAsset.valueINR.toLocaleString("en-IN")}` },
                  { label: "Event",      value: selectedAsset.event },
                  { label: "Location",   value: selectedAsset.location },
                  { label: "Company",    value: selectedAsset.company },
                  { label: "Listed",     value: selectedAsset.listedDate },
                  { label: "QR Code",    value: selectedAsset.qrCode },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}

                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Link href="/scan" className="flex items-center justify-center gap-2 py-2 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600">
                    <ScanLine size={13} /> Scan QR
                  </Link>
                  <Link href="/redistribution" className="flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-xs font-bold text-gray-700 hover:bg-surface">
                    <ArrowUpRight size={13} /> Redistribute
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
