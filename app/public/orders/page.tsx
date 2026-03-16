"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  Package, ChevronLeft, ChevronRight, Truck,
  CheckCircle, Clock, AlertCircle, Search,
  Download, Star, RefreshCw, X,
} from "lucide-react";

// ─── Order status config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode; step: number }> = {
  pending_payment:  { label: "Awaiting Payment",  cls: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={12} />, step: 0 },
  payment_received: { label: "Payment Confirmed", cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <CheckCircle size={12} />, step: 1 },
  processing:       { label: "Processing",         cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <RefreshCw size={12} />, step: 2 },
  dispatched:       { label: "Dispatched",         cls: "bg-saffron-50 text-saffron-700 border-saffron-200", icon: <Truck size={12} />, step: 3 },
  delivered:        { label: "Delivered",          cls: "bg-green-50 text-green-700 border-green-200",   icon: <CheckCircle size={12} />, step: 4 },
  cancelled:        { label: "Cancelled",          cls: "bg-red-50 text-red-700 border-red-200",         icon: <X size={12} />, step: -1 },
  returned:         { label: "Returned",           cls: "bg-gray-50 text-gray-700 border-gray-200",      icon: <AlertCircle size={12} />, step: -1 },
  refunded:         { label: "Refunded",           cls: "bg-green-50 text-green-700 border-green-200",   icon: <CheckCircle size={12} />, step: -1 },
};

const TRACKER_STEPS = ["Payment", "Confirmed", "Processing", "Dispatched", "Delivered"];

type OrderItem = {
  id: string;
  quantity: number;
  unit_price_paise: number;
  redistribution_listings?: {
    product_instances?: {
      products?: { name: string; category: string };
    };
  };
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_paise: number;
  created_at: string;
  shipping_address: Record<string, string> | null;
  order_items: OrderItem[];
};

// ─── Order Tracker ────────────────────────────────────────────────────────────

function OrderTracker({ status }: { status: string }) {
  const step = STATUS_CONFIG[status]?.step ?? 0;
  if (step < 0) return null;

  return (
    <div className="my-5 px-2">
      <div className="relative flex items-center justify-between">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#E2E2DC] z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-saffron-500 z-0 transition-all duration-500"
          style={{ width: `${(step / (TRACKER_STEPS.length - 1)) * 100}%` }}
        />
        {TRACKER_STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${
              i <= step
                ? "bg-saffron-500 border-saffron-500 text-white"
                : "bg-white border-[#E2E2DC] text-[#9A9A9A]"
            }`}>
              {i < step ? <CheckCircle size={14} stroke="white" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold ${i <= step ? "text-saffron-700" : "text-[#9A9A9A]"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({ order, expanded, onToggle }: { order: Order; expanded: boolean; onToggle: () => void }) {
  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment;

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-saffron-200 transition-colors">
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left px-5 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider">Order</span>
              <span className="text-sm font-black text-[#1A1A1A]">#{order.order_number}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sc.cls}`}>
                {sc.icon} {sc.label}
              </span>
            </div>
            <p className="text-xs text-[#9A9A9A] mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}{order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-lg font-bold text-[#1A1A1A]">₹{(order.total_paise / 100).toLocaleString("en-IN")}</p>
            <ChevronRight size={14} className={`text-[#9A9A9A] transition-transform ${expanded ? "rotate-90" : ""}`} />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <OrderTracker status={order.status} />

          {/* Items */}
          <div className="space-y-3 mb-4">
            <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider">Order Items</p>
            {order.order_items.map((item) => {
              const prod = item.redistribution_listings?.product_instances?.products;
              return (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shrink-0">
                    <Package size={20} className="text-[#9A9A9A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{prod?.name || "Government Asset"}</p>
                    <p className="text-xs text-[#7A7A7A]">{prod?.category} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1A1A1A] shrink-0">
                    ₹{(item.unit_price_paise / 100 * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="bg-surface rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-1.5">Delivering to</p>
              <p className="text-sm text-[#3D3D3D]">
                {[order.shipping_address.name, order.shipping_address.line1, order.shipping_address.line2, order.shipping_address.city, order.shipping_address.state, order.shipping_address.pincode].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-saffron-600 border border-saffron-200 hover:bg-saffron-50 px-3 py-2 rounded-xl transition-colors">
              <Download size={12} /> Download Invoice
            </button>
            {order.status === "delivered" && (
              <button className="flex items-center gap-1.5 text-xs font-semibold text-green-600 border border-green-200 hover:bg-green-50 px-3 py-2 rounded-xl transition-colors">
                <Star size={12} /> Rate & Review
              </button>
            )}
            {["pending_payment", "payment_received", "processing"].includes(order.status) && (
              <button className="flex items-center gap-1.5 text-xs font-semibold text-danger border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors">
                <X size={12} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = [
  { label: "All Orders",  value: "all" },
  { label: "Active",      value: "active" },
  { label: "Delivered",   value: "delivered" },
  { label: "Cancelled",   value: "cancelled" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { window.location.href = "/public/login?next=/public/orders"; return; }

      const { data } = await db
        .from("orders")
        .select(`
          id, order_number, status, total_paise, created_at, shipping_address,
          order_items (
            id, quantity, unit_price_paise,
            redistribution_listings (
              product_instances (
                products ( name, category )
              )
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as unknown as Order[]) || []);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = search === "" || o.order_number.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "active" ? ["payment_received", "processing", "dispatched"].includes(o.status) :
      filter === "delivered" ? o.status === "delivered" :
      filter === "cancelled" ? ["cancelled", "refunded", "returned"].includes(o.status) : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-dvh bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
          <Link href="/public/account" className="flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-saffron-600 font-medium transition-colors">
            <ChevronLeft size={16} /> My Account
          </Link>
          <span className="text-[#D0D0C8]">/</span>
          <h1 className="text-sm font-bold text-[#1A1A1A]">My Orders</h1>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-xl bg-white focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  filter === f.value
                    ? "bg-saffron-500 text-white border-saffron-500"
                    : "bg-white text-[#5A5A5A] border-border hover:border-saffron-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-border" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center">
            <Package size={48} className="mx-auto text-[#C0C0B8] mb-4" />
            <p className="text-lg font-bold text-[#3D3D3D]">
              {orders.length === 0 ? "No orders yet" : "No orders match your filter"}
            </p>
            <p className="text-sm text-[#9A9A9A] mt-1">
              {orders.length === 0
                ? "Browse the marketplace to find government-rated assets at fair prices."
                : "Try a different filter or search term."}
            </p>
            {orders.length === 0 && (
              <Link href="/public/marketplace" className="mt-5 inline-flex btn-primary text-sm">
                Browse Marketplace
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedId === order.id}
                onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-[#9A9A9A] text-center mt-6">
          Showing {filtered.length} of {orders.length} orders
        </p>
      </div>

      <footer className="border-t border-border bg-white mt-8 py-4 text-center text-xs text-[#9A9A9A]">
        © 2026 Ministry of Finance, Government of India · GAMS Citizen Marketplace
      </footer>
    </div>
  );
}
