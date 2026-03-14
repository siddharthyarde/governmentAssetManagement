"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ClipboardList, Package, Truck, CheckCircle2,
  Clock, AlertCircle, Eye, Download, MapPin, ChevronRight,
  IndianRupee, Calendar, FileText, Building2, Search, Filter,
  ChevronDown, X, MoreVertical, QrCode,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "pending_payment" | "payment_done" | "dispatched" | "delivered" | "cancelled";
type POStatus    = "draft" | "submitted" | "approved" | "fulfilled" | "closed";

interface OrderItem {
  productId:    string;
  productName:  string;
  qty:          number;
  unitPrice:    number;
}

interface Order {
  id:          string;
  poRef:       string;
  institution: string;
  institutionId: string;
  items:       OrderItem[];
  totalValue:  number;
  status:      OrderStatus;
  placedAt:    string;
  dispatchAt?: string;
  deliveredAt?: string;
  trackingId?:  string;
  carrier?:     string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ORDERS: Order[] = [
  {
    id: "ORD-2406-001", poRef: "PO/MEA/2024/0421", institution: "Delhi State Library", institutionId: "GAMS-INST-20240001",
    items: [{ productId: "P001", productName: "Folding Chair — Steel Frame", qty: 500, unitPrice: 320 }],
    totalValue: 160000, status: "dispatched", placedAt: "2024-06-10", dispatchAt: "2024-06-14",
    trackingId: "DTDC789456123", carrier: "DTDC",
  },
  {
    id: "ORD-2406-002", poRef: "PO/MoYAS/2024/0317", institution: "Sports Authority of India, Lucknow", institutionId: "GAMS-INST-20240002",
    items: [
      { productId: "P002", productName: "LED Par Light 100W RGBW", qty: 100, unitPrice: 2800 },
      { productId: "P003", productName: "Modular Stage Platform 2×1m", qty: 50, unitPrice: 3800 },
    ],
    totalValue: 470000, status: "payment_done", placedAt: "2024-06-12",
  },
  {
    id: "ORD-2406-003", poRef: "PO/MoHA/2024/0189", institution: "Rajasthan State Police HQ", institutionId: "GAMS-INST-20240003",
    items: [{ productId: "P004", productName: "Crowd Control Barrier — Steel 2.5m", qty: 200, unitPrice: 750 }],
    totalValue: 150000, status: "delivered", placedAt: "2024-06-05", dispatchAt: "2024-06-09", deliveredAt: "2024-06-12",
    trackingId: "BLUEDART001223", carrier: "BlueDart",
  },
  {
    id: "ORD-2405-011", poRef: "PO/MeitY/2024/0098", institution: "NIXI Data Centre, Noida", institutionId: "GAMS-INST-20240004",
    items: [{ productId: "P005", productName: "Industrial UPS 10 kVA Rack Mount", qty: 10, unitPrice: 42000 }],
    totalValue: 420000, status: "pending_payment", placedAt: "2024-06-08",
  },
  {
    id: "ORD-2405-009", poRef: "PO/MoD/2024/0044", institution: "Border Roads Organisation", institutionId: "GAMS-INST-20240005",
    items: [{ productId: "P001", productName: "Folding Chair — Steel Frame", qty: 1000, unitPrice: 320 }],
    totalValue: 320000, status: "cancelled", placedAt: "2024-06-01",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { createClient } from "@gams/lib/supabase/client";
import type { OrderRow, OrderItemRow } from "@gams/lib/supabase/database.types";

type OrderRowWithItems = OrderRow & { order_items: OrderItemRow[] };

function mapCompanyOrder(row: OrderRowWithItems): Order {
  const statusMap: Record<string, OrderStatus> = {
    pending_payment: "pending_payment",
    payment_received: "payment_done", processing: "payment_done",
    dispatched: "dispatched", delivered: "delivered",
    returned: "cancelled", refunded: "cancelled", cancelled: "cancelled",
  };
  const addr = (row.shipping_address as Record<string, string>) ?? {};
  return {
    id: row.order_number,
    poRef: row.order_number,
    institution: addr.institution_name ?? addr.city ?? "Institution",
    institutionId: row.user_id,
    items: (row.order_items ?? []).map((it) => ({
      productId: it.listing_id,
      productName: "Product",
      qty: it.quantity,
      unitPrice: Math.round(it.unit_price_paise / 100),
    })),
    totalValue: Math.round(row.total_paise / 100),
    status: (statusMap[row.status] as OrderStatus) ?? "pending_payment",
    placedAt: row.created_at.split("T")[0],
    dispatchAt: row.dispatched_at ? row.dispatched_at.split("T")[0] : undefined,
    deliveredAt: row.delivered_at ? row.delivered_at.split("T")[0] : undefined,
    trackingId: row.tracking_number ?? undefined,
    carrier: addr.carrier ?? undefined,
  };
}

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(n % 1_00_000 === 0 ? 0 : 1)}L`;
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `₹${n}`;
}

const STATUS_META: Record<OrderStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending_payment: { label: "Pending Payment", cls: "bg-yellow-100 text-yellow-700", icon: Clock        },
  payment_done:    { label: "Payment Done",    cls: "bg-blue-100 text-blue-700",     icon: CheckCircle2 },
  dispatched:      { label: "Dispatched",      cls: "bg-purple-100 text-purple-700", icon: Truck        },
  delivered:       { label: "Delivered",       cls: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  cancelled:       { label: "Cancelled",       cls: "bg-red-100 text-red-700",       icon: X            },
};

const PIPELINE_STAGES: { key: OrderStatus | "_"; label: string }[] = [
  { key: "pending_payment", label: "Order Placed" },
  { key: "payment_done",    label: "Payment Done" },
  { key: "dispatched",      label: "Dispatched"   },
  { key: "delivered",       label: "Delivered"    },
];

function OrderPipeline({ status }: { status: OrderStatus }) {
  const activeIdx = ["pending_payment", "payment_done", "dispatched", "delivered"].indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {PIPELINE_STAGES.map((stage, i) => {
        const done    = i < activeIdx || (status === stage.key);
        const active  = status === stage.key && status !== "cancelled";
        const colour  = done ? "#138808" : "#E5E7EB";
        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white border-2 transition-colors`} style={{ background: done ? "#138808" : "#fff", borderColor: colour }}>
                {done && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <p className={`text-[9px] mt-1 font-semibold ${active ? "text-green-700" : done ? "text-gray-600" : "text-gray-400"} whitespace-nowrap`}>{stage.label}</p>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <div className="flex-1 h-0.5 mx-1 mb-4" style={{ background: i < activeIdx ? "#138808" : "#E5E7EB" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const meta = STATUS_META[order.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{order.id}</h3>
            <p className="text-xs text-gray-400">{order.poRef}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.cls}`}>{meta.label}</span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-gray-400"><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[75dvh] overflow-y-auto">
          {/* Institution */}
          <div className="flex items-start gap-3 bg-surface border border-border rounded-xl p-3">
            <Building2 size={16} className="text-saffron-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">{order.institution}</p>
              <p className="text-xs text-gray-400">{order.institutionId}</p>
            </div>
          </div>

          {/* Pipeline */}
          {order.status !== "cancelled" && <OrderPipeline status={order.status} />}

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Order Items</p>
            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 border border-border rounded-xl p-3">
                  <Package size={15} className="text-gray-400 shrink-0" />
                  <p className="flex-1 text-sm font-semibold text-gray-900 min-w-0 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500 shrink-0">×{item.qty.toLocaleString("en-IN")}</p>
                  <p className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(item.qty * item.unitPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-900">{formatPrice(order.totalValue)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span className="font-semibold text-gray-900">{formatPrice(Math.round(order.totalValue * 0.18))}</span></div>
            <div className="border-t border-border pt-1.5 flex justify-between"><span className="font-bold text-gray-900">Total Payable</span><span className="font-black text-gray-900">{formatPrice(Math.round(order.totalValue * 1.18))}</span></div>
          </div>

          {/* Logistics */}
          {order.trackingId && (
            <div className="flex flex-col gap-1.5 text-sm">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Logistics</p>
              <div className="flex items-center gap-2"><Truck size={13} className="text-gray-400" /><span className="text-gray-600">Carrier:</span><span className="font-semibold">{order.carrier}</span></div>
              <div className="flex items-center gap-2"><QrCode size={13} className="text-gray-400" /><span className="text-gray-600">Tracking ID:</span><span className="font-mono font-semibold text-saffron-600">{order.trackingId}</span></div>
              {order.dispatchAt  && <div className="flex items-center gap-2"><Calendar size={13} className="text-gray-400" /><span className="text-gray-600">Dispatched:</span><span className="font-semibold">{order.dispatchAt}</span></div>}
              {order.deliveredAt && <div className="flex items-center gap-2"><CheckCircle2 size={13} className="text-green-600" /><span className="text-gray-600">Delivered:</span><span className="font-semibold text-green-700">{order.deliveredAt}</span></div>}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => downloadInvoice(order)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold border border-border rounded-xl py-2.5 text-gray-700 hover:bg-surface">
              <Download size={13} /> Download Invoice
            </button>
            <button onClick={() => downloadQRLabels(order)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold border border-border rounded-xl py-2.5 text-gray-700 hover:bg-surface">
              <QrCode size={13} /> Download QR Labels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function csvDownload(rows: string[][], filename: string) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadInvoice(order: Order) {
  const gst = Math.round(order.totalValue * 0.18);
  const grand = order.totalValue + gst;
  const rows: string[][] = [
    ["GAMS Invoice", "", "", ""],
    ["Order ID", order.id, "PO Ref", order.poRef],
    ["Institution", order.institution, "Institution ID", order.institutionId],
    ["Placed At", order.placedAt, "Status", order.status],
    ["", "", "", ""],
    ["Product ID", "Product Name", "Qty", "Unit Price (₹)", "Line Total (₹)"],
    ...order.items.map((it) => [it.productId, it.productName, String(it.qty), String(it.unitPrice), String(it.qty * it.unitPrice)]),
    ["", "", "", ""],
    ["Subtotal (₹)", String(order.totalValue), "", ""],
    ["GST 18% (₹)", String(gst), "", ""],
    ["Grand Total (₹)", String(grand), "", ""],
  ];
  csvDownload(rows, `Invoice-${order.id}.csv`);
}

function downloadQRLabels(order: Order) {
  const rows: string[][] = [
    ["Order ID", "Product ID", "Product Name", "Qty", "Institution", "QR Ref"],
    ...order.items.map((it) => [
      order.id, it.productId, it.productName,
      String(it.qty), order.institution,
      `QR-${order.id}-${it.productId}`,
    ]),
  ];
  csvDownload(rows, `QR-Labels-${order.id}.csv`);
}

export default function CompanyOrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | "all">("all");
  const [openMenu, setOpenMenu]           = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setOrders((data as unknown as OrderRowWithItems[] ?? []).map(mapCompanyOrder));
        }
      });
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.institution.toLowerCase().includes(search.toLowerCase()) && !o.poRef.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue  = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totalValue, 0);
  const totalDelivered = orders.filter((o) => o.status === "delivered").length;
  const totalDispatched = orders.filter((o) => o.status === "dispatched").length;

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
            <h1 className="text-base font-bold text-gray-900">Orders & Purchase Orders</h1>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Link href="/company/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={10} />
              <span>Orders</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => {
              const headers = ["Order ID", "PO Ref", "Institution", "Items", "Total Value (₹)", "GST 18% (₹)", "Grand Total (₹)", "Status", "Placed At", "Dispatch At", "Delivered At", "Carrier", "Tracking ID"];
              const rows = filtered.map((o) => [
                o.id, o.poRef, o.institution,
                o.items.map((i) => `${i.productName} ×${i.qty}`).join(" | "),
                String(o.totalValue), String(Math.round(o.totalValue * 0.18)), String(Math.round(o.totalValue * 1.18)),
                o.status, o.placedAt, o.dispatchAt ?? "", o.deliveredAt ?? "", o.carrier ?? "", o.trackingId ?? "",
              ]);
              csvDownload([headers, ...rows], `GAMS-Orders-${new Date().toISOString().slice(0, 10)}.csv`);
            }} className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 text-xs text-gray-600 font-semibold hover:bg-surface">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: ClipboardList, label: "Total Orders",       val: orders.length.toString(),               color: "text-saffron-600", bg: "bg-saffron-50"  },
            { icon: IndianRupee,   label: "Total Revenue",      val: formatPrice(totalRevenue),              color: "text-green-600",   bg: "bg-green-50"    },
            { icon: Truck,         label: "Dispatched",         val: totalDispatched.toString(),             color: "text-purple-600",  bg: "bg-purple-50"   },
            { icon: CheckCircle2,  label: "Delivered",          val: totalDelivered.toString(),              color: "text-green-600",   bg: "bg-green-50"    },
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
              className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400"
              placeholder="Search order ID, institution, PO ref…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
              className="border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="payment_done">Payment Done</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders table (desktop) */}
        <div className="hidden md:block bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                {["Order ID / PO Ref", "Institution", "Items", "Value", "Status", "Placed", ""].map((h) => (
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
                      <p className="text-[10px] text-gray-400 mt-0.5">{o.poRef}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 max-w-44 truncate">{o.institution}</p>
                      <p className="text-[10px] text-gray-400">{o.institutionId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.items.length} item{o.items.length > 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(o.totalValue)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{o.placedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-xl hover:opacity-90"
                          style={{ background: "#E07B00" }}
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
                                { icon: Download, label: "Download Invoice", action: () => downloadInvoice(o) },
                                { icon: QrCode,   label: "QR Labels",        action: () => downloadQRLabels(o) },
                                { icon: FileText, label: "PO Certificate",   action: undefined },
                              ].map(({ icon: Icon, label, action }) => (
                                <button key={label} onClick={() => { action?.(); setOpenMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-700 hover:bg-surface font-semibold">
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

        {/* Orders cards (mobile) */}
        <div className="md:hidden flex flex-col gap-3">
          {filtered.map((o) => {
            const meta = STATUS_META[o.status];
            return (
              <div key={o.id} className="bg-white border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono font-bold text-gray-900 text-xs">{o.id}</p>
                    <p className="text-[10px] text-gray-400">{o.poRef}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">{o.institution}</p>
                <p className="text-xs text-gray-400 mb-3">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {formatPrice(o.totalValue)} · {o.placedAt}</p>
                {o.status !== "cancelled" && <OrderPipeline status={o.status} />}
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="mt-3 w-full text-white text-xs font-bold py-2 rounded-xl hover:opacity-90"
                  style={{ background: "#E07B00" }}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-border rounded-2xl">
            <ClipboardList size={36} className="text-gray-200 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No orders found</p>
            <p className="text-sm text-gray-400">Try adjusting the search or status filter</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {openMenu && <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />}
    </div>
  );
}
