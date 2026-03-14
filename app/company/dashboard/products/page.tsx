"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  BarChart3,
  Eye,
  Trash2,
  MoreVertical,
  ArrowLeft,
  FileText,
  Layers,
  RefreshCw,
  X,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { ProductRow } from "@gams/lib/supabase/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = "approved" | "pending" | "rejected";

type Product = {
  id: string;
  name: string;
  category: string;
  qty: number;
  unitPrice: number;
  status: ProductStatus;
  qrReady: boolean;
  qrCount: number;
  created: string;
  event?: string;
};

// ─── DB → UI Mapper ─────────────────────────────────────────────────────────

function mapProductRow(row: ProductRow): Product {
  const statusMap: Record<string, ProductStatus> = {
    draft: "pending",
    pending_approval: "pending",
    approved: "approved",
    rejected: "rejected",
    discontinued: "rejected",
  };
  return {
    id: row.product_code,
    name: row.name,
    category: row.category,
    qty: 0,
    unitPrice: Math.round(row.original_price_paise / 100),
    status: (statusMap[row.status] as ProductStatus) ?? "pending",
    qrReady: false,
    qrCount: 0,
    created: new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    event: undefined,
  };
}

// ─── Mock Data (fallback while loading) ──────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "PRD-2024-00341",
    name: "Folding Chairs — Steel Frame, Black Fabric",
    category: "Furniture",
    qty: 5000,
    unitPrice: 2400,
    status: "approved",
    qrReady: true,
    qrCount: 5000,
    created: "12 Jun 2024",
    event: "Republic Day 2025 — New Delhi",
  },
  {
    id: "PRD-2024-00298",
    name: "Plastic Tables — 6ft, White Laminate",
    category: "Furniture",
    qty: 2000,
    unitPrice: 3800,
    status: "approved",
    qrReady: true,
    qrCount: 2000,
    created: "08 Jun 2024",
    event: "Republic Day 2025 — New Delhi",
  },
  {
    id: "PRD-2024-00412",
    name: "Outdoor Tent — 10×10 ft, UV Resistant",
    category: "Infrastructure",
    qty: 500,
    unitPrice: 38000,
    status: "pending",
    qrReady: false,
    qrCount: 0,
    created: "18 Jun 2024",
  },
  {
    id: "PRD-2024-00398",
    name: "LED Stage Light — 200W RGB",
    category: "Electronics",
    qty: 300,
    unitPrice: 12500,
    status: "pending",
    qrReady: false,
    qrCount: 0,
    created: "16 Jun 2024",
  },
  {
    id: "PRD-2024-00271",
    name: "Public Address System — 1000W, 8-channel",
    category: "Electronics",
    qty: 100,
    unitPrice: 85000,
    status: "rejected",
    qrReady: false,
    qrCount: 0,
    created: "02 Jun 2024",
  },
  {
    id: "PRD-2024-00255",
    name: "Steel Barricades — Crowd Control, 2m",
    category: "Safety",
    qty: 1200,
    unitPrice: 4500,
    status: "approved",
    qrReady: false,
    qrCount: 0,
    created: "28 May 2024",
    event: "Independence Day — Red Fort 2024",
  },
];

const STATUS_CONFIG: Record<ProductStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  approved: {
    label: "Approved",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: <CheckCircle2 size={12} />,
  },
  pending: {
    label: "Under Review",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: <Clock size={12} />,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: <XCircle size={12} />,
  },
};

const CATEGORIES = ["All", "Furniture", "Electronics", "Infrastructure", "Safety", "Miscellaneous"];
function downloadQRLabels(productId: string, productName: string, qty: number, format: string) {
  const rows: string[][] = [
    ["Label Format", format],
    ["Product ID", productId],
    ["Product Name", productName],
    ["Total Units", String(qty)],
    [""],
    ["Label #", "Product ID", "Unit #", "QR Ref", "Product Name"],
    ...Array.from({ length: Math.min(qty, 50) }, (_, i) => [
      String(i + 1), productId, String(i + 1), `${productId}-U${String(i + 1).padStart(4, "0")}`, productName,
    ]),
  ];
  if (qty > 50) rows.push(["...", `${qty - 50} more labels not shown in preview`, "", "", ""]);
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `QR-Labels-${productId}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({ product, onViewQR }: { product: Product; onViewQR: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sc = STATUS_CONFIG[product.status];
  const totalValue = product.qty * product.unitPrice;

  return (
    <tr className="hover:bg-surface/60 transition-colors border-b border-border last:border-0">
      {/* Product */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0">
            <Package size={16} className="text-saffron-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{product.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{product.id}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4 hidden md:table-cell">
        <span className="inline-flex text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          {product.category}
        </span>
      </td>

      {/* Qty */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <p className="text-sm font-medium text-gray-900">{product.qty.toLocaleString("en-IN")}</p>
        <p className="text-xs text-gray-400">units</p>
      </td>

      {/* Total Value */}
      <td className="px-4 py-4 hidden lg:table-cell">
        <p className="text-sm font-medium text-gray-900">
          ₹{(totalValue / 1_00_000).toFixed(2)}L
        </p>
        <p className="text-xs text-gray-400">₹{product.unitPrice.toLocaleString("en-IN")}/unit</p>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
          {sc.icon} {sc.label}
        </span>
      </td>

      {/* QR */}
      <td className="px-4 py-4 hidden md:table-cell">
        {product.qrReady ? (
          <button
            onClick={() => onViewQR(product.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-600 hover:text-saffron-700 border border-saffron-200 bg-saffron-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Download size={11} /> Labels
          </button>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors"
            aria-label="Product actions"
          >
            <MoreVertical size={15} className="text-gray-400" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-lg z-50 py-1">
                <Link href={`/dashboard/products/${product.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-surface">
                  <Eye size={13} /> View Details
                </Link>
                {product.status === "rejected" && (
                  <Link href={`/dashboard/products/${product.id}`} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                    <RefreshCw size={13} /> Resubmit
                  </Link>
                )}
                {product.qrReady && (
                  <button onClick={() => { onViewQR(product.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-saffron-600 hover:bg-saffron-50">
                    <QrCode size={13} /> Download QR Labels
                  </button>
                )}
                <hr className="my-1 border-border" />
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 size={13} /> Remove Listing
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts]           = useState<Product[]>([]);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<"all" | ProductStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [qrModalProduct, setQrModalProduct] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: cu } = await supabase.from("company_users").select("company_id").eq("user_id", user.id).maybeSingle();
      if (!cu?.company_id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("company_id", cu.company_id)
        .order("created_at", { ascending: false });
      if (!error) {
        setProducts((data as ProductRow[] ?? []).map(mapProductRow));
      }
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const counts = {
    total: products.length,
    approved: products.filter((p) => p.status === "approved").length,
    pending: products.filter((p) => p.status === "pending").length,
    rejected: products.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="min-h-dvh bg-surface">
      {/* Tiranga bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border px-4 md:px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/company/dashboard" className="p-2 rounded-lg border border-border hover:bg-surface transition-colors text-gray-400 hover:text-gray-700">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">My Products</h1>
              <p className="text-xs text-gray-400">{counts.total} listings · {counts.approved} approved</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/company/dashboard/products/bulk"
              className="inline-flex items-center gap-2 text-sm font-semibold border border-border text-gray-700 bg-white px-4 py-2 rounded-xl hover:bg-surface transition-colors"
            >
              <Upload size={15} /> Bulk Upload CSV
            </Link>
            <Link
              href="/company/dashboard/products/new"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "#E07B00" }}
            >
              <Plus size={15} /> Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Listed",  value: counts.total,    color: "#1A3A6B", filter: "all"     },
            { label: "Approved",      value: counts.approved, color: "#138808", filter: "approved" },
            { label: "Under Review",  value: counts.pending,  color: "#E07B00", filter: "pending"  },
            { label: "Rejected",      value: counts.rejected, color: "#DC2626", filter: "rejected" },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setStatusFilter(s.filter as "all" | ProductStatus)}
              className={`bg-white border rounded-2xl p-4 text-left transition-all hover:shadow-sm ${
                statusFilter === s.filter ? "border-saffron-300 shadow-sm" : "border-border"
              }`}
            >
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filters bar */}
        <div className="bg-white border border-border rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:border-saffron-300 bg-surface"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  categoryFilter === cat
                    ? "bg-saffron-500 text-white border-saffron-500"
                    : "bg-white text-gray-600 border-border hover:bg-surface"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pending-review notice */}
        {counts.pending > 0 && (
          <div className="flex items-start gap-3 border border-yellow-200 bg-yellow-50 rounded-2xl px-5 py-3 mb-4">
            <Clock size={16} className="text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-sm text-yellow-700">
              <strong>{counts.pending} product{counts.pending > 1 ? "s" : ""}</strong> {counts.pending > 1 ? "are" : "is"} awaiting GAMS admin approval. QR labels will be generated automatically upon approval.
            </p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Package size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-400">No products match your filters</p>
              <button
                onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("All"); }}
                className="mt-3 text-xs font-semibold text-saffron-600 hover:text-saffron-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/60">
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Total Value</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">QR Labels</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <ProductRow key={product.id} product={product} onViewQR={setQrModalProduct} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3 text-right">
          Showing {filtered.length} of {PRODUCTS.length} products
        </p>
      </div>

      {/* QR Download Modal */}
      {qrModalProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setQrModalProduct(null)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Download QR Labels</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{qrModalProduct}</p>
                </div>
                <button onClick={() => setQrModalProduct(null)} className="p-1 rounded-lg hover:bg-surface text-gray-400">
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                Select a label format to download print-ready QR code sheets for this product.
              </p>

              <div className="flex flex-col gap-2 mb-5">
                {[
                  { format: "A4 Sheet (21 labels/page)", icon: <Layers size={15} />, desc: "Standard A4 — compatible with most office printers" },
                  { format: "Dymo LabelWriter (62mm)",   icon: <FileText size={15} />, desc: "For Dymo LabelWriter 450 and compatible devices" },
                  { format: "Avery 5160 (30 labels)",    icon: <Layers size={15} />, desc: "Avery 5160 address label sheets — 30 per A4" },
                ].map((f) => {
                  const prod = PRODUCTS.find((p) => p.id === qrModalProduct);
                  return (
                  <button
                    key={f.format}
                    onClick={() => prod && downloadQRLabels(prod.id, prod.name, prod.qty, f.format)}
                    className="flex items-start gap-3 border border-border rounded-xl px-4 py-3 hover:bg-saffron-50 hover:border-saffron-300 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0 group-hover:bg-saffron-100">
                      <span className="text-saffron-600">{f.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-saffron-700">{f.format}</p>
                      <p className="text-xs text-gray-400">{f.desc}</p>
                    </div>
                    <Download size={14} className="text-gray-300 group-hover:text-saffron-500 ml-auto mt-1 shrink-0" />
                  </button>
                  );
                })}
              </div>

              <button
                onClick={() => setQrModalProduct(null)}
                className="w-full border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
