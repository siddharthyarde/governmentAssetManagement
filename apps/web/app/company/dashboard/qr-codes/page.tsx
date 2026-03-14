"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, QrCode, Download, Search, Filter,
  ChevronDown, Package, CheckCircle2, Clock, AlertCircle,
  Printer, ZoomIn, X, ScanLine, BarChart3, Eye,
  ChevronRight, RefreshCw, Layers, Tag, BadgeCheck,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";

// ─── Types ────────────────────────────────────────────────────────────────────

type QRStatus = "all" | "generated" | "dispatched" | "scanned" | "pending";

interface QRProduct {
  id:          string;
  name:        string;
  category:    string;
  totalQty:    number;
  qrGenerated: number;
  qrDispatched: number;
  qrScanned:   number;
  status:      "generated" | "dispatched" | "scanned" | "pending";
  approvedAt?: string;
  goiIdPrefix: string;
  labelFormat: "batch" | "individual";
  unitPrice:   number;
}

interface QRLabel {
  goiId:      string;
  productId:  string;
  productName: string;
  status:     "in_stock" | "dispatched" | "scanned" | "delivered";
  location?:  string;
  lastScan?:  string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS: QRProduct[] = [
  { id: "P001", name: "Folding Chair — Steel Frame, Black Fabric", category: "Furniture",   totalQty: 8000, qrGenerated: 8000, qrDispatched: 5200, qrScanned: 4800, status: "scanned",   approvedAt: "2024-06-12", goiIdPrefix: "GAMS-P001", labelFormat: "individual", unitPrice: 2400 },
  { id: "P002", name: "LED Par Light 100W RGBW — Stage Grade",     category: "Electronics", totalQty: 500,  qrGenerated: 500,  qrDispatched: 100,  qrScanned: 98,  status: "dispatched", approvedAt: "2024-06-14", goiIdPrefix: "GAMS-P002", labelFormat: "individual", unitPrice: 12000 },
  { id: "P003", name: "Crowd Control Barrier — Steel 2.5m",        category: "Safety",      totalQty: 2000, qrGenerated: 2000, qrDispatched: 0,    qrScanned: 0,   status: "generated",  approvedAt: "2024-06-15", goiIdPrefix: "GAMS-P003", labelFormat: "individual", unitPrice: 3200 },
  { id: "P004", name: "Executive Chair — Ergonomic, High-back",    category: "Furniture",   totalQty: 1200, qrGenerated: 0,    qrDispatched: 0,    qrScanned: 0,   status: "pending",    goiIdPrefix: "GAMS-P004", labelFormat: "individual", unitPrice: 12000 },
  { id: "P005", name: "Projection Screen 180-inch Electric",       category: "Electronics", totalQty: 80,   qrGenerated: 80,   qrDispatched: 75,   qrScanned: 75,  status: "scanned",    approvedAt: "2024-06-10", goiIdPrefix: "GAMS-P005", labelFormat: "individual", unitPrice: 48000 },
  { id: "P006", name: "Industrial UPS 10 kVA Rack Mount",          category: "Electrical",  totalQty: 60,   qrGenerated: 60,   qrDispatched: 44,   qrScanned: 44,  status: "scanned",    approvedAt: "2024-06-11", goiIdPrefix: "GAMS-P006", labelFormat: "individual", unitPrice: 160000 },
];

// Generate sample QR label rows for the selected product
function generateLabelRows(product: QRProduct, count = 20): QRLabel[] {
  return Array.from({ length: count }, (_, i) => {
    const n      = String(i + 1).padStart(4, "0");
    const scans  = Math.floor((product.qrScanned / product.qrGenerated) * count);
    const disp   = Math.floor((product.qrDispatched / product.qrGenerated) * count);
    const status: QRLabel["status"] =
      i < scans  ? "scanned"    :
      i < disp   ? "dispatched" : "in_stock";
    return {
      goiId:       `${product.goiIdPrefix}-${n}`,
      productId:   product.id,
      productName: product.name,
      status,
      location:    status !== "in_stock" ? ["Delhi State Library", "SAI Lucknow", "Rajasthan Police HQ"][i % 3] : undefined,
      lastScan:    status === "scanned" ? `2024-06-${10 + (i % 10)}` : undefined,
    };
  });
}

const FORMAT_OPTIONS = [
  { id: "a4",     label: "A4 Sheet — 21-up",   desc: "Standard laser/inkjet, 63.5×38.1mm per label" },
  { id: "dymo",   label: "Dymo 62mm",           desc: "Direct thermal, 62mm continuous roll"          },
  { id: "avery",  label: "Avery 5160",          desc: "30 labels/sheet, 1\"×2⅝\" per label"           },
  { id: "zebra",  label: "Zebra 4×2 inch",      desc: "Industrial thermal transfer, 4×2 inch"         },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

function StatusPill({ status }: { status: QRProduct["status"] }) {
  const map = {
    generated:  "bg-blue-100 text-blue-700",
    dispatched: "bg-purple-100 text-purple-700",
    scanned:    "bg-green-100 text-green-700",
    pending:    "bg-yellow-100 text-yellow-700",
  };
  const labels = { generated: "QR Ready", dispatched: "In Transit", scanned: "Live", pending: "Pending Approval" };
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${map[status]}`}>{labels[status]}</span>;
}

function LabelStatusDot({ status }: { status: QRLabel["status"] }) {
  const map = {
    in_stock:   "bg-blue-400",
    dispatched: "bg-purple-400",
    scanned:    "bg-green-500",
    delivered:  "bg-green-700",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status]}`} />;
}

// ─── Download Modal ───────────────────────────────────────────────────────────

function DownloadModal({ product, onClose }: { product: QRProduct; onClose: () => void }) {
  const [format, setFormat]       = useState("a4");
  const [range,  setRange]        = useState<"all" | "unprinted" | "custom">("all");
  const [from,   setFrom]         = useState("1");
  const [to,     setTo]           = useState(product.qrGenerated.toString());
  const [done,   setDone]         = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(`${product.goiIdPrefix}-0001`, {
      width: 180,
      margin: 2,
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
    }).then(setQrDataUrl).catch(() => {});
  }, [product.goiIdPrefix]);

  async function handleDownload() {
    const sampleId = `${product.goiIdPrefix}-0001`;
    try {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, sampleId, { width: 400, margin: 2 });
      const link = document.createElement("a");
      link.download = `${product.goiIdPrefix}-SAMPLE.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {}
    setDone(true);
  }

  const count =
    range === "all"       ? product.qrGenerated :
    range === "unprinted" ? product.qrGenerated - product.qrDispatched :
    Math.max(0, Number(to) - Number(from) + 1);

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-14 h-14 bg-saffron-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Download size={26} className="text-saffron-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Download Ready</h3>
          <p className="text-sm text-gray-500 mb-5">
            <strong>{count.toLocaleString("en-IN")} QR labels</strong> for <em>{product.name}</em> are ready.
            Sample QR PNG downloaded. Full batch label PDF is generated server-side.
          </p>
          <button onClick={onClose} className="w-full text-white font-bold py-2.5 rounded-xl" style={{ background: "#E07B00" }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Download QR Labels</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Format */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Label Format</p>
            <div className="flex flex-col gap-2">
              {FORMAT_OPTIONS.map((f) => (
                <label key={f.id} className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${format === f.id ? "border-saffron-500 bg-saffron-50" : "border-border"}`}>
                  <input type="radio" name="format" value={f.id} checked={format === f.id} onChange={() => setFormat(f.id)} className="accent-saffron-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{f.label}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Range */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">Label Range</p>
            <div className="flex flex-col gap-2">
              {[
                { key: "all",       label: `All labels (${product.qrGenerated.toLocaleString("en-IN")})` },
                { key: "unprinted", label: `Not yet dispatched (${(product.qrGenerated - product.qrDispatched).toLocaleString("en-IN")})` },
                { key: "custom",    label: "Custom range…" },
              ].map((r) => (
                <label key={r.key} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="range" value={r.key} checked={range === r.key} onChange={() => setRange(r.key as typeof range)} className="accent-saffron-500" />
                  <span className="text-sm text-gray-700 font-semibold">{r.label}</span>
                </label>
              ))}
            </div>
            {range === "custom" && (
              <div className="flex items-center gap-2 mt-2">
                <input type="number" min="1" max={product.qrGenerated} value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" placeholder="From" />
                <span className="text-gray-400 text-sm">—</span>
                <input type="number" min="1" max={product.qrGenerated} value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 border border-border rounded-xl px-3 py-2 text-sm" placeholder="To" />
              </div>
            )}
          </div>

          {/* QR Preview */}
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-2 bg-surface border border-border rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sample QR · {product.goiIdPrefix}-0001</p>
              <img src={qrDataUrl} alt="QR Code Preview" className="w-24 h-24" />
              <p className="text-[10px] text-gray-400 text-center">Each label encodes a unique GOI-ID</p>
            </div>
          )}

          {/* Summary */}
          <div className="bg-surface border border-border rounded-xl px-4 py-3 text-sm flex justify-between">
            <span className="text-gray-500">Labels to download</span>
            <span className="font-black text-gray-900">{count.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface">Cancel</button>
            <button onClick={handleDownload} className="flex-1 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90" style={{ background: "#E07B00" }}>
              <Download size={14} /> Download Sample PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Labels Table Modal ───────────────────────────────────────────────────────

function LabelsModal({ product, onClose }: { product: QRProduct; onClose: () => void }) {
  const labels = useMemo(() => generateLabelRows(product), [product]);
  const [search, setSearch] = useState("");
  const filtered = search ? labels.filter((l) => l.goiId.toLowerCase().includes(search.toLowerCase())) : labels;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[85dvh]">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-gray-900">Individual QR Labels</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.name} · {product.qrGenerated.toLocaleString("en-IN")} total</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
        </div>

        <div className="px-5 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-border rounded-xl pl-8 pr-4 py-2 text-sm bg-surface focus:outline-none focus:border-saffron-400"
              placeholder="Search by GOI-ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border sticky top-0">
              <tr>
                {["GOI-ID", "Status", "Location", "Last Scan"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.goiId} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-5 py-2.5">
                    <span className="font-mono text-xs font-bold text-gray-900">{l.goiId}</span>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 capitalize">
                      <LabelStatusDot status={l.status} />
                      {l.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-xs text-gray-500">{l.location ?? "—"}</td>
                  <td className="px-5 py-2.5 text-xs text-gray-400">{l.lastScan ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-xs text-gray-400 py-4">Showing {filtered.length} of {product.qrGenerated.toLocaleString("en-IN")} labels (sample)</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QRCodesPage() {
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<QRStatus>("all");
  const [downloadProduct, setDownload]    = useState<QRProduct | null>(null);
  const [viewProduct, setView]            = useState<QRProduct | null>(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, statusFilter]);

  const totalGenerated  = PRODUCTS.reduce((s, p) => s + p.qrGenerated, 0);
  const totalDispatched = PRODUCTS.reduce((s, p) => s + p.qrDispatched, 0);
  const totalScanned    = PRODUCTS.reduce((s, p) => s + p.qrScanned, 0);
  const totalPending    = PRODUCTS.filter((p) => p.status === "pending").length;

  return (
    <div className="min-h-dvh bg-surface">
      {/* Tiranga */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/company/dashboard" className="p-2 rounded-xl border border-border hover:bg-surface text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">QR Code Management</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Link href="/company/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={10} />
              <span>QR Codes</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/company/dashboard/products" className="flex items-center gap-1.5 border border-border rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-surface">
              <Package size={13} /> My Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: QrCode,       label: "QR Codes Generated",  val: totalGenerated.toLocaleString("en-IN"),  color: "text-saffron-600", bg: "bg-saffron-50"  },
            { icon: Tag,          label: "Labels Dispatched",    val: totalDispatched.toLocaleString("en-IN"), color: "text-purple-600",  bg: "bg-purple-50"   },
            { icon: ScanLine,     label: "Labels Scanned Live",  val: totalScanned.toLocaleString("en-IN"),    color: "text-green-600",   bg: "bg-green-50"    },
            { icon: Clock,        label: "Products Pending",     val: totalPending.toString(),                 color: "text-yellow-600",  bg: "bg-yellow-50"   },
          ].map(({ icon: Icon, label, val, color, bg }) => (
            <div key={label} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3">
          <ScanLine size={15} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            Each QR label encodes a unique GOI-ID. When scanned, it shows the full asset lifecycle — from
            original purchase through redistribution to the current institution.
            QR codes are generated automatically after admin approval.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as QRStatus)}
              className="border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="generated">QR Generated</option>
              <option value="dispatched">Dispatched</option>
              <option value="scanned">Live / Scanned</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Product cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((p) => {
            const genPct   = p.qrGenerated > 0 ? Math.round((p.qrDispatched / p.qrGenerated) * 100) : 0;
            const scanPct  = p.qrGenerated > 0 ? Math.round((p.qrScanned    / p.qrGenerated) * 100) : 0;

            return (
              <div key={p.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
                      <QrCode size={18} className="text-saffron-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.category} · Prefix: <span className="font-mono">{p.goiIdPrefix}-XXXX</span></p>
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Total Units",    val: p.totalQty.toLocaleString("en-IN"),    icon: Layers },
                    { label: "QR Generated",  val: p.qrGenerated.toLocaleString("en-IN"),  icon: QrCode },
                    { label: "Dispatched",    val: p.qrDispatched.toLocaleString("en-IN"), icon: Tag    },
                    { label: "Scanned Live",  val: p.qrScanned.toLocaleString("en-IN"),    icon: ScanLine },
                  ].map(({ label, val, icon: Icon }) => (
                    <div key={label} className="bg-surface rounded-xl p-3 text-center">
                      <p className="text-base font-black text-gray-900">{val}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bars */}
                {p.status !== "pending" && (
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                        <span>Dispatched</span><span>{genPct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${genPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                        <span>Scanned / Verified</span><span>{scanPct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${scanPct}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending notice */}
                {p.status === "pending" && (
                  <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
                    <Clock size={13} className="text-yellow-600" />
                    QR codes will be auto-generated after admin approval of this product listing.
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {p.status !== "pending" && (
                    <>
                      <button
                        onClick={() => setDownload(p)}
                        className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90"
                        style={{ background: "#E07B00" }}
                      >
                        <Download size={12} /> Download Labels
                      </button>
                      <button
                        onClick={() => setView(p)}
                        className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-700 px-4 py-2 rounded-xl hover:bg-surface"
                      >
                        <Eye size={12} /> View Individual IDs
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-700 px-4 py-2 rounded-xl hover:bg-surface">
                        <Printer size={12} /> Print
                      </button>
                    </>
                  )}
                  <Link
                    href={`/dashboard/products`}
                    className="flex items-center gap-1.5 text-xs font-semibold border border-border text-gray-600 px-4 py-2 rounded-xl hover:bg-surface ml-auto"
                  >
                    <ExternalLink size={12} /> Product Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-border rounded-2xl text-center">
            <QrCode size={36} className="text-gray-200 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No QR records found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Lifecycle legend */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 size={14} className="text-saffron-600" /> QR Label Lifecycle
          </h3>
          <div className="flex flex-wrap gap-4 text-xs">
            {[
              { color: "bg-yellow-400", label: "Pending Approval — awaiting admin sign-off" },
              { color: "bg-blue-400",   label: "Generated — QR created, ready to print"    },
              { color: "bg-purple-400", label: "Dispatched — affixed and in transit"         },
              { color: "bg-green-500",  label: "Scanned — successfully received & verified"  },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {downloadProduct && <DownloadModal product={downloadProduct} onClose={() => setDownload(null)} />}
      {viewProduct     && <LabelsModal   product={viewProduct}    onClose={() => setView(null)}     />}
    </div>
  );
}
