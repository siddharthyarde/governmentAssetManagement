"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import {
  ShoppingCart as CartIcon, Package, Trash2, Plus, Minus, ArrowRight,
  ChevronRight, ShieldCheck, Truck, FileText, LogIn,
} from "lucide-react";
import { createClient } from "@gams/lib/supabase/client";

type CartItem = {
  id: string;
  name: string;
  condition: string;
  listingPrice: number;
  qty: number;
  maxQty: number;
  listingId: string;
};

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/public" className="flex items-center gap-2.5">
            <AshokaChakra size={30} />
            <div>
              <span className="text-sm font-black text-[#1A1A1A] tracking-tight">GAMS</span>
              <span className="hidden sm:block text-[9px] text-[#5A5A5A] font-medium -mt-0.5">Government Asset Management System</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/public/marketplace" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Marketplace</Link>
            <Link href="/public/cart" className="relative p-2 rounded-lg border border-saffron-200 bg-saffron-50">
              <CartIcon size={18} className="text-saffron-600" />
            </Link>
            <Link href="/public/login" className="text-sm font-bold text-white px-4 py-2 rounded-lg bg-saffron-500 hover:bg-saffron-600">Sign In</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function CartPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        // Fetch real marketplace items as potential cart (demo: last 3 listings)
        const { data: listings } = await db.from("v_marketplace")
          .select("listing_code, product_name, condition_rating, listed_price_paise, quantity_available")
          .order("listing_code", { ascending: false }).limit(3);
        if (listings && listings.length > 0) {
          setCartItems(listings.map((l) => {
            const cond = (l.condition_rating ?? 3) >= 4 ? "Good" : "Serviceable";
            return {
              id: l.listing_code,
              listingId: l.listing_code,
              name: l.product_name,
              condition: cond,
              listingPrice: Math.round(l.listed_price_paise / 100),
              qty: 1,
              maxQty: Math.min(l.quantity_available, 100),
            };
          }));
        }
      }
      setLoading(false);
    });
  }, []);

  function updateQty(id: string, delta: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(item.maxQty, item.qty + delta)) }
          : item
      )
    );
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  const subtotal = cartItems.reduce((s, i) => s + i.listingPrice * i.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)" }} />

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/public" className="hover:text-gray-700">Home</Link>
          <ChevronRight size={12} />
          <Link href="/public/marketplace" className="hover:text-gray-700">Marketplace</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Cart</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Shopping Cart
          {cartItems.length > 0 && (
            <span className="ml-2 text-base font-semibold text-gray-400">({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
          )}
        </h1>

        {!user ? (
          /* Not logged in */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-5">
              <LogIn size={36} className="text-saffron-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your cart is saved to your account. Sign in to add items and place orders.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/public/login?next=/public/cart" className="inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600">
                Sign In <ArrowRight size={15} />
              </Link>
              <Link href="/public/register" className="inline-flex items-center justify-center gap-2 text-saffron-700 font-bold px-6 py-3 rounded-xl border border-saffron-300 hover:bg-saffron-50">
                Register Free
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty cart */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <CartIcon size={36} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">
              Browse the GAMS marketplace to find verified government surplus assets at discounted prices.
            </p>
            <Link href="/public/marketplace" className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600">
              Browse Marketplace <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* Cart with items */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-border rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-saffron-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Listing: {item.id} · Condition: {item.condition}</p>
                    <p className="text-base font-bold text-saffron-600 mt-1">
                      ₹{item.listingPrice.toLocaleString("en-IN")}/unit
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm font-bold text-gray-900 min-w-[32px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                        disabled={item.qty >= item.maxQty}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(item.listingPrice * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Assurances */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: ShieldCheck, label: "Govt. Verified", sub: "All assets inspected" },
                  { icon: FileText, label: "Disposal Certificate", sub: "GFR 2017 compliant" },
                  { icon: Truck, label: "Reliable Delivery", sub: "Tracked logistics" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <Icon size={18} className="text-green-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-green-800">{label}</p>
                    <p className="text-[10px] text-green-600 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-border rounded-2xl p-5 sticky top-20">
                <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (18%)</span>
                    <span className="font-semibold text-gray-900">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-border pt-2.5 flex justify-between text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-saffron-600">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Link
                  href="/public/marketplace"
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 transition-colors mb-3"
                >
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>
                <Link
                  href="/public/marketplace"
                  className="w-full flex items-center justify-center gap-2 text-saffron-600 font-semibold py-2 rounded-xl border border-saffron-200 hover:bg-saffron-50 transition-colors text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#1A3A6B] text-white py-8 mt-12">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 text-center">
          <p className="text-xs text-blue-200">© {new Date().getFullYear()} Ministry of Finance, Government of India · GAMS</p>
        </div>
      </footer>
    </>
  );
}
