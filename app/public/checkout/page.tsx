"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Shield, Truck, CheckCircle, MapPin, CreditCard, Package, IndianRupee, AlertCircle } from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type CartItem = {
  id: string;
  listing_code: string;
  name: string;
  category: string;
  price_paise: number;
  original_price_paise: number;
  rating: number;
  qty: number;
};

type Address = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

type Step = "address" | "review" | "payment" | "success";

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepBar({ step }: { step: Step }) {
  const steps: Step[] = ["address", "review", "payment", "success"];
  const labels = ["Address", "Review", "Payment", "Done"];
  const current = steps.indexOf(step);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
              i < current  ? "bg-green-500 border-green-500 text-white" :
              i === current ? "bg-saffron-500 border-saffron-500 text-white" :
                             "bg-white border-[#D0D0C8] text-[#9A9A9A]"
            }`}>
              {i < current ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${i <= current ? "text-[#1A1A1A]" : "text-[#9A9A9A]"}`}>{labels[i]}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${i < current ? "bg-green-500" : "bg-[#E2E2DC]"}`} style={{ width: 40 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({ items, deliveryFee = 0 }: { items: CartItem[]; deliveryFee?: number }) {
  const subtotal = items.reduce((s, i) => s + i.price_paise * i.qty, 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
      <h3 className="font-bold text-[#1A1A1A] mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center shrink-0">
              <Package size={16} className="text-[#9A9A9A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1A1A1A] truncate">{item.name}</p>
              <p className="text-[10px] text-[#9A9A9A]">{item.category} · Rating {item.rating}/10</p>
              <p className="text-xs text-[#7A7A7A]">Qty: {item.qty}</p>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A] shrink-0">₹{((item.price_paise * item.qty) / 100).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#5A5A5A]">Subtotal</span>
          <span className="font-semibold">₹{(subtotal / 100).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#5A5A5A]">Delivery</span>
          <span className={deliveryFee === 0 ? "font-semibold text-green-600" : "font-semibold"}>
            {deliveryFee === 0 ? "FREE" : `₹${(deliveryFee / 100).toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-2">
          <span>Total</span>
          <span>₹{(total / 100).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
          <Shield size={12} className="text-green-500 shrink-0" /> GFR-compliant disposal certificate included
        </div>
        <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
          <Truck size={12} className="text-saffron-500 shrink-0" /> Dispatched within 3–5 working days
        </div>
        <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
          <CheckCircle size={12} className="text-green-500 shrink-0" /> Secure payment via Razorpay
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("address");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState<Address>({
    name: "", line1: "", line2: "", city: "", state: "Delhi", pincode: "", phone: "",
  });

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/public/login?next=/public/checkout"; return; }
      // Load cart from localStorage (simplified)
      const stored = localStorage.getItem("gams_cart");
      if (stored) {
        try { setCartItems(JSON.parse(stored)); } catch { /* ignore */ }
      }
      setLoading(false);
    });
  }, []);

  async function handlePayment() {
    setPayLoading(true);
    try {
      const total = cartItems.reduce((s, i) => s + i.price_paise * i.qty, 0);
      const res = await fetch("/public/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          listing_ids: cartItems.map((i) => i.id),
          quantities: cartItems.map((i) => i.qty),
          shipping_address: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      // Open Razorpay
      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void } }).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total,
        currency: "INR",
        name: "GAMS Citizen Marketplace",
        description: "Government Asset Purchase",
        order_id: data.razorpay_order_id,
        handler: async (response: unknown) => {
          const verifyRes = await fetch("/public/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            localStorage.removeItem("gams_cart");
            setOrderId(data.order_number || data.order_id);
            setStep("success");
          }
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: "#E07B00" },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
    setPayLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-dvh bg-surface flex flex-col">
        <header className="bg-white border-b border-border">
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={44} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Order Placed!</h1>
            <p className="text-[#7A7A7A] text-sm mb-6">
              Your payment was successful. A disposal certificate will be included with your delivery.
            </p>
            {orderId && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-xl font-black text-green-700">#{orderId}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/public/orders" className="btn-primary text-sm">Track My Order</Link>
              <Link href="/public/marketplace" className="btn-outline text-sm">Continue Shopping</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isAddressValid = address.name && address.line1 && address.city && address.state && /^\d{6}$/.test(address.pincode) && /^\d{10}$/.test(address.phone);

  return (
    <div className="min-h-dvh bg-surface">
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#fff 33.33% 66.66%,#138808 66.66%)" }} />
        <div className="max-w-screen-lg mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link href="/public/cart" className="text-sm text-[#7A7A7A] hover:text-saffron-600 flex items-center gap-1 font-medium">
            <ChevronLeft size={15} /> Cart
          </Link>
          <span className="text-[#D0D0C8]">/</span>
          <h1 className="text-sm font-bold text-[#1A1A1A]">Checkout</h1>
          <div className="ml-auto flex items-center gap-2">
            <Shield size={14} className="text-green-500" />
            <span className="text-xs text-green-700 font-semibold">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 md:px-6 py-8">
        <StepBar step={step} />

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-[#C0C0B8] mb-3" />
            <p className="font-semibold text-[#3D3D3D]">Your cart is empty</p>
            <Link href="/public/marketplace" className="mt-4 inline-flex btn-primary text-sm">Browse Marketplace</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column — steps */}
            <div className="md:col-span-2 space-y-5">
              {step === "address" && (
                <div className="bg-white border border-border rounded-2xl p-6">
                  <h2 className="font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
                    <MapPin size={18} className="text-saffron-500" /> Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([
                      { label: "Full Name", key: "name", type: "text", placeholder: "As per Aadhaar", span: 2 },
                      { label: "Address Line 1", key: "line1", type: "text", placeholder: "House / Flat / Plot No., Street", span: 2 },
                      { label: "Address Line 2 (optional)", key: "line2", type: "text", placeholder: "Landmark, Area", span: 2 },
                      { label: "City", key: "city", type: "text", placeholder: "City", span: 1 },
                      { label: "PIN Code", key: "pincode", type: "text", placeholder: "110001", span: 1 },
                      { label: "Mobile Number", key: "phone", type: "tel", placeholder: "10-digit mobile", span: 1 },
                    ] as { label: string; key: keyof Address; type: string; placeholder: string; span: number }[]).map(({ label, key, type, placeholder, span }) => (
                      <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-1.5">{label}</label>
                        <input
                          type={type}
                          value={address[key]}
                          onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-[#5A5A5A] uppercase tracking-wider mb-1.5">State</label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                        className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-200"
                      >
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {!isAddressValid && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
                      <AlertCircle size={13} /> Please fill all required fields correctly (10-digit phone, 6-digit PIN).
                    </div>
                  )}

                  <button
                    onClick={() => setStep("review")}
                    disabled={!isAddressValid}
                    className="mt-5 w-full btn-primary py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Review
                  </button>
                </div>
              )}

              {step === "review" && (
                <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
                  <h2 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Package size={18} className="text-saffron-500" /> Review Your Order
                  </h2>

                  {/* Address summary */}
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-xs font-bold text-[#9A9A9A] uppercase tracking-wider mb-2">Delivering to</p>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{address.name}</p>
                    <p className="text-sm text-[#5A5A5A]">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p className="text-sm text-[#5A5A5A]">{address.city}, {address.state} — {address.pincode}</p>
                    <p className="text-sm text-[#5A5A5A]">+91 {address.phone}</p>
                    <button onClick={() => setStep("address")} className="mt-2 text-xs text-saffron-600 font-semibold hover:underline">Change Address</button>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center shrink-0">
                          <Package size={24} className="text-[#9A9A9A]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1A1A1A]">{item.name}</p>
                          <p className="text-xs text-[#7A7A7A]">{item.category} · Rating {item.rating}/10 · Qty: {item.qty}</p>
                          <p className="text-xs text-green-600 font-semibold">
                            Saves ₹{(((item.original_price_paise - item.price_paise) * item.qty) / 100).toLocaleString("en-IN")} off MRP
                          </p>
                        </div>
                        <p className="text-base font-bold text-[#1A1A1A]">₹{((item.price_paise * item.qty) / 100).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-saffron-50 border border-saffron-200 rounded-xl p-3 text-xs text-saffron-700">
                    <Shield size={12} className="inline mr-1" />
                    A GFR-compliant disposal certificate will be included with your package confirming government asset disposal.
                  </div>

                  <button onClick={() => setStep("payment")} className="w-full btn-primary py-3 font-bold">
                    Proceed to Payment
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
                  <h2 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                    <CreditCard size={18} className="text-saffron-500" /> Secure Payment
                  </h2>

                  <div className="bg-surface rounded-xl p-4 text-center">
                    <p className="text-xs text-[#9A9A9A] mb-1">Total Amount</p>
                    <div className="flex items-center justify-center gap-1">
                      <IndianRupee size={20} className="text-[#1A1A1A] font-bold" />
                      <p className="text-3xl font-black text-[#1A1A1A]">
                        {(cartItems.reduce((s, i) => s + i.price_paise * i.qty, 0) / 100).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 font-semibold mt-1">Free Delivery Included</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Credit / Debit Card",
                      "UPI (Google Pay, PhonePe, Paytm)",
                      "Net Banking",
                      "Wallets",
                    ].map((method) => (
                      <div key={method} className="flex items-center gap-3 p-3 border border-border rounded-xl text-sm text-[#3D3D3D]">
                        <CheckCircle size={14} className="text-green-500" /> {method}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-[#9A9A9A] flex items-center gap-1.5">
                    <Shield size={12} className="text-green-500" />
                    Secured by Razorpay. Your card data is never stored on our servers.
                  </p>

                  <button
                    onClick={handlePayment}
                    disabled={payLoading}
                    className="w-full btn-primary py-3 font-bold text-base disabled:opacity-50"
                  >
                    {payLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : "Pay Now via Razorpay"}
                  </button>
                </div>
              )}
            </div>

            {/* Right column — summary */}
            <div>
              <OrderSummary items={cartItems} />
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-white mt-8 py-4 text-center text-xs text-[#9A9A9A]">
        © 2026 Ministry of Finance, Government of India · Payments secured by Razorpay
      </footer>
    </div>
  );
}
