"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList, Package, Calendar, Search, Eye,
  LayoutDashboard, Bell, Building2, FileText, CheckCircle2,
  MapPin, Layers, TrendingDown, AlertTriangle, Warehouse,
  QrCode, ChevronRight, IndianRupee, Tag,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

interface EventAsset {
  id: string;
  assetName: string;
  assetId: string;
  category: string;
  qty: number;
  assignedQty: number;
  event: string;
  eventDate: string;
  status: "pre_event" | "in_use" | "post_event" | "returned";
  location: string;
  company: string;
  valueINR: number;
}

const EVENT_ASSETS: EventAsset[] = [
  { id: "EA-001", assetId: "AST-005", assetName: "LED Par Lights RGBW 100W", category: "Electronics", qty: 500, assignedQty: 480, event: "Republic Day Parade 2024", eventDate: "2024-01-26", status: "returned", location: "Delhi Warehouse A", company: "LightTech Pvt.", valueINR: 1344000 },
  { id: "EA-002", assetId: "AST-001", assetName: "Folding Chairs — Steel Frame", category: "Furniture", qty: 8000, assignedQty: 8000, event: "G20 Summit India 2023", eventDate: "2023-09-09", status: "returned", location: "Delhi Warehouse A", company: "Jai Hind Traders", valueINR: 2560000 },
  { id: "EA-003", assetId: "AST-002", assetName: "JBL Amplifiers 2000W", category: "Electronics", qty: 120, assignedQty: 120, event: "Digital India Conclave 2023", eventDate: "2024-01-15", status: "returned", location: "Mumbai Warehouse B", company: "Surya Electricals", valueINR: 10200000 },
  { id: "EA-004", assetId: "AST-003", assetName: "125 kVA Diesel Generators", category: "Electrical", qty: 30, assignedQty: 30, event: "India Energy Week 2024", eventDate: "2024-02-06", status: "post_event", location: "Bangalore Depot", company: "PowerGen India", valueINR: 126000000 },
  { id: "EA-005", assetId: "AST-010", assetName: "UPS 10 kVA Units", category: "Electrical", qty: 60, assignedQty: 55, event: "Startup Mahakumbh 2024", eventDate: "2024-03-18", status: "in_use", location: "Lucknow Warehouse", company: "UPower Systems", valueINR: 16500000 },
  { id: "EA-006", assetId: "AST-009", assetName: "1.5 Ton Window ACs", category: "Electrical", qty: 140, assignedQty: 120, event: "Vibrant Gujarat Summit", eventDate: "2024-01-10", status: "returned", location: "Ahmedabad Depot", company: "ClimaWorks", valueINR: 10800000 },
  { id: "EA-007", assetId: "AST-004", assetName: "Modular Stage Platforms", category: "Infrastructure", qty: 600, assignedQty: 600, event: "National Sports Games 2023", eventDate: "2023-12-20", status: "post_event", location: "Ahmedabad Depot", company: "EventSetup Co.", valueINR: 6840000 },
  { id: "EA-008", assetId: "AST-007", assetName: "Crowd Control Barriers", category: "Safety", qty: 2000, assignedQty: 2000, event: "Kumbh Mela 2025 Setup", eventDate: "2025-01-13", status: "pre_event", location: "Prayagraj Depot", company: "SafeBarrier India", valueINR: 6400000 },
];

const STATUS_META = {
  pre_event:  { label: "Pre-Event",  cls: "bg-blue-100 text-blue-700"     },
  in_use:     { label: "In Use",     cls: "bg-green-100 text-green-700"   },
  post_event: { label: "Post-Event", cls: "bg-yellow-100 text-yellow-700" },
  returned:   { label: "Returned",   cls: "bg-gray-100 text-gray-600"     },
};

const NAV_ITEMS = [
  { href: "/manage", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manage/notifications", icon: Bell, label: "Notifications" },
  { href: "/manage/assets", icon: Package, label: "Asset Registry" },
  { href: "/manage/warehouse", icon: Warehouse, label: "Warehouse" },
  { href: "/manage/events", icon: Calendar, label: "Events" },
  { href: "/manage/event-assets", icon: ClipboardList, label: "Event Assets" },
  { href: "/manage/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/manage/analytics", icon: FileText, label: "Analytics" },
];

export default function EventAssetsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<EventAsset | null>(null);
  const [eventAssets, setEventAssets] = useState<EventAsset[]>(EVENT_ASSETS);

  useEffect(() => {
    const db = createClient();
    db.from("product_instances")
      .select("id, instance_code, status, current_event_id, warehouse_location, purchase_price_paise, products(name, category, company_id), events!product_instances_current_event_id_fkey(name, start_date)")
      .not("current_event_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const STATUS_MAP: Record<string, EventAsset["status"]> = {
          in_stock: "pre_event",
          deployed: "in_use",
          in_transit: "post_event",
          pending_rating: "post_event",
          redistributed: "returned",
          condemned: "returned",
          written_off: "returned",
          lost: "returned",
          under_repair: "returned",
        };
        setEventAssets(data.map((inst, i) => {
          const prod = Array.isArray(inst.products) ? inst.products[0] : inst.products;
          const event = Array.isArray(inst.events) ? inst.events[0] : inst.events;
          return {
            id: `EA-${String(i + 1).padStart(3, "0")}`,
            assetId: inst.instance_code,
            assetName: prod?.name ?? `Asset #${inst.instance_code}`,
            category: prod?.category ?? "General",
            qty: 1,
            assignedQty: 1,
            event: event?.name ?? (inst.current_event_id ? `Event #${inst.current_event_id.slice(0, 8)}` : "—"),
            eventDate: event?.start_date ?? "—",
            status: STATUS_MAP[inst.status] ?? "pre_event",
            location: inst.warehouse_location ?? "—",
            company: "—",
            valueINR: inst.purchase_price_paise ? Math.round(inst.purchase_price_paise / 100) : 0,
          };
        }));
      });
  }, []);

  const filtered = eventAssets.filter((ea) => {
    const q = search.toLowerCase();
    const matchSearch = ea.assetName.toLowerCase().includes(q) || ea.event.toLowerCase().includes(q) || ea.category.toLowerCase().includes(q) || ea.assetId.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || ea.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = eventAssets.reduce((s, a) => s + a.valueINR, 0);
  const inUseCount = eventAssets.filter((a) => a.status === "in_use").length;
  const postEventCount = eventAssets.filter((a) => a.status === "post_event").length;

  return (
    <div className="min-h-dvh bg-surface flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">भारत सरकार · GOI</p>
          <p className="text-sm font-bold text-[#1A1A1A]">GAMS Manage</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/event-assets" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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
            <h1 className="text-lg font-black text-gray-900">Event Assets</h1>
            <p className="text-xs text-gray-400">Track assets assigned to government events</p>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Value", value: `₹${(totalValue / 10000000).toFixed(0)} Cr`, icon: IndianRupee, color: "text-saffron-600 bg-saffron-50" },
              { label: "Currently In Use", value: inUseCount, icon: ClipboardList, color: "text-green-600 bg-green-50" },
              { label: "Post-Event (Pending)", value: postEventCount, icon: AlertTriangle, color: "text-yellow-600 bg-yellow-50" },
              { label: "Total Assignments", value: eventAssets.length, icon: Layers, color: "text-blue-600 bg-blue-50" },
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
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets, events…" className="flex-1 text-sm outline-none bg-transparent" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-border rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none">
              <option value="all">All Status</option>
              <option value="pre_event">Pre-Event</option>
              <option value="in_use">In Use</option>
              <option value="post_event">Post-Event</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div className="flex gap-5 min-h-0">
            <div className={`bg-white border border-border rounded-2xl overflow-auto ${selected ? "flex-1" : "w-full"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                    <th className="text-left px-4 py-3">Asset</th>
                    <th className="text-left px-4 py-3">Event</th>
                    <th className="text-left px-4 py-3">Qty Assigned</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Location</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ea) => (
                    <tr key={ea.id} className={`border-b border-border hover:bg-surface cursor-pointer ${selected?.id === ea.id ? "bg-saffron-50" : ""}`} onClick={() => setSelected(ea)}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{ea.assetName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{ea.assetId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px]">
                        <p className="font-medium truncate">{ea.event}</p>
                        <p className="text-gray-400">{ea.eventDate}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {ea.assignedQty.toLocaleString("en-IN")} / {ea.qty.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[ea.status].cls}`}>{STATUS_META[ea.status].label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400 shrink-0" />{ea.location}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); setSelected(ea); }} className="p-1.5 rounded-lg hover:bg-surface text-gray-400"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">No event assets found</td></tr>}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="w-72 bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[70vh]">
                <h2 className="text-sm font-black text-gray-900">{selected.assetName}</h2>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${STATUS_META[selected.status].cls}`}>{STATUS_META[selected.status].label}</span>
                {[
                  { label: "Assignment ID", value: selected.id },
                  { label: "Asset ID", value: selected.assetId },
                  { label: "Category", value: selected.category },
                  { label: "Total Qty", value: selected.qty.toLocaleString("en-IN") },
                  { label: "Assigned Qty", value: selected.assignedQty.toLocaleString("en-IN") },
                  { label: "Event", value: selected.event },
                  { label: "Event Date", value: selected.eventDate },
                  { label: "Location", value: selected.location },
                  { label: "Company", value: selected.company },
                  { label: "Asset Value", value: `₹${selected.valueINR.toLocaleString("en-IN")}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <Link href="/redistribution" className="flex items-center justify-center gap-2 py-2 rounded-xl bg-saffron-500 text-white text-xs font-bold hover:bg-saffron-600">
                    Redistribute Asset
                  </Link>
                  <button onClick={() => setSelected(null)} className="py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-surface">Close</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
