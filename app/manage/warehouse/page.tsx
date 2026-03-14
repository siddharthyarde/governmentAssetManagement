"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Warehouse, Package, MapPin, CheckCircle2, Search,
  LayoutDashboard, Bell, Building2, Calendar, FileText,
  AlertTriangle, TrendingUp, ArrowUpRight, Layers, Eye,
  Truck, ClipboardList,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "reserved";

interface WarehouseLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  utilized: number;
  manager: string;
  contact: string;
}

interface StockItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  minQty: number;
  location: string;
  status: StockStatus;
  lastUpdated: string;
}

const WAREHOUSES: WarehouseLocation[] = [
  { id: "WH-DEL-A", name: "Delhi Warehouse Alpha", city: "New Delhi", state: "Delhi", capacity: 50000, utilized: 38200, manager: "Suresh Kumar", contact: "+91-98100-12345" },
  { id: "WH-MUM-B", name: "Mumbai Warehouse Beta", city: "Mumbai", state: "Maharashtra", capacity: 30000, utilized: 22100, manager: "Priya Verma", contact: "+91-98200-23456" },
  { id: "WH-BLR-C", name: "Bangalore Depot Gamma", city: "Bangalore", state: "Karnataka", capacity: 20000, utilized: 11800, manager: "Rajesh Nair", contact: "+91-98300-34567" },
  { id: "WH-AHM-D", name: "Ahmedabad Depot Delta", city: "Ahmedabad", state: "Gujarat", capacity: 25000, utilized: 18700, manager: "Meena Shah", contact: "+91-98400-45678" },
  { id: "WH-LKO-E", name: "Lucknow Warehouse Epsilon", city: "Lucknow", state: "Uttar Pradesh", capacity: 15000, utilized: 9200, manager: "Anil Tripathi", contact: "+91-98500-56789" },
];

const STOCK: StockItem[] = [
  { id: "STK-001", name: "Folding Chairs — Steel", category: "Furniture", qty: 5200, minQty: 100, location: "WH-DEL-A", status: "in_stock", lastUpdated: "2024-01-10" },
  { id: "STK-002", name: "JBL Amplifiers 2000W", category: "Electronics", qty: 80, minQty: 10, location: "WH-MUM-B", status: "in_stock", lastUpdated: "2024-01-12" },
  { id: "STK-003", name: "125 kVA Generators", category: "Electrical", qty: 3, minQty: 5, location: "WH-BLR-C", status: "low_stock", lastUpdated: "2024-01-15" },
  { id: "STK-004", name: "Modular Stage Platforms", category: "Infrastructure", qty: 350, minQty: 50, location: "WH-AHM-D", status: "in_stock", lastUpdated: "2024-01-18" },
  { id: "STK-005", name: "LED Par Lights RGBW", category: "Electronics", qty: 480, minQty: 20, location: "WH-DEL-A", status: "in_stock", lastUpdated: "2024-01-20" },
  { id: "STK-006", name: "Conference Tables 10-seater", category: "Furniture", qty: 0, minQty: 5, location: "WH-DEL-A", status: "out_of_stock", lastUpdated: "2024-01-22" },
  { id: "STK-007", name: "Crowd Control Barriers", category: "Safety", qty: 1760, minQty: 100, location: "WH-LKO-E", status: "in_stock", lastUpdated: "2024-02-01" },
  { id: "STK-008", name: "Industrial Air Coolers", category: "Electrical", qty: 94, minQty: 10, location: "WH-MUM-B", status: "reserved", lastUpdated: "2024-02-05" },
  { id: "STK-009", name: "1.5T Window ACs", category: "Electrical", qty: 120, minQty: 20, location: "WH-AHM-D", status: "in_stock", lastUpdated: "2024-02-10" },
];

const STATUS_META: Record<StockStatus, { label: string; cls: string }> = {
  in_stock:     { label: "In Stock",     cls: "bg-green-100 text-green-700"   },
  low_stock:    { label: "Low Stock",    cls: "bg-yellow-100 text-yellow-700" },
  out_of_stock: { label: "Out of Stock", cls: "bg-red-100 text-red-700"       },
  reserved:     { label: "Reserved",     cls: "bg-blue-100 text-blue-700"     },
};

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/assets", icon: Package, label: "Asset Registry" },
  { href: "/warehouse", icon: Warehouse, label: "Warehouse" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/approvals", icon: CheckCircle2, label: "Approvals" },
  { href: "/analytics", icon: FileText, label: "Analytics" },
];

export default function WarehousePage() {
  const [search, setSearch] = useState("");
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [selectedWH, setSelectedWH] = useState<WarehouseLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = createClient();
    db.from("product_instances")
      .select("id, instance_code, warehouse_location, status, products(name, category)")
      .not("warehouse_location", "is", null)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        const rows = data ?? [];
        // Build unique warehouses from warehouse_location values
        const locMap = new Map<string, { count: number }>();
        rows.forEach((inst) => {
          const loc = inst.warehouse_location!;
          const existing = locMap.get(loc);
          if (existing) { existing.count++; } else { locMap.set(loc, { count: 1 }); }
        });
        const newWarehouses: WarehouseLocation[] = Array.from(locMap.entries()).map((entry, i) => {
          const [loc, info] = entry;
          return {
            id: `WH-DB-${String(i + 1).padStart(2, "0")}`,
            name: loc,
            city: loc.split(" ")[0] ?? loc,
            state: "—",
            capacity: 50000,
            utilized: info.count * 10,
            manager: "—",
            contact: "—",
          };
        });
        setWarehouses(newWarehouses);
        if (newWarehouses.length > 0) setSelectedWH(newWarehouses[0]);
        // Build stock from instances
        const newStock: StockItem[] = rows.map((inst, i) => {
          const prod = Array.isArray(inst.products) ? inst.products[0] : inst.products;
          const whId = newWarehouses.find((w) => w.name === inst.warehouse_location)?.id ?? "";
          return {
            id: `STK-${String(i + 1).padStart(3, "0")}`,
            name: prod?.name ?? inst.instance_code,
            category: prod?.category ?? "General",
            qty: 1,
            minQty: 1,
            location: whId,
            status: ["redistributed", "condemned", "written_off"].includes(inst.status)
              ? "out_of_stock"
              : inst.status === "deployed" ? "reserved" : "in_stock",
            lastUpdated: new Date().toISOString().slice(0, 10),
          };
        });
        setStock(newStock);
        setLoading(false);
      });
  }, []);

  const whStock = selectedWH ? stock.filter((s) => s.location === selectedWH.id) : [];
  const filteredStock = whStock.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));
  const utilPct = selectedWH ? Math.round((selectedWH.utilized / selectedWH.capacity) * 100) : 0;

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
            <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${href === "/warehouse" ? "bg-saffron-50 text-saffron-700 font-bold" : "text-gray-500 hover:bg-surface"}`}>
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
          <h1 className="text-lg font-black text-gray-900">Warehouse Management</h1>
          <p className="text-xs text-gray-400">{warehouses.length} warehouses · select one to view stock</p>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          {/* Warehouse cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {warehouses.map((wh) => {
              const pct = Math.round((wh.utilized / wh.capacity) * 100);
              return (
                <button
                  key={wh.id}
                  onClick={() => setSelectedWH(wh)}
                  className={`bg-white border rounded-2xl p-4 text-left transition-all ${selectedWH?.id === wh.id ? "border-saffron-400 shadow-md" : "border-border hover:border-saffron-200"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse size={16} className={selectedWH?.id === wh.id ? "text-saffron-500" : "text-gray-400"} />
                    <p className="text-xs font-black text-gray-900 truncate">{wh.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                    <MapPin size={10} />{wh.city}, {wh.state}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${pct > 80 ? "bg-red-400" : pct > 60 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400">{pct}% utilized</p>
                </button>
              );
            })}
          </div>

          {/* Selected warehouse detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Warehouse info card */}
            <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
              <h2 className="text-sm font-black text-gray-900">{selectedWH?.name ?? "—"}</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Location", value: `${selectedWH?.city ?? "—"}, ${selectedWH?.state ?? "—"}` },
                  { label: "Manager", value: selectedWH?.manager ?? "—" },
                  { label: "Contact", value: selectedWH?.contact ?? "—" },
                  { label: "Capacity", value: `${(selectedWH?.capacity ?? 0).toLocaleString("en-IN")} sq ft` },
                  { label: "Utilized", value: `${(selectedWH?.utilized ?? 0).toLocaleString("en-IN")} sq ft` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">Space Utilized</span>
                  <span className="text-gray-400">{utilPct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${utilPct > 80 ? "bg-red-400" : utilPct > 60 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${utilPct}%` }} />
                </div>
              </div>
            </div>

            {/* Stock table */}
            <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <h2 className="text-sm font-black text-gray-900 flex-1">Stock at {selectedWH?.name ?? "—"}</h2>
                <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-1.5">
                  <Search size={12} className="text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stock…" className="text-xs outline-none bg-transparent w-32" />
                </div>
              </div>
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <th className="text-left px-4 py-3">Item</th>
                      <th className="text-left px-4 py-3">Category</th>
                      <th className="text-left px-4 py-3">Qty</th>
                      <th className="text-left px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((s) => (
                      <tr key={s.id} className="border-b border-border hover:bg-surface">
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{s.id}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{s.category}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {s.qty.toLocaleString("en-IN")}
                          {s.qty <= s.minQty && s.qty > 0 && <span className="ml-1 text-[10px] text-yellow-600 font-bold">(low)</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${STATUS_META[s.status].cls}`}>{STATUS_META[s.status].label}</span>
                        </td>
                      </tr>
                    ))}
                    {filteredStock.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400">No items in this warehouse</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
