"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Package, Building2, Users,
  QrCode, BarChart2, IndianRupee, MapPin, Tag, Award,
  ChevronRight, Calendar, ArrowUpRight, ArrowDownRight,
  Truck, CheckCircle2, AlertCircle, Globe, RefreshCw, Download,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { createClient } from "@gams/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPI {
  label:    string;
  value:    string;
  sub?:     string;
  change:   number;
  icon:     React.ElementType;
  iconBg:   string;
  iconFg:   string;
}

interface BarItem {
  label: string;
  val:   number;
}

const BAR_COLORS = [
  "#E07B00", "#3B82F6", "#EAB308", "#8B5CF6",
  "#22C55E", "#EF4444", "#14B8A6", "#9CA3AF",
];

interface StateRow {
  state:        string;
  companies:    number;
  institutions: number;
  assets:       number;
  valueINR:     number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const KPI_DATA: KPI[] = [
  {
    label: "Total Asset Value Redistributed", value: "₹7,490 Cr", sub: "across all events",
    change: +18.4, icon: IndianRupee, iconBg: "bg-saffron-50", iconFg: "text-saffron-600",
  },
  {
    label: "Active Companies", value: "214", sub: "+12 this month",
    change: +5.9, icon: Building2, iconBg: "bg-blue-50", iconFg: "text-blue-600",
  },
  {
    label: "Registered Institutions", value: "638", sub: "PSUs, States & Central",
    change: +8.2, icon: Users, iconBg: "bg-green-50", iconFg: "text-green-600",
  },
  {
    label: "QR Scans This Month", value: "24,812", sub: "Jan 2025",
    change: +31.7, icon: QrCode, iconBg: "bg-purple-50", iconFg: "text-purple-600",
  },
  {
    label: "Active Listings", value: "1,847", sub: "products on marketplace",
    change: -2.1, icon: Package, iconBg: "bg-orange-50", iconFg: "text-orange-600",
  },
  {
    label: "GOI Events Covered", value: "91", sub: "since 2022",
    change: +14.0, icon: Calendar, iconBg: "bg-teal-50", iconFg: "text-teal-600",
  },
];

const CATEGORY_BARS: BarItem[] = [
  { label: "Furniture",          val: 2310 },
  { label: "Electronics/AV",    val: 1920 },
  { label: "Electrical",        val: 1140 },
  { label: "IT Equipment",      val: 980  },
  { label: "Vehicles",          val: 720  },
  { label: "Medical Equipment", val: 560  },
  { label: "Safety & Security", val: 430  },
  { label: "Others",            val: 287  },
];

const MONTHLY_TREND = [
  { month: "Aug",  value: 38 }, { month: "Sep", value: 124 }, { month: "Oct", value: 42 },
  { month: "Nov",  value: 88 }, { month: "Dec", value: 56  }, { month: "Jan", value: 97 },
];

const TOP_COMPANIES = [
  { name: "Godrej Interio Pvt Ltd",            category: "Furniture",   listings: 124, value: "₹28.4 Cr",  verified: true  },
  { name: "Samsung India Electronics",         category: "Electronics", listings: 98,  value: "₹142.6 Cr", verified: true  },
  { name: "Kirloskar Electric Co Ltd",         category: "Electrical",  listings: 61,  value: "₹89.3 Cr",  verified: true  },
  { name: "Havells India Ltd",                 category: "Electrical",  listings: 54,  value: "₹31.9 Cr",  verified: true  },
  { name: "HCL Technologies — Surplus Div.",   category: "IT",          listings: 47,  value: "₹67.2 Cr",  verified: true  },
  { name: "Mahindra Logistics Assets",         category: "Vehicles",    listings: 43,  value: "₹56.1 Cr",  verified: true  },
  { name: "Philips India Ltd",                 category: "Electronics", listings: 38,  value: "₹24.7 Cr",  verified: false },
  { name: "Tata Advanced Systems Ltd",         category: "Safety",      listings: 31,  value: "₹18.5 Cr",  verified: true  },
];

const STATE_DATA: StateRow[] = [
  { state: "Delhi",          companies: 48,  institutions: 142, assets: 48000, valueINR: 1820000000 },
  { state: "Maharashtra",    companies: 41,  institutions: 98,  assets: 31000, valueINR: 1240000000 },
  { state: "Karnataka",      companies: 28,  institutions: 72,  assets: 24000, valueINR: 890000000  },
  { state: "Uttar Pradesh",  companies: 21,  institutions: 88,  assets: 62000, valueINR: 760000000  },
  { state: "Tamil Nadu",     companies: 19,  institutions: 56,  assets: 18000, valueINR: 510000000  },
  { state: "Gujarat",        companies: 17,  institutions: 48,  assets: 22000, valueINR: 480000000  },
  { state: "Rajasthan",      companies: 14,  institutions: 42,  assets: 16000, valueINR: 320000000  },
  { state: "West Bengal",    companies: 12,  institutions: 38,  assets: 12000, valueINR: 280000000  },
  { state: "Telangana",      companies: 11,  institutions: 32,  assets: 9800,  valueINR: 240000000  },
  { state: "Madhya Pradesh", companies:  9,  institutions: 28,  assets: 8200,  valueINR: 190000000  },
];

const PENDING_REVIEW = [
  { type: "Company",     name: "Wipro Surplus Assets Div.",    days: 3, flag: "docs"    },
  { type: "Product",     name: "Conference Chair Batch × 400", days: 2, flag: "price"   },
  { type: "Institution", name: "AIIMS Raipur",                  days: 5, flag: "kyc"     },
  { type: "Product",     name: "Solar Generator — 50 kVA",     days: 1, flag: "none"    },
  { type: "Company",     name: "Siemens India Ltd",             days: 4, flag: "callback" },
];

function formatVal(n: number) {
  if (n >= 1_00_00_00_000) return `₹${(n / 1_00_00_00_000).toFixed(1)}K Cr`;
  if (n >= 1_00_00_000)    return `₹${(n / 1_00_00_000).toFixed(0)} Cr`;
  if (n >= 1_00_000)       return `₹${(n / 1_00_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function AreaTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs font-bold text-gray-900">{label}</p>
      <p className="text-xs text-saffron-600 font-semibold">{payload[0].value} submissions</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs font-bold text-gray-900">{label}</p>
      <p className="text-xs text-blue-600 font-semibold">{payload[0].value.toLocaleString("en-IN")} assets</p>
    </div>
  );
}

function exportAnalyticsCSV(kpis: KPI[] = KPI_DATA) {
  const rows: string[][] = [
    ["Metric", "Value", "Change (%)"],
    ...kpis.map((k) => [k.label, k.value, (k.change >= 0 ? "+" : "") + k.change.toFixed(1) + "%"]),
    [],
    ["Category", "Asset Count"],
    ...CATEGORY_BARS.map((b) => [b.label, String(b.val)]),
    [],
    ["State", "Companies", "Institutions", "Assets", "Value (INR Cr)"],
    ...STATE_DATA.map((r) => [r.state, String(r.companies), String(r.institutions), String(r.assets), (r.valueINR / 1e7).toFixed(1)]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `GAMS-Analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const [refreshing, setRefreshing] = useState(false);
  const [kpiData, setKpiData] = useState<KPI[]>(KPI_DATA);

  useEffect(() => {
    const db = createClient();
    Promise.all([
      db.from("companies").select("*", { count: "exact", head: true }),
      db.from("institutions").select("*", { count: "exact", head: true }),
      db.from("redistribution_listings").select("*", { count: "exact", head: true }).eq("status", "listed"),
      db.from("events").select("*", { count: "exact", head: true }),
    ]).then(([comp, inst, listings, evts]) => {
      setKpiData((prev) =>
        prev.map((k) => {
          if (k.label === "Active Companies" && comp.count != null)
            return { ...k, value: String(comp.count), sub: `+${Math.max(0, comp.count - 200)} this month` };
          if (k.label === "Registered Institutions" && inst.count != null)
            return { ...k, value: String(inst.count) };
          if (k.label === "Active Listings" && listings.count != null)
            return { ...k, value: listings.count.toLocaleString("en-IN"), sub: "products on marketplace" };
          if (k.label === "GOI Events Covered" && evts.count != null)
            return { ...k, value: String(evts.count) };
          return k;
        })
      );
    });
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  return (
    <div className="min-h-dvh bg-surface">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/manage" className="text-lg font-black text-gray-900">GAMS</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-sm font-bold text-gray-900">Analytics</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex border border-border rounded-xl overflow-hidden text-xs font-bold">
              {["week", "month", "quarter", "year"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-2 capitalize transition-colors ${period === p ? "text-white" : "text-gray-500 hover:bg-surface"}`}
                  style={period === p ? { background: "#E07B00" } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1 text-xs font-semibold border border-border rounded-xl px-3 py-2 hover:bg-surface text-gray-600 disabled:opacity-60"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            <button
              onClick={() => exportAnalyticsCSV(kpiData)}
              className="flex items-center gap-1 text-xs font-semibold border border-border rounded-xl px-3 py-2 hover:bg-surface text-gray-600"
            >
              <Download size={12} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpiData.map(({ label, value, sub, change, icon: Icon, iconBg, iconFg }) => (
            <div key={label} className="bg-white border border-border rounded-2xl p-4 flex flex-col gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={16} className={iconFg} />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
                {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                {change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {Math.abs(change)}% vs prev
              </div>
              <p className="text-[9px] text-gray-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Row: Trend + Category Distribution */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Monthly listings trend */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-black text-gray-900">Listings Submitted / Month</p>
              <span className="text-[10px] text-gray-400 bg-surface border border-border rounded-full px-2 py-0.5">Aug – Jan</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Number of new product submissions across all companies</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E07B00" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#E07B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9A9A9A" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9A9A9A" }} axisLine={false} tickLine={false} />
                <Tooltip content={<AreaTooltip />} cursor={{ stroke: "#E07B00", strokeWidth: 1, strokeDasharray: "4 2" }} />
                <Area type="monotone" dataKey="value" stroke="#E07B00" strokeWidth={2} fill="url(#trendGrad)" dot={{ r: 3, fill: "#E07B00", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#E07B00" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category distribution */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-sm font-black text-gray-900 mb-1">Assets by Category</p>
            <p className="text-xs text-gray-400 mb-4">Total listings across all active events</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={CATEGORY_BARS}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9A9A9A" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: "#6B6B6B", fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "#F5F3EE" }} />
                <Bar dataKey="val" radius={[0, 4, 4, 0]}>
                  {CATEGORY_BARS.map((b, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row: Top companies + Pending */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Top companies (2/3 width) */}
          <div className="md:col-span-2 bg-white border border-border rounded-2xl p-6">
            <p className="text-sm font-black text-gray-900 mb-1">Top Companies by Listings</p>
            <p className="text-xs text-gray-400 mb-4">Ranked by number of active product submissions</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-border">
                    <th className="pb-2 font-bold">#</th>
                    <th className="pb-2 font-bold">Company</th>
                    <th className="pb-2 font-bold">Category</th>
                    <th className="pb-2 font-bold text-right">Listings</th>
                    <th className="pb-2 font-bold text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_COMPANIES.map((c, i) => (
                    <tr key={c.name} className="border-b border-border last:border-0">
                      <td className="py-2.5 text-gray-400 font-bold">{i + 1}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 truncate max-w-[160px]">{c.name}</span>
                          {c.verified && <CheckCircle2 size={10} className="text-green-500 shrink-0" />}
                        </div>
                      </td>
                      <td className="py-2.5 text-gray-500">{c.category}</td>
                      <td className="py-2.5 text-right font-black text-gray-900">{c.listings}</td>
                      <td className="py-2.5 text-right font-bold text-green-600">{c.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending review (1/3 width) */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-sm font-black text-gray-900 mb-1">Attention Required</p>
            <p className="text-xs text-gray-400 mb-4">Items waiting for admin action</p>
            <div className="flex flex-col gap-3">
              {PENDING_REVIEW.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-surface border border-border rounded-xl">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-black ${p.type === "Company" ? "bg-saffron-50 text-saffron-700" : p.type === "Product" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>
                    {p.type[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.type} · {p.days}d pending</p>
                    {p.flag !== "none" && (
                      <span className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5 mt-1 inline-block uppercase">{p.flag}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/manage/approvals" className="flex items-center justify-center gap-1 mt-3 text-xs font-bold text-saffron-600 hover:text-saffron-700">
              View All Approvals <ChevronRight size={11} />
            </Link>
          </div>
        </div>

        {/* State-wise coverage */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-black text-gray-900">State-wise Coverage</p>
              <p className="text-xs text-gray-400">Companies, institutions and total asset distribution by state</p>
            </div>
            <Globe size={18} className="text-gray-300" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 text-left border-b border-border">
                  <th className="pb-2.5 font-bold">#</th>
                  <th className="pb-2.5 font-bold">State</th>
                  <th className="pb-2.5 font-bold text-right">Companies</th>
                  <th className="pb-2.5 font-bold text-right">Institutions</th>
                  <th className="pb-2.5 font-bold text-right">Total Assets</th>
                  <th className="pb-2.5 font-bold text-right">Asset Value</th>
                  <th className="pb-2.5 font-bold">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {STATE_DATA.map((s, i) => {
                  const pct = Math.round((s.valueINR / STATE_DATA[0].valueINR) * 100);
                  return (
                    <tr key={s.state} className="border-b border-border last:border-0">
                      <td className="py-3 text-gray-400 font-bold">{i + 1}</td>
                      <td className="py-3 font-bold text-gray-900">{s.state}</td>
                      <td className="py-3 text-right text-gray-600">{s.companies}</td>
                      <td className="py-3 text-right text-gray-600">{s.institutions}</td>
                      <td className="py-3 text-right text-gray-600">{s.assets.toLocaleString("en-IN")}</td>
                      <td className="py-3 text-right font-bold text-green-600">{formatVal(s.valueINR)}</td>
                      <td className="py-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-saffron-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
