"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, CheckCircle2, Truck, Clock,
  X, Eye, Download, Package, QrCode, ChevronRight,
  Search, Filter, ChevronDown, MoreVertical, Star,
  TrendingDown, IndianRupee, Calendar, FileText,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";
import type { OrderRow, OrderItemRow } from "@gams/lib/supabase/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending_approval" | "approved" | "dispatched" | "delivered" | "cancelled";

interface OrderItem {
  productName: string;
  qty:          number;
  unitPrice:    number;
  originalPrice: number;
}

interface BuyerOrder {
  id:          string;
  poRef:       string;
  supplier:    string;
  supplierId:  string;
  items:       OrderItem[];
  totalPayable: number;
  totalSavings: number;
  status:      OrderStatus;
  placedAt:    string;
  dispatchAt?:  string;
  deliveredAt?: string;
  trackingId?:  string;
  carrier?:     string;
  purpose:      string;
}

// ─── DB → UI Mapper ─────────────────────────────────────────────────────────

type OrderRowWithItems = OrderRow & { order_items: OrderItemRow[] };

function mapOrderRow(row: OrderRowWithItems): BuyerOrder {
  const statusMap: Record<string, OrderStatus> = {
    pending_payment: "pending_approval",
    payment_received: "approved",
    processing: "approved",
    dispatched: "dispatched",
    delivered: "delivered",
    returned: "cancelled",
    refunded: "cancelled",
    cancelled: "cancelled",
  };
  const addr = (row.shipping_address as Record<string, string>) ?? {};
  return {
    id: row.order_number,
    poRef: row.order_number,
    supplier: "—",
    supplierId: "—",
    items: (row.order_items ?? []).map((item) => ({
      productName: item.listing_id ?? "—",
      qty: item.quantity,
      unitPrice: Math.round(item.unit_price_paise / 100),
      originalPrice: Math.round(item.unit_price_paise / 100),
    })),
    totalPayable: Math.round(row.total_paise / 100),
    totalSavings: 0,
    status: (statusMap[row.status] as OrderStatus) ?? "pending_approval",
    placedAt: row.created_at.split("T")[0],
    dispatchAt: row.dispatched_at?.split("T")[0],
    deliveredAt: row.delivered_at?.split("T")[0],
    trackingId: row.tracking_number ?? undefined,
    carrier: addr.carrier ?? undefined,
    purpose: (row.notes ?? "Order via GAMS Marketplace"),
  };
}

// ─── Mock Data (fallback while loading) ──────────────────────────────────────

const ORDERS: BuyerOrder[] = [
  {
    id: "ORD-2406-001", poRef: "PO/MEA/2024/0421",
    supplier: "Arjuna Furniture Pvt. Ltd.", supplierId: "GAMS-SUP-20230042",
    items: [{ productName: "Folding Chair — Steel Frame, Black Fabric", qty: 500, unitPrice: 320, originalPrice: 2400 }],
    totalPayable: 160000, totalSavings: 1040000,
    status: "dispatched", placedAt: "2024-06-10", dispatchAt: "2024-06-14",
    trackingId: "DTDC789456123", carrier: "DTDC",
    purpose: "State library reading room and event hall seating upgrade",
  },
  {
    id: "ORD-2406-002", poRef: "PO/MoD/2024/0788",
    supplier: "Vega AV Systems Pvt. Ltd.", supplierId: "GAMS-SUP-20230078",
    items: [{ productName: "LED Par Light 100W RGBW — Stage Grade", qty: 100, unitPrice: 2800, originalPrice: 12000 }],
    totalPayable: 280000, totalSavings: 920000,
    status: "approved", placedAt: "2024-06-12",
    purpose: "Annual day function lighting setup for district offices",
  },
  {
    id: "ORD-2405-009", poRef: "PO/MoHA/2024/0189",
    supplier: "SafeGuard Equipment Ltd.", supplierId: "GAMS-SUP-20240011",
    items: [{ productName: "Portable Fire Extinguisher CO2 10kg", qty: 50, unitPrice: 1800, originalPrice: 6800 }],
    totalPayable: 90000, totalSavings: 250000,
    status: "delivered", placedAt: "2024-06-02", dispatchAt: "2024-06-06", deliveredAt: "2024-06-10",
    trackingId: "BLUEDART554321", carrier: "BlueDart",
    purpose: "Annual fire safety compliance for 5 district government offices",
  },
  {
    id: "ORD-2405-007", poRef: "PO/MeitY/2024/0098",
    supplier: "BharatTech Solutions LLP", supplierId: "GAMS-SUP-20240002",
    items: [{ productName: "Industrial UPS 10 kVA Rack Mount", qty: 5, unitPrice: 42000, originalPrice: 160000 }],
    totalPayable: 210000, totalSavings: 590000,
    status: "pending_approval", placedAt: "2024-06-09",
    purpose: "Server room power backup for state IT infrastructure",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function csvDownload(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadBuyerInvoice(order: BuyerOrder) {
  const gst = Math.round(order.totalPayable * 0.18);
  const grand = order.totalPayable + gst;
  const rows: string[][] = [
    ["GAMS Invoice — Institution Copy", "", "", "", ""],
    ["Order ID", order.id, "PO Ref", order.poRef, ""],
    ["Supplier", order.supplier, "Supplier ID", order.supplierId, ""],
    ["Placed At", order.placedAt, "Status", order.status, ""],
    ["", "", "", "", ""],
    ["Product Name", "Qty", "Unit Price (\u20b9)", "Original Price (\u20b9)", "Line Total (\u20b9)"],
    ...order.items.map((it) => [it.productName, String(it.qty), String(it.unitPrice), String(it.originalPrice), String(it.qty * it.unitPrice)]),
    ["", "", "", "", ""],
    ["Sub-Total (\u20b9)", String(order.totalPayable), "", "", ""],
    ["GST 18% (\u20b9)", String(gst), "", "", ""],
    ["Grand Total (\u20b9)", String(grand), "", "", ""],
    ["Total Savings (\u20b9)", String(order.totalSavings), "", "", ""],
  ];
  csvDownload(rows, `Invoice-${order.id}.csv`);
}

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n}`;
}

const STATUS_META: Record<OrderStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending_approval: { label: "Pending Approval", cls: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved:         { label: "Approved",         cls: "bg-blue-100 text-blue-700",     icon: CheckCircle2 },
  dispatched:       { label: "Dispatched",       cls: "bg-purple-100 text-purple-700", icon: Truck },
  delivered:        { label: "Delivered",        cls: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  cancelled:        { label: "Cancelled",        cls: "bg-red-100 text-red-700",       icon: X },
};

function OrderPipeline({ status }: { status: OrderStatus }) {
  const stages: { key: OrderStatus; label: string }[] = [
    { key: "pending_approval", label: "Requested" },
    { key: "approved",         label: "Approved"  },
    { key: "dispatched",       label: "Dispatched" },
    { key: "delivered",        label: "Delivered"  },
  ];
  const idx = stages.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center mt-3">
      {stages.map((stage, i) => (
        <React.Fragment key={stage.key}>
          <div className="flex flex-col items-center">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors"
              style={{ background: i <= idx ? "#138808" : "#fff", borderColor: i <= idx ? "#138808" : "#E5E7EB" }}
            >
              {i <= idx && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <p className={`text-[9px] mt-1 font-semibold whitespace-nowrap ${i === idx ? "text-green-700" : i < idx ? "text-gray-600" : "text-gray-400"}`}>
              {stage.label}
            </p>
          </div>
          {i < stages.length - 1 && (
            <div className="flex-1 h-0.5 mx-1 mb-4" style={{ background: i < idx ? "#138808" : "#E5E7EB" }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: BuyerOrder; onClose: () => void }) {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating]         = useState(0);
  const [review, setReview]         = useState("");
  const [reviewed, setReviewed]     = useState(false);
  const meta = STATUS_META[order.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{order.id}</h3>
            <p className="text-xs text-gray-400">{order.poRef}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.cls}`}>{meta.label}</span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[75dvh] overflow-y-auto">
          {/* Pipeline */}
          {order.status !== "cancelled" && <OrderPipeline status={order.status} />}

          {/* Supplier */}
          <div className="bg-surface border border-border rounded-xl p-3 text-sm">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Supplier</p>
            <p className="font-bold text-gray-900">{order.supplier}</p>
            <p className="text-xs text-gray-400">{order.supplierId}</p>
          </div>

          {/* Purpose */}
          <div className="bg-surface border border-border rounded-xl p-3 text-sm">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Order Purpose</p>
            <p className="text-gray-700">{order.purpose}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border border-border rounded-xl p-3 mb-2 last:mb-0">
                <Package size={15} className="text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">×{item.qty} units · {formatPrice(item.unitPrice)}/unit</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{formatPrice(item.qty * item.unitPrice)}</p>
                  <p className="text-xs text-gray-400 line-through">{formatPrice(item.qty * item.originalPrice)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Savings summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Total Payable</span><span className="font-bold">{formatPrice(order.totalPayable)}</span></div>
            <div className="flex justify-between text-green-700"><span>You Saved</span><span className="font-bold">{formatPrice(order.totalSavings)}</span></div>
          </div>

          {/* Logistics */}
          {order.trackingId && (
            <div className="flex flex-col gap-1.5 text-sm">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Logistics</p>
              <div className="flex gap-2"><Truck size={13} className="text-gray-400 shrink-0 mt-0.5" /><span><span className="text-gray-500">Carrier:</span> <span className="font-semibold">{order.carrier}</span></span></div>
              <div className="flex gap-2"><QrCode size={13} className="text-gray-400 shrink-0 mt-0.5" /><span><span className="text-gray-500">Tracking:</span> <span className="font-mono font-semibold text-green-700">{order.trackingId}</span></span></div>
              {order.deliveredAt && <div className="flex gap-2"><CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" /><span><span className="text-gray-500">Delivered:</span> <span className="font-semibold text-green-700">{order.deliveredAt}</span></span></div>}
            </div>
          )}

          {/* Review (delivered only) */}
          {order.status === "delivered" && !reviewed && (
            showReview ? (
              <div className="border border-border rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm font-bold text-gray-900">Rate this order</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setRating(n)}>
                      <Star size={20} className={n <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full border border-border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none"
                  rows={2}
                  placeholder="Share your experience with this product and supplier…"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  onClick={() => { if (rating > 0) setReviewed(true); }}
                  disabled={rating === 0}
                  className="text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-40 hover:opacity-90"
                  style={{ background: "#138808" }}
                >
                  Submit Review
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReview(true)}
                className="flex items-center justify-center gap-2 text-sm font-semibold border border-green-300 text-green-700 py-2.5 rounded-xl hover:bg-green-50"
              >
                <Star size={14} /> Rate & Review This Order
              </button>
            )
          )}
          {reviewed && (
            <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <CheckCircle2 size={15} className="text-green-600" /> Review submitted. Thank you!
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => downloadBuyerInvoice(order)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold border border-border rounded-xl py-2.5 text-gray-700 hover:bg-surface">
              <Download size={13} /> Invoice
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 text-xs font-bold border border-border rounded-xl py-2.5 text-gray-400 cursor-not-allowed" title="PDF certificate requires server-side generation">
              <FileText size={13} /> PO Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerOrdersPage() {
  const [orders, setOrders]               = useState<BuyerOrder[]>(ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | "all">("all");
  const [openMenu, setOpenMenu]           = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        setOrders((data as unknown as OrderRowWithItems[]).map(mapOrderRow));
      }
    });
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.supplier.toLowerCase().includes(search.toLowerCase()) && !o.poRef.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSavings  = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalSavings, 0);
  const totalSpend    = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalPayable, 0);

  return (
    <div className="min-h-dvh bg-surface">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl border border-border hover:bg-surface text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">My Orders</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={10} />
              <span>Orders</span>
            </div>
          </div>
          <div className="ml-auto">
            <Link
              href="/dashboard/marketplace"
              className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90"
              style={{ background: "#138808" }}
            >
              <ShoppingCart size={13} /> Browse Marketplace
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: ShoppingCart,  label: "Total Orders",    val: ORDERS.length.toString(),               color: "text-green-600",  bg: "bg-green-50"  },
            { icon: IndianRupee,   label: "Total Spent",     val: formatPrice(totalSpend),                color: "text-gray-600",   bg: "bg-surface"   },
            { icon: TrendingDown,  label: "Total Saved",     val: formatPrice(totalSavings),              color: "text-green-600",  bg: "bg-green-50"  },
            { icon: CheckCircle2,  label: "Delivered",       val: ORDERS.filter((o) => o.status === "delivered").length.toString(), color: "text-green-600", bg: "bg-green-50" },
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

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ "--tw-ring-color": "#138808" } as React.CSSProperties}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="hidden md:block bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                {["Order ID", "Supplier", "Items", "Spent", "Saved", "Status", "Placed", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const meta = STATUS_META[o.status];
                return (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-gray-900 text-xs">{o.id}</p>
                      <p className="text-[10px] text-gray-400">{o.poRef}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-40 truncate text-xs font-semibold">{o.supplier}</td>
                    <td className="px-4 py-3 text-gray-600">{o.items.length}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(o.totalPayable)}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{formatPrice(o.totalSavings)}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{o.placedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl hover:opacity-90"
                          style={{ background: "#138808" }}
                        >
                          <Eye size={11} /> View
                        </button>
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === o.id ? null : o.id)} className="p-1.5 rounded-xl hover:bg-surface text-gray-400">
                            <MoreVertical size={14} />
                          </button>
                          {openMenu === o.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-10 py-1 min-w-36">
                              {[
                                { icon: Download, label: "Invoice",     action: (o: BuyerOrder) => downloadBuyerInvoice(o) },
                                { icon: FileText, label: "PO Document", action: undefined },
                                { icon: QrCode,   label: "QR Labels",   action: undefined },
                              ].map(({ icon: Icon, label, action }) => (
                                <button key={label} onClick={() => { action?.(o); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-surface font-semibold">
                                  <Icon size={12} /> {label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden flex flex-col gap-3">
          {filtered.map((o) => {
            const meta = STATUS_META[o.status];
            return (
              <div key={o.id} className="bg-white border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-mono font-bold text-gray-900 text-xs">{o.id}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">{o.supplier}</p>
                <p className="text-xs text-gray-400 mb-1">{o.items.length} item · spent {formatPrice(o.totalPayable)} · saved {formatPrice(o.totalSavings)}</p>
                {o.status !== "cancelled" && <OrderPipeline status={o.status} />}
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="mt-3 w-full text-white text-xs font-bold py-2 rounded-xl hover:opacity-90"
                  style={{ background: "#138808" }}
                >
                  View Order Details
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-border rounded-2xl">
            <ShoppingCart size={36} className="text-gray-200 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No orders found</p>
            <p className="text-sm text-gray-400 mb-4">Browse the marketplace to place your first order</p>
            <Link href="/dashboard/marketplace" className="text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90" style={{ background: "#138808" }}>
              Go to Marketplace
            </Link>
          </div>
        )}
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {openMenu && <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
