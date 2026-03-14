"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@gams/lib/supabase/client";

// ─── Razorpay types ───────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void };
  }
}
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Building2,
  FileText,
  IndianRupee,
  AlertCircle,
  User,
  Download,
  Eye,
  Layers,
  BarChart3,
  QrCode,
  Tag,
  Globe,
  Phone,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────────────────

type Condition = "Excellent" | "Good" | "Serviceable" | "Fair";

type DetailListing = {
  dbId:             string;   // UUID for API calls
  id:               string;   // listing_code (display)
  name:             string;
  category:         string;
  subcategory:      string;
  condition:        Condition;
  qty:              number;
  availableQty:     number;
  minOrderQty:      number;
  maxOrderQty:      number;
  unitPriceOriginal: number;
  unitPriceListing:  number;
  event:            string;
  city:             string;
  state:            string;
  warehouse:        string;
  ministry:         string;
  supplier:         string;
  listedDate:       string;
  expiryDate:       string;
  verified:         boolean;
  rating:           number;
  reviewCount:      number;
  qrCertified:      boolean;
  description:      string;
  specs:     { label: string; value: string }[];
  timeline:  { label: string; date: string; done: boolean }[];
  reviews:   { author: string; rating: number; comment: string; date: string }[];
};

type MktViewRow = {
  id:                  string;
  listing_code:        string;
  condition_rating:    number | null;
  listed_price_paise:  number | null;
  original_price_paise: number;
  quantity_available:  number;
  product_name:        string;
  category:            string;
  brand:               string | null;
  specifications:      Record<string, string> | null;
};

type RlDatesRow = {
  expires_at: string | null;
  listed_at:  string | null;
};

function ratingToCondition(r: number | null): Condition {
  if (!r) return "Good";
  if (r >= 8.5) return "Excellent";
  if (r >= 6.5) return "Good";
  if (r >= 4.5) return "Serviceable";
  return "Fair";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function discount(orig: number, list: number) {
  return Math.round(((orig - list) / orig) * 100);
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({count} reviews)</span>
    </div>
  );
}

const CONDITION_CONFIG: Record<Condition, { bg: string; text: string; border: string; desc: string }> = {
  Excellent:   { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   desc: "Like new, minimal wear" },
  Good:        { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    desc: "Normal event use, fully functional" },
  Serviceable: { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  desc: "Functional with minor cosmetic wear" },
  Fair:        { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  desc: "Functional, visible wear/ patching" },
};

// ─── Order Form Modal ─────────────────────────────────────────────────────────

type ShippingAddress = {
  line1: string;
  line2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function OrderModal({
  listing,
  listingDbId,
  onClose,
}: {
  listing: DetailListing;
  listingDbId: string;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(listing.minOrderQty);
  const [addr, setAddr] = useState<ShippingAddress>({
    line1: "", line2: "", city: "", district: "", state: "", pincode: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const total = qty * listing.unitPriceListing;

  const handleAddr = (k: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddr((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Razorpay order on server
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingDbId,
          quantity: qty,
          shipping_address: {
            line1: addr.line1,
            ...(addr.line2 ? { line2: addr.line2 } : {}),
            city: addr.city,
            district: addr.district,
            state: addr.state,
            pincode: addr.pincode,
          },
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error ?? "Failed to create order");

      const { order_id, order_db_id, order_number, amount, currency, key_id } = createData as {
        order_id: string;
        order_db_id: string;
        order_number: string;
        amount: number;
        currency: string;
        key_id: string;
      };

      // 2. Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load Razorpay. Check your internet connection.");

      // 3. Open Razorpay payment popup
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: key_id,
          amount,
          currency,
          order_id,
          name: "Government Asset Management System",
          description: listing.name,
          image: "/goi-logo.png",
          theme: { color: "#138808" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // 4. Verify HMAC signature on server
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_db_id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              reject(new Error(verifyData.error ?? "Payment verification failed"));
            } else {
              setOrderNumber(order_number);
              resolve();
            }
          },
          modal: {
            ondismiss: () => reject(new Error("DISMISSED")),
          },
        });
        rzp.open();
      });

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== "DISMISSED") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-base font-bold text-gray-900">{submitted ? "Order Confirmed" : "Place Order"}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface text-gray-400"><X size={18} /></button>
          </div>

          {submitted ? (
            <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 mb-1">Payment Confirmed</p>
                <p className="text-sm text-gray-500">Your order has been placed and payment received. The GAMS team will coordinate delivery.</p>
              </div>
              <div className="w-full bg-surface border border-border rounded-xl p-4 text-left flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-bold text-gray-900">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-bold text-gray-900">{qty.toLocaleString("en-IN")} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-bold text-green-700">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery To</span>
                  <span className="font-bold text-gray-900 text-right max-w-[180px] truncate">{addr.city}, {addr.state}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">You will receive an email confirmation. Use the order number to track delivery status in your dashboard.</p>
              <button onClick={onClose} className="w-full text-white text-sm font-bold rounded-xl py-2.5 transition-opacity hover:opacity-90" style={{ background: "#138808" }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
            {/* Item summary */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <p className="text-sm font-bold text-gray-900 mb-1">{listing.name}</p>
              <p className="text-xs text-gray-400">{listing.id} · {listing.condition} condition · {formatPrice(listing.unitPriceListing)}/unit</p>
            </div>

            {/* Qty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity <span className="text-gray-400 font-normal">(min {listing.minOrderQty}, max {listing.maxOrderQty})</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(listing.minOrderQty, qty - 50))}
                  className="w-9 h-9 rounded-xl border border-border text-lg font-bold text-gray-600 hover:bg-surface transition-colors flex items-center justify-center"
                >−</button>
                <input
                  type="number"
                  min={listing.minOrderQty}
                  max={Math.min(listing.maxOrderQty, listing.availableQty)}
                  value={qty}
                  onChange={(e) => setQty(Math.min(listing.availableQty, Math.max(listing.minOrderQty, Number(e.target.value))))}
                  className="flex-1 text-center text-base font-bold border border-border rounded-xl py-2 focus:outline-none focus:border-saffron-400"
                />
                <button
                  type="button"
                  onClick={() => setQty(Math.min(Math.min(listing.maxOrderQty, listing.availableQty), qty + 50))}
                  className="w-9 h-9 rounded-xl border border-border text-lg font-bold text-gray-600 hover:bg-surface transition-colors flex items-center justify-center"
                >+</button>
              </div>
            </div>

            {/* Shipping address */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-gray-700">Delivery Address</p>
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={addr.line1}
                onChange={handleAddr("line1")}
                required
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
              />
              <input
                type="text"
                placeholder="Address Line 2 (optional)"
                value={addr.line2}
                onChange={handleAddr("line2")}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City *"
                  value={addr.city}
                  onChange={handleAddr("city")}
                  required
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                />
                <input
                  type="text"
                  placeholder="District *"
                  value={addr.district}
                  onChange={handleAddr("district")}
                  required
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="State *"
                  value={addr.state}
                  onChange={handleAddr("state")}
                  required
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                />
                <input
                  type="text"
                  placeholder="PIN Code *"
                  value={addr.pincode}
                  onChange={handleAddr("pincode")}
                  required
                  pattern="[0-9]{6}"
                  title="6-digit PIN code"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-saffron-400"
                />
              </div>
            </div>

            {/* Total */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">Total Payable</p>
                <p className="text-xl font-black text-green-800">₹{total.toLocaleString("en-IN")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600">You save</p>
                <p className="text-sm font-bold text-green-700">
                  ₹{((listing.unitPriceOriginal - listing.unitPriceListing) * qty).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              By placing this order, you agree to GAMS Redistribution Terms. Payment is processed securely via Razorpay.
            </p>

            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={loading} className="flex-1 border border-border rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-surface transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white text-sm font-bold rounded-xl py-2.5 transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "#138808" }}
              >
                {loading ? "Processing…" : "Pay with Razorpay"}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [listing, setListing]   = useState<DetailListing | null>(null);
  const [loading, setLoading]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const db = createClient();
    Promise.all([
      db.from("v_marketplace").select("*").eq("listing_code", id).maybeSingle(),
      db.from("redistribution_listings").select("expires_at, listed_at").eq("listing_code", id).maybeSingle(),
    ]).then(([viewRes, rlRes]) => {
      if (viewRes.error || !viewRes.data) {
        setFetchError("Listing not found or no longer available.");
        setLoading(false);
        return;
      }
      const row = viewRes.data as MktViewRow;
      const rl  = rlRes.data as RlDatesRow | null;
      const specs = row.specifications
        ? Object.entries(row.specifications).map(([k, v]) => ({ label: k, value: String(v) }))
        : [];
      setListing({
        dbId:             row.id,
        id:               row.listing_code,
        name:             row.product_name,
        category:         row.category,
        subcategory:      "Asset",
        condition:        ratingToCondition(row.condition_rating),
        qty:              row.quantity_available,
        availableQty:     row.quantity_available,
        minOrderQty:      1,
        maxOrderQty:      row.quantity_available,
        unitPriceOriginal: Math.round(row.original_price_paise / 100),
        unitPriceListing:  Math.round((row.listed_price_paise ?? row.original_price_paise) / 100),
        event:    "\u2014",
        city:     "\u2014",
        state:    "\u2014",
        warehouse: "GAMS Certified Warehouse",
        ministry:  "\u2014",
        supplier:  row.brand ?? "\u2014",
        listedDate: formatDate(rl?.listed_at ?? null),
        expiryDate: formatDate(rl?.expires_at ?? null),
        verified:    true,
        rating:      row.condition_rating ? Math.min(5, row.condition_rating / 2) : 4.5,
        reviewCount: 0,
        qrCertified: true,
        description: "",
        specs,
        timeline: [
          { label: "Listed for Redistribution", date: formatDate(rl?.listed_at ?? null), done: true },
        ],
        reviews: [],
      });
      setLoading(false);
    }).catch(() => {
      setFetchError("Failed to load listing.");
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 rounded-full border-4 border-saffron-200 border-t-saffron-500 animate-spin" />
          <p className="text-sm font-medium">Loading listing\u2026</p>
        </div>
      </div>
    );
  }

  if (fetchError || !listing) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center p-6">
        <div className="bg-white border border-border rounded-2xl p-10 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <AlertCircle size={36} className="text-red-400" />
          <p className="font-bold text-gray-900">Listing Unavailable</p>
          <p className="text-sm text-gray-500">{fetchError ?? "This listing could not be found."}</p>
          <Link href="/public/marketplace" className="text-sm font-bold text-white px-6 py-2.5 rounded-xl" style={{ background: "#E07B00" }}>
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const cc = CONDITION_CONFIG[listing.condition];
  const disc = discount(listing.unitPriceOriginal, listing.unitPriceListing);
  const soldPct = listing.qty > 0 ? Math.round(((listing.qty - listing.availableQty) / listing.qty) * 100) : 0;

  return (
    <div className="min-h-dvh bg-surface">
      {/* Tiranga bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)" }} />

      {/* Top nav */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href="/public/marketplace" className="p-2 rounded-xl border border-border hover:bg-surface transition-colors text-gray-400 hover:text-gray-700">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link href="/public" className="hover:text-gray-700">Home</Link>
            <ChevronRight size={12} />
            <Link href="/public/marketplace" className="hover:text-gray-700">Marketplace</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{listing.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6 items-start flex-col lg:flex-row">

          {/* ── Left: Details ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Image / placeholder */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="h-56 md:h-72 bg-surface flex items-center justify-center relative">
                <Package size={64} className="text-gray-200" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cc.bg} ${cc.text} ${cc.border}`}>
                    {listing.condition}
                    <span className="font-normal opacity-70">— {cc.desc}</span>
                  </span>
                  {listing.verified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700">
                      <ShieldCheck size={12} /> GAMS Verified Asset
                    </span>
                  )}
                  {listing.qrCertified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                      <QrCode size={12} /> QR Lifecycle Certified
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 bg-saffron-500 text-white text-sm font-black px-3 py-1.5 rounded-full">
                  -{disc}% OFF
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">About This Asset</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-y-3 gap-x-8">
                {listing.specs.map((s) => (
                  <div key={s.label} className="flex justify-between items-start border-b border-border pb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.label}</p>
                    <p className="text-sm font-medium text-gray-900 text-right">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Lifecycle Timeline */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Asset Lifecycle</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="flex flex-col gap-4">
                  {listing.timeline.map((step, i) => (
                    <div key={step.label} className="flex items-start gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done ? "bg-green-500" : "bg-gray-200"}`}>
                        {step.done ? <CheckCircle2 size={14} className="text-white" /> : <Clock size={14} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                        <p className="text-xs text-gray-400">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Buyer Reviews</h2>
                <StarRating rating={listing.rating} count={listing.reviewCount} />
              </div>
              <div className="flex flex-col gap-4">
                {listing.reviews.map((r, i) => (
                  <div key={i} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <Building2 size={13} className="text-green-700" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{r.author}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1,2,3,4,5].map((j) => (
                          <Star key={j} size={11} className={j <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order panel (sticky) ────────────────────────────── */}
          <div className="lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 lg:sticky lg:top-20">

            {/* Pricing card */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{listing.category} · {listing.subcategory}</p>
              <h1 className="text-base font-bold text-gray-900 leading-snug mb-3">{listing.name}</h1>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-gray-900">{formatPrice(listing.unitPriceListing)}</span>
                <span className="text-sm text-gray-400">/unit</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-400 line-through">{formatPrice(listing.unitPriceOriginal)}</span>
                <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-0.5 rounded-full">
                  YOU SAVE {disc}%
                </span>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-gray-500">
                    <strong className="text-gray-900 text-sm">{listing.availableQty.toLocaleString("en-IN")}</strong> available
                    {" "}/ {listing.qty.toLocaleString("en-IN")} total
                  </p>
                  <span className="text-[10px] text-gray-400">{soldPct}% claimed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-saffron-400 rounded-full" style={{ width: `${soldPct}%` }} />
                </div>
                {listing.availableQty < 200 && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> Only {listing.availableQty} units left — order soon
                  </p>
                )}
              </div>

              {/* Order CTA */}
              <button
                onClick={() => setOrderOpen(true)}
                className="w-full text-white text-sm font-bold py-3 rounded-xl transition-opacity hover:opacity-90 mb-2"
                style={{ background: "#138808" }}
              >
                Request to Order
              </button>
              <p className="text-center text-xs text-gray-400">
                Min order: {listing.minOrderQty} units · Max: {listing.maxOrderQty} units
              </p>
            </div>

            {/* Logistics info */}
            <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900">Logistics & Pickup</h3>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin size={15} className="text-saffron-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Asset Location</p>
                  <p className="text-xs text-gray-500 mt-0.5">{listing.warehouse}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Truck size={15} className="text-saffron-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Delivery</p>
                  <p className="text-xs text-gray-500 mt-0.5">Buyer arranges transport. GAMS provides loading assistance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Calendar size={15} className="text-saffron-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Listing Expires</p>
                  <p className="text-xs text-gray-500 mt-0.5">{listing.expiryDate}</p>
                </div>
              </div>
            </div>

            {/* Ministry + Supplier */}
            <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-gray-900">Source Details</h3>
              <div className="flex items-start gap-3">
                <Globe size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Ministry</p>
                  <p className="text-sm text-gray-800">{listing.ministry}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Original Supplier</p>
                  <p className="text-sm text-gray-800">{listing.supplier}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Event</p>
                  <p className="text-sm text-gray-800">{listing.event}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText size={14} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Listing ID</p>
                  <p className="text-sm font-mono text-gray-800">{listing.id}</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
              {[
                { icon: <ShieldCheck size={14} className="text-green-600" />, text: "GAMS-verified asset with inspection report" },
                { icon: <QrCode size={14} className="text-blue-600" />,       text: "QR lifecycle certified — scan to verify" },
                { icon: <IndianRupee size={14} className="text-saffron-600" />,text: "Govt treasury payment — secure & auditable" },
                { icon: <FileText size={14} className="text-gray-500" />,     text: "GFR-compliant redistribution process" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2.5 text-xs text-gray-600">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderOpen && <OrderModal listing={listing} listingDbId={listing.dbId} onClose={() => setOrderOpen(false)} />}
    </div>
  );
}
