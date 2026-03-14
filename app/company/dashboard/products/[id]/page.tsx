"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package, ArrowLeft, CheckCircle2, Clock, XCircle, QrCode,
  Edit2, Save, X, FileText, IndianRupee, Layers, Calendar,
  BarChart3, Download, Trash2, AlertTriangle, Info,
  LayoutDashboard, ShoppingCart, Settings, BadgeCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = "approved" | "pending" | "rejected";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  qty: number;
  unitPrice: number;
  status: ProductStatus;
  qrReady: boolean;
  qrCount: number;
  created: string;
  event?: string;
  description: string;
  hsn: string;
  brand: string;
  model: string;
  specs: string;
  warrantyMonths: number;
  countryOfOrigin: string;
  makeInIndia: boolean;
  gemRegistered: boolean;
  gemId?: string;
  docs: number;
  rejectionReason?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const PRODUCTS: Record<string, Product> = {
  "PRD-2024-00341": {
    id: "PRD-2024-00341", name: "Folding Chairs — Steel Frame, Black Fabric", category: "Furniture", subcategory: "Seating",
    qty: 5000, unitPrice: 2400, status: "approved", qrReady: true, qrCount: 5000, created: "12 Jun 2024",
    event: "Republic Day 2025 — New Delhi",
    description: "Heavy-duty folding chairs with powder-coated steel frame and high-density foam seat. Stackable up to 8 units. Suitable for outdoor and indoor events. ISI marked.",
    hsn: "9401890", brand: "Arjuna Furniture", model: "AF-FC-2024", specs: "Width: 48 cm | Depth: 52 cm | Height: 82 cm | Weight: 6.2 kg | Load: 150 kg",
    warrantyMonths: 12, countryOfOrigin: "India", makeInIndia: true, gemRegistered: true, gemId: "GEM/2024/B/AF00341", docs: 5,
  },
  "PRD-2024-00298": {
    id: "PRD-2024-00298", name: "Plastic Tables — 6ft, White Laminate", category: "Furniture", subcategory: "Tables",
    qty: 2000, unitPrice: 3800, status: "approved", qrReady: true, qrCount: 2000, created: "08 Jun 2024",
    event: "Republic Day 2025 — New Delhi",
    description: "6-foot rectangular folding tables with white laminate top and UV-treated plastic frame. Weatherproof. Suitable for government events nationwide.",
    hsn: "9403200", brand: "Arjuna Furniture", model: "AF-PT-6F", specs: "Length: 183 cm | Width: 76 cm | Height: 74 cm | Weight: 12 kg | Capacity: 200 kg",
    warrantyMonths: 24, countryOfOrigin: "India", makeInIndia: true, gemRegistered: true, gemId: "GEM/2024/B/AF00298", docs: 4,
  },
  "PRD-2024-00412": {
    id: "PRD-2024-00412", name: "Outdoor Tent — 10×10 ft, UV Resistant", category: "Infrastructure", subcategory: "Tents & Canopies",
    qty: 500, unitPrice: 38000, status: "pending", qrReady: false, qrCount: 0, created: "18 Jun 2024",
    description: "Pop-up canopy tent with UV-resistant 600D polyester top, heavy powder-coated steel frame. Easy assembly without tools.",
    hsn: "6306220", brand: "Arjuna Furniture", model: "AF-OT-1010", specs: "Size: 10×10 ft | Height: 8.5 ft | Frame: Steel 40mm | Material: 600D Polyester",
    warrantyMonths: 6, countryOfOrigin: "India", makeInIndia: true, gemRegistered: false, docs: 3,
  },
  "PRD-2024-00271": {
    id: "PRD-2024-00271", name: "Public Address System — 1000W, 8-channel", category: "Electronics", subcategory: "Audio Equipment",
    qty: 100, unitPrice: 85000, status: "rejected", qrReady: false, qrCount: 0, created: "02 Jun 2024",
    description: "Professional-grade 1000W public address system with 8-channel mixing console, power amplifiers, and full-range speaker arrays.",
    hsn: "8518400", brand: "Arjuna Furniture", model: "AF-PA-1000", specs: "Power: 1000W RMS | Channels: 8 | Frequency: 40Hz–20kHz | SNR: ≥90dB",
    warrantyMonths: 12, countryOfOrigin: "China", makeInIndia: false, gemRegistered: false, docs: 2,
    rejectionReason: "Technical specifications sheet does not meet the minimum SNR requirement of 95dB specified in the tender document.",
  },
};

// Fallback product for unknown IDs (e.g., if linked from products list with a new ID)
const FALLBACK: Product = {
  id: "PRD-UNKNOWN", name: "Product Not Found", category: "—", subcategory: "—",
  qty: 0, unitPrice: 0, status: "pending", qrReady: false, qrCount: 0, created: "—",
  description: "This product could not be found.", hsn: "—", brand: "—", model: "—", specs: "—",
  warrantyMonths: 0, countryOfOrigin: "—", makeInIndia: false, gemRegistered: false, docs: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProductStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  approved: { label: "Approved",     cls: "bg-green-50 text-green-700 border-green-200",   icon: <CheckCircle2 size={12} /> },
  pending:  { label: "Under Review", cls: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={12} /> },
  rejected: { label: "Rejected",     cls: "bg-red-50 text-red-700 border-red-200",          icon: <XCircle size={12} /> },
};

const NAV = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/dashboard/products",  icon: Package,         label: "My Products"    },
  { href: "/dashboard/orders",    icon: ShoppingCart,    label: "Orders & POs"   },
  { href: "/dashboard/documents", icon: FileText,        label: "Documents"      },
  { href: "/dashboard/settings",  icon: Settings,        label: "Account Settings" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DOC_NAMES = [
  "Product Specification Sheet",
  "Quality Certificate",
  "GST Invoice Sample",
  "ISI / BIS Certificate",
  "Manufacturer Declaration",
];

function downloadDoc(doc: string, product: Product) {
  const content = [
    `GOVERNMENT ASSET MANAGEMENT SYSTEM`,
    `Document: ${doc}`,
    ``,
    `Product ID   : ${product.id}`,
    `Product Name : ${product.name}`,
    `Category     : ${product.category} / ${product.subcategory}`,
    `Brand / Model: ${product.brand} — ${product.model}`,
    `HSN Code     : ${product.hsn}`,
    `Specifications: ${product.specs}`,
    `Country of Origin: ${product.countryOfOrigin}`,
    `Make in India: ${product.makeInIndia ? "Yes" : "No"}`,
    `GeM Registered: ${product.gemRegistered ? "Yes — " + (product.gemId ?? "") : "No"}`,
    `Warranty     : ${product.warrantyMonths} months`,
    ``,
    `[This is a placeholder document for demonstration purposes.]`,
    `[In production, this file would be retrieved from secure document storage.]`,
    ``,
    `Generated: ${new Date().toLocaleString("en-IN")}`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${doc.replace(/[^a-z0-9]/gi, "-")}-${product.id}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadAllDocs(product: Product) {
  const docs = DOC_NAMES.slice(0, product.docs);
  docs.forEach((doc, i) => setTimeout(() => downloadDoc(doc, product), i * 200));
}

// ─── Field helper ───────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>(PRODUCTS[id] ?? { ...FALLBACK, id });

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft]       = useState<Product>(product);
  const [showDelete, setShowDelete] = useState(false);

  const sc = STATUS_CONFIG[product.status];

  function saveEdit() {
    setProduct(draft);
    setEditMode(false);
  }
  function cancelEdit() {
    setDraft(product);
    setEditMode(false);
  }

  const totalValue = (product.qty * product.unitPrice).toLocaleString("en-IN");

  return (
    <div className="min-h-dvh bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-border shrink-0">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-widest">GAMS · Company Portal</p>
          <p className="text-sm font-bold text-[#1A1A1A]">Arjuna Furniture Pvt Ltd</p>
        </div>
        <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                href === "/dashboard/products"
                  ? "bg-saffron-50 text-saffron-700 font-bold"
                  : "text-gray-500 hover:bg-surface"
              }`}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tiranga */}
        <div className="h-1 w-full shrink-0" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-6 py-3 flex items-center gap-4 shrink-0">
          <Link href="/company/dashboard/products" className="p-2 rounded-lg border border-border hover:bg-surface">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">
                <Link href="/company/dashboard/products" className="hover:underline">My Products</Link> /
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.cls}`}>
                {sc.icon} {sc.label}
              </span>
            </div>
            <h1 className="text-sm font-bold text-gray-900 truncate mt-0.5">{product.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            {!editMode ? (
              <>
                <button
                  onClick={() => { setDraft(product); setEditMode(true); }}
                  disabled={product.status === "approved"}
                  className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border border-border hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                  title={product.status === "approved" ? "Approved products cannot be edited" : "Edit product"}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </>
            ) : (
              <>
                <button onClick={saveEdit} className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl bg-saffron-500 text-white hover:bg-saffron-600">
                  <Save size={13} /> Save
                </button>
                <button onClick={cancelEdit} className="flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-xl border border-border hover:bg-surface">
                  <X size={13} /> Cancel
                </button>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl">

          {/* Rejection notice */}
          {product.status === "rejected" && product.rejectionReason && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
              <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-0.5">Product Rejected</p>
                <p className="text-sm text-red-600">{product.rejectionReason}</p>
                <Link href="/company/dashboard/products/new" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-red-700 hover:underline">
                  Submit a revised product →
                </Link>
              </div>
            </div>
          )}

          {/* Pending notice */}
          {product.status === "pending" && (
            <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
              <Clock size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-700 mb-0.5">Under Review</p>
                <p className="text-sm text-yellow-600">This product is being reviewed by the GAMS admin team. QR codes will be generated upon approval.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: main details */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Basic Info card */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Product Information</h2>
                {editMode ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Product Name *</label>
                      <input
                        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                        <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">HSN Code</label>
                        <input className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" value={draft.hsn} onChange={(e) => setDraft({ ...draft, hsn: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                      <textarea rows={3} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 resize-none" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Technical Specifications</label>
                      <textarea rows={2} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400 resize-none" value={draft.specs} onChange={(e) => setDraft({ ...draft, specs: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Name</p>
                      <p className="text-base font-bold text-gray-900">{product.name}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Field label="Category"    value={product.category} />
                      <Field label="Subcategory" value={product.subcategory} />
                      <Field label="HSN Code"    value={product.hsn} />
                      <Field label="Brand"       value={product.brand} />
                      <Field label="Model"       value={product.model} />
                      <Field label="Warranty"    value={`${product.warrantyMonths} months`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Specifications</p>
                      <p className="text-sm font-mono text-gray-700 bg-surface rounded-xl px-3 py-2">{product.specs}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Manufacturing & Compliance */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Compliance & Origin</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Country of Origin"  value={product.countryOfOrigin} />
                  <Field label="Make in India"       value={product.makeInIndia ? "✓ Yes" : "✗ No"} />
                  <Field label="GeM Registered"     value={product.gemRegistered ? "✓ Yes" : "✗ No"} />
                  {product.gemId && <Field label="GeM ID" value={product.gemId} />}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider">Supporting Documents</h2>
                  <button onClick={() => downloadAllDocs(product)} className="flex items-center gap-1.5 text-xs font-bold text-saffron-600 hover:text-saffron-700">
                    <Download size={12} /> Download All
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {DOC_NAMES.slice(0, product.docs).map((doc) => (
                    <div key={doc} className="flex items-center justify-between px-3 py-2.5 border border-border rounded-xl hover:bg-surface">
                      <div className="flex items-center gap-2">
                        <FileText size={13} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{doc}</span>
                        <CheckCircle2 size={12} className="text-green-500" />
                      </div>
                      <button onClick={() => downloadDoc(doc, product)} className="text-xs font-bold text-saffron-600 hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: pricing, QR, event */}
            <div className="flex flex-col gap-5">

              {/* Pricing card */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Pricing & Quantity</h2>
                {editMode ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Quantity *</label>
                      <input type="number" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Unit Price (₹) *</label>
                      <input type="number" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400" value={draft.unitPrice} onChange={(e) => setDraft({ ...draft, unitPrice: Number(e.target.value) })} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="bg-saffron-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-saffron-600 font-bold uppercase tracking-wider">Total Value</p>
                      <p className="text-2xl font-black text-saffron-700">₹{totalValue}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-surface border border-border rounded-xl p-2.5">
                        <p className="text-[10px] text-gray-400 font-bold">Qty</p>
                        <p className="text-lg font-black text-gray-900">{product.qty.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="bg-surface border border-border rounded-xl p-2.5">
                        <p className="text-[10px] text-gray-400 font-bold">Unit Price</p>
                        <p className="text-lg font-black text-gray-900">₹{product.unitPrice.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center">Listed on {product.created}</p>
                  </div>
                )}
              </div>

              {/* QR Codes card */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">QR Codes</h2>
                {product.qrReady ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 size={14} />
                      <span className="text-sm font-bold">{product.qrCount.toLocaleString("en-IN")} QR codes ready</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/company/dashboard/qr-codes"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-saffron-50 text-saffron-700 border border-saffron-200 text-sm font-bold hover:bg-saffron-100"
                      >
                        <QrCode size={13} /> View QR Codes
                      </Link>
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface">
                        <Download size={13} /> Download Labels
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 text-center">
                    <QrCode size={28} className="mx-auto text-gray-300 mb-1" />
                    <p className="text-sm font-semibold text-gray-500">
                      {product.status === "approved" ? "Generating QR codes…" : "QR codes will be generated after approval"}
                    </p>
                  </div>
                )}
              </div>

              {/* Event Assignment */}
              {product.event && (
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Event Assignment</h2>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-saffron-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-gray-800">{product.event}</p>
                  </div>
                  <Link href="/company/dashboard/orders" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-saffron-600 hover:underline">
                    View order → 
                  </Link>
                </div>
              )}

              {/* Quick actions */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="flex flex-col gap-2">
                  <Link href="/company/dashboard/products" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <Package size={13} className="text-gray-400" /> All Products
                  </Link>
                  <Link href="/company/dashboard/products/new" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <Layers size={13} className="text-gray-400" /> Submit New Product
                  </Link>
                  <Link href="/company/dashboard/documents" className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-semibold text-gray-700 hover:bg-surface">
                    <FileText size={13} className="text-gray-400" /> Manage Documents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-600" />
              </div>
              <h3 className="text-sm font-black text-gray-900 text-center mb-1">Delete Product</h3>
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-gray-600 hover:bg-surface"
              >
                Cancel
              </button>
              <Link
                href="/company/dashboard/products"
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700"
              >
                Delete
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
