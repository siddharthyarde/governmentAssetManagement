"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@gams/lib/supabase/client";
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  ChevronRight, Shield, CheckCircle, Clock, Truck,
  Star, Phone, Mail, IndianRupee, AlertCircle,
  Edit3, Bell, FileText, Download,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Account Nav ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",  icon: User,        label: "My Profile" },
  { id: "orders",    icon: Package,     label: "My Orders" },
  { id: "wishlist",  icon: Heart,       label: "Wishlist" },
  { id: "addresses", icon: MapPin,      label: "Addresses" },
  { id: "settings",  icon: Settings,    label: "Account Settings" },
] as const;

type Section = typeof SECTIONS[number]["id"];

type UserMeta = {
  email: string;
  phone: string;
  full_name: string;
  aadhaar_verified: boolean;
  avatar_initials: string;
};

type Order = {
  id: string;
  order_number: string;
  status: string;
  total_paise: number;
  created_at: string;
  items_count: number;
};

// ─── Order Status Badge ───────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    pending_payment:  { label: "Awaiting Payment",  cls: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={11} /> },
    payment_received: { label: "Payment Received",  cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <CheckCircle size={11} /> },
    processing:       { label: "Processing",         cls: "bg-blue-50 text-blue-700 border-blue-200",       icon: <Clock size={11} /> },
    dispatched:       { label: "Dispatched",         cls: "bg-saffron-50 text-saffron-700 border-saffron-200", icon: <Truck size={11} /> },
    delivered:        { label: "Delivered",          cls: "bg-green-50 text-green-700 border-green-200",   icon: <CheckCircle size={11} /> },
    cancelled:        { label: "Cancelled",          cls: "bg-red-50 text-red-700 border-red-200",         icon: <AlertCircle size={11} /> },
    returned:         { label: "Returned",           cls: "bg-gray-50 text-gray-700 border-gray-200",      icon: <AlertCircle size={11} /> },
    refunded:         { label: "Refunded",           cls: "bg-green-50 text-green-700 border-green-200",   icon: <CheckCircle size={11} /> },
  };
  const c = config[status] || { label: status, cls: "bg-gray-50 text-gray-700 border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection({ user }: { user: UserMeta }) {
  return (
    <div className="space-y-5">
      {/* Avatar + name card */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-saffron-100 text-saffron-700 font-black text-3xl flex items-center justify-center border-4 border-saffron-200 shrink-0">
          {user.avatar_initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-[#1A1A1A]">{user.full_name || "Citizen"}</h2>
          <p className="text-sm text-[#7A7A7A] mt-0.5">{user.email}</p>
          {user.phone && <p className="text-sm text-[#7A7A7A]">+91 {user.phone}</p>}
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
            {user.aadhaar_verified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <CheckCircle size={12} /> Aadhaar Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
                <AlertCircle size={12} /> Aadhaar Pending
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 bg-saffron-50 border border-saffron-200 px-3 py-1 rounded-full">
              <Shield size={12} /> Citizen Account
            </span>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-2 text-sm font-semibold text-saffron-600 hover:text-saffron-700 px-4 py-2 rounded-xl border border-saffron-200 hover:bg-saffron-50 transition-colors">
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      {/* Info cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Mail size={12} /> Contact Details
          </p>
          <div className="space-y-2.5">
            <div>
              <p className="text-[10px] font-bold text-[#B0B0A8] uppercase">Email</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#B0B0A8] uppercase">Mobile</p>
              <p className="text-sm text-[#1A1A1A] font-medium">{user.phone ? `+91 ${user.phone}` : "Not set"}</p>
            </div>
          </div>
          <button className="mt-4 text-xs text-saffron-600 font-semibold hover:underline">Update Contact →</button>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield size={12} /> Identity Verification
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#B0B0A8] uppercase">Aadhaar</p>
                <p className="text-sm text-[#1A1A1A] font-medium">XXXX XXXX XXXX</p>
              </div>
              {user.aadhaar_verified
                ? <CheckCircle size={18} className="text-green-500" />
                : <AlertCircle size={18} className="text-yellow-500" />}
            </div>
          </div>
          {!user.aadhaar_verified && (
            <button className="mt-4 w-full text-xs font-semibold text-white bg-saffron-500 hover:bg-saffron-600 py-2 rounded-xl transition-colors">
              Verify Aadhaar Now
            </button>
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Bell size={12} /> Notifications
          </p>
          <div className="space-y-2">
            {[
              { label: "Order Updates", on: true },
              { label: "New Listings Alert", on: false },
              { label: "Grievance Updates", on: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between text-sm">
                <span className="text-[#3D3D3D]">{n.label}</span>
                <span className={`text-xs font-bold ${n.on ? "text-green-600" : "text-[#9A9A9A]"}`}>{n.on ? "ON" : "OFF"}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 text-xs text-saffron-600 font-semibold hover:underline">Manage Preferences →</button>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText size={12} /> Documents
          </p>
          <div className="space-y-2">
            {[
              { label: "Disposal Certificates", count: 3 },
              { label: "Order Invoices", count: 7 },
              { label: "Purchase Receipts", count: 7 },
            ].map((d) => (
              <div key={d.label} className="flex items-center justify-between text-sm">
                <span className="text-[#3D3D3D]">{d.label}</span>
                <span className="text-xs font-bold text-[#1A1A1A] bg-surface px-2 py-0.5 rounded-full">{d.count}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-xs text-saffron-600 font-semibold hover:underline">
            <Download size={12} /> Download All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Orders ──────────────────────────────────────────────────────────

function OrdersSection({ orders, loading }: { orders: Order[]; loading: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1A1A1A] text-lg">My Orders</h2>
        <Link href="/public/orders" className="text-sm text-saffron-600 font-semibold hover:underline flex items-center gap-1">
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface rounded-2xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={40} className="mx-auto text-[#C0C0B8] mb-3" />
          <p className="font-semibold text-[#3D3D3D]">No orders yet</p>
          <p className="text-sm text-[#9A9A9A] mt-1">Browse the marketplace to buy government-rated assets at fair prices.</p>
          <Link href="/public/marketplace" className="mt-4 inline-flex btn-primary text-sm">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-5 hover:border-saffron-200 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-1">Order #{order.order_number}</p>
                  <p className="font-semibold text-[#1A1A1A]">
                    ₹{(order.total_paise / 100).toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-[#7A7A7A] ml-2">· {order.items_count} item{order.items_count !== 1 ? "s" : ""}</span>
                  </p>
                  <p className="text-xs text-[#9A9A9A] mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.status} />
                  <Link href={`/public/orders?id=${order.id}`} className="text-xs text-saffron-600 font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Wishlist ────────────────────────────────────────────────────────

function WishlistSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1A1A1A] text-lg">My Wishlist</h2>
        <Link href="/public/wishlist" className="text-sm text-saffron-600 font-semibold hover:underline flex items-center gap-1">
          View all <ChevronRight size={14} />
        </Link>
      </div>
      <div className="bg-white border border-border rounded-2xl p-12 text-center">
        <Heart size={40} className="mx-auto text-[#C0C0B8] mb-3" />
        <p className="font-semibold text-[#3D3D3D]">Your wishlist is empty</p>
        <p className="text-sm text-[#9A9A9A] mt-1">Save items you like to buy them later.</p>
        <Link href="/public/marketplace" className="mt-4 inline-flex btn-primary text-sm">
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}

// ─── Section: Addresses ───────────────────────────────────────────────────────

function AddressesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1A1A1A] text-lg">Saved Addresses</h2>
        <button className="text-sm text-saffron-600 font-semibold hover:underline flex items-center gap-1">
          + Add New
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-saffron-300 rounded-2xl p-5 relative">
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-saffron-500 text-white px-2 py-0.5 rounded-full">Default</span>
          <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">Home</p>
          <p className="text-sm font-semibold text-[#1A1A1A]">Ravi Kumar</p>
          <p className="text-sm text-[#5A5A5A] mt-1 leading-relaxed">
            42, Ashok Nagar, Sector 14<br />
            New Delhi — 110075<br />
            Mob: +91 98765 43210
          </p>
          <div className="flex gap-3 mt-3">
            <button className="text-xs text-saffron-600 font-semibold hover:underline">Edit</button>
            <button className="text-xs text-danger font-semibold hover:underline">Remove</button>
          </div>
        </div>
        <button className="bg-surface border-2 border-dashed border-border rounded-2xl p-5 hover:border-saffron-300 hover:bg-saffron-50 transition-colors flex flex-col items-center justify-center gap-2 min-h-[130px]">
          <MapPin size={24} className="text-[#9A9A9A]" />
          <span className="text-sm font-semibold text-[#7A7A7A]">Add New Address</span>
        </button>
      </div>
    </div>
  );
}

// ─── Section: Settings ────────────────────────────────────────────────────────

function SettingsSection() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-[#1A1A1A] text-lg">Account Settings</h2>

      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Notification Preferences</h3>
        {[
          { label: "Email notifications", desc: "Order updates, offers and GAMS news", val: emailNotif, set: setEmailNotif },
          { label: "SMS notifications", desc: "Critical order and delivery alerts", val: smsNotif, set: setSmsNotif },
        ].map(({ label, desc, val, set }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
              <p className="text-xs text-[#7A7A7A]">{desc}</p>
            </div>
            <button
              onClick={() => set(!val)}
              className={`w-12 h-6 rounded-full transition-colors relative ${val ? "bg-green-500" : "bg-[#D0D0C8]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Security</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors text-sm font-semibold text-[#3D3D3D]">
            <span>Change Password</span>
            <ChevronRight size={16} className="text-[#9A9A9A]" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors text-sm font-semibold text-[#3D3D3D]">
            <span>Linked Devices</span>
            <ChevronRight size={16} className="text-[#9A9A9A]" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors text-sm font-semibold text-danger">
            <span>Delete Account</span>
            <ChevronRight size={16} className="text-[#9A9A9A]" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────────────────

function QuickStats({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const totalSpent = orders.reduce((s, o) => s + o.total_paise, 0);

  const stats = [
    { label: "Total Orders",    value: loading ? "—" : orders.length.toString(),        icon: <Package size={18} />,      color: "text-saffron-600" },
    { label: "Delivered",       value: loading ? "—" : delivered.toString(),             icon: <CheckCircle size={18} />,  color: "text-green-600" },
    { label: "Total Spent",     value: loading ? "—" : `₹${(totalSpent/100).toLocaleString("en-IN")}`, icon: <IndianRupee size={18} />, color: "text-gold-600" },
    { label: "Saved (Wishlist)", value: "0",                                             icon: <Heart size={18} />,        color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-border rounded-2xl p-4 text-center">
          <div className={`flex justify-center mb-1.5 ${s.color}`}>{s.icon}</div>
          <p className="text-xl font-bold text-[#1A1A1A]">{s.value}</p>
          <p className="text-xs text-[#7A7A7A] font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [section, setSection] = useState<Section>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<UserMeta | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = createClient();
    (async () => {
      try {
        const { data: { user: u } } = await db.auth.getUser();
        if (!u) {
          window.location.href = "/public/login?next=/public/account";
          return;
        }

        const name = u.user_metadata?.full_name || u.email?.split("@")[0] || "Citizen";
        const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() || "").join("");

        setUser({
          email: u.email || "",
          phone: u.phone || u.user_metadata?.phone || "",
          full_name: name,
          aadhaar_verified: u.user_metadata?.aadhaar_verified || false,
          avatar_initials: initials || "C",
        });

        // Fetch orders — gracefully handle if table doesn't exist yet
        try {
          const { data: orderData } = await db
            .from("orders")
            .select("id, order_number, status, total_paise, created_at, order_items(id)")
            .eq("user_id", u.id)
            .order("created_at", { ascending: false })
            .limit(5);

          setOrders((orderData || []).map((o: Record<string, unknown>) => ({
            id: o.id as string,
            order_number: o.order_number as string,
            status: o.status as string,
            total_paise: o.total_paise as number,
            created_at: o.created_at as string,
            items_count: Array.isArray(o.order_items) ? (o.order_items as unknown[]).length : 0,
          })));
        } catch {
          setOrders([]);
        }
      } catch {
        window.location.href = "/public/login?next=/public/account";
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#7A7A7A]">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Unable to Load Account</h2>
          <p className="text-sm text-[#7A7A7A] mb-4">
            We couldn't load your account details. Please try signing in again.
          </p>
          <a href="/public/login?next=/public/account" className="inline-flex btn-primary text-sm">
            Sign In Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-surface">
      {/* Top nav */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/public" className="flex items-center gap-2 shrink-0">
              <svg viewBox="0 0 48 48" className="h-7 w-7 shrink-0" aria-hidden>
                <circle cx="24" cy="24" r="22" fill="none" stroke="#2B4BB6" strokeWidth="2" />
                <circle cx="24" cy="24" r="5" fill="none" stroke="#2B4BB6" strokeWidth="1.5" />
              </svg>
              <span className="text-sm font-bold text-[#1A1A1A]">GAMS Citizen</span>
            </Link>
            <span className="text-[#D0D0C8] hidden sm:inline">/</span>
            <span className="text-sm text-[#7A7A7A] hidden sm:inline">My Account</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/public/marketplace" className="text-sm text-[#5A5A5A] hover:text-saffron-600 font-medium hidden sm:block transition-colors">
              Marketplace
            </Link>
            <Link href="/public/cart" className="text-sm text-[#5A5A5A] hover:text-saffron-600 font-medium hidden sm:block transition-colors">
              Cart
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-[#5A5A5A] hover:text-danger px-3 py-1.5 rounded-xl hover:bg-red-50 border border-border transition-colors">
                <LogOut size={14} /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-saffron-100 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold">{user?.full_name || "Citizen"}</h1>
            <p className="text-saffron-200 text-xs mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.aadhaar_verified ? (
              <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">
                <CheckCircle size={12} /> Aadhaar Verified
              </span>
            ) : (
              <button className="flex items-center gap-1.5 text-xs font-bold bg-white text-saffron-700 px-3 py-1.5 rounded-full hover:bg-saffron-50 transition-colors">
                <Shield size={12} /> Verify Aadhaar
              </button>
            )}
          </div>
        </div>

        <QuickStats orders={orders} loading={loading} />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="md:w-56 shrink-0">
            {/* Mobile nav toggle */}
            <button
              className="md:hidden w-full flex items-center justify-between bg-white border border-border rounded-2xl px-4 py-3 mb-3 text-sm font-semibold"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {SECTIONS.find((s) => s.id === section)?.label}
              <ChevronRight size={14} className={`transition-transform ${mobileNavOpen ? "rotate-90" : ""}`} />
            </button>

            <nav className={`bg-white border border-border rounded-2xl overflow-hidden ${mobileNavOpen ? "block" : "hidden md:block"}`}>
              {SECTIONS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setSection(id); setMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold border-b border-border last:border-0 transition-colors ${
                    section === id
                      ? "bg-saffron-50 text-saffron-700"
                      : "text-[#5A5A5A] hover:bg-surface hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-danger hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </form>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {section === "overview"  && <ProfileSection user={user!} />}
            {section === "orders"    && <OrdersSection orders={orders} loading={loading} />}
            {section === "wishlist"  && <WishlistSection />}
            {section === "addresses" && <AddressesSection />}
            {section === "settings"  && <SettingsSection />}
          </main>
        </div>
      </div>

      <footer className="border-t border-border bg-white mt-8 py-4 text-center text-xs text-[#9A9A9A]">
        © 2026 Ministry of Finance, Government of India · GAMS Citizen Marketplace
      </footer>
    </div>
  );
}
