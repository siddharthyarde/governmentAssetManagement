"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AshokaChakra } from "@gams/ui";
import { createClient } from "@gams/lib/supabase/client";
import {
  Heart, ShoppingCart, Trash2, Star, Package,
  LogOut, ArrowRight, Tag, ChevronRight,
  ShieldCheck, Truck, Sparkles,
} from "lucide-react";
import { logoutAction } from "../(auth)/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type WishlistItem = {
  id: string;
  listing_id: string;
  name: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  condition: string;
};

type RecommendedItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
};

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/public" className="flex items-center gap-2.5">
            <AshokaChakra size={30} />
            <div>
              <span className="text-sm font-black text-[#1A1A1A] tracking-tight">GAMS</span>
              <span className="hidden sm:block text-[9px] text-[#5A5A5A] font-medium -mt-0.5">
                Government Asset Management System
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/public/marketplace"
              className="text-sm font-medium text-[#5A5A5A] hover:text-saffron-600 hidden sm:block transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="/public/cart"
              className="text-sm font-medium text-[#5A5A5A] hover:text-saffron-600 hidden sm:block transition-colors"
            >
              Cart
            </Link>
            <Link
              href="/public/account"
              className="text-sm font-medium text-[#5A5A5A] hover:text-saffron-600 hidden sm:block transition-colors"
            >
              My Account
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-semibold text-[#5A5A5A] hover:text-danger px-3 py-1.5 rounded-xl hover:bg-red-50 border border-border transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, max = 10 }: { rating: number; max?: number }) {
  const filled = Math.round((rating / max) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < filled ? "text-yellow-400 fill-yellow-400" : "text-[#D0D0C8]"
          }
        />
      ))}
      <span className="text-[10px] text-[#9A9A9A] ml-1 font-medium">{rating}/10</span>
    </div>
  );
}

// ─── Wishlist Item Card ───────────────────────────────────────────────────────

function WishlistCard({
  item,
  onRemove,
  onAddToCart,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
}) {
  const discount =
    item.original_price > item.price
      ? Math.round(
          ((item.original_price - item.price) / item.original_price) * 100
        )
      : 0;

  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-saffron-200 hover:shadow-sm transition-all">
      {/* Image placeholder */}
      <div className="relative w-full h-36 bg-saffron-50 border border-saffron-100 rounded-xl flex items-center justify-center">
        <Package size={40} className="text-saffron-200" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center text-[#B0B0A8] hover:text-danger hover:border-red-200 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-[10px] font-bold text-saffron-600 uppercase tracking-wider mb-1">
          {item.category}
        </p>
        <h3 className="text-sm font-bold text-[#1A1A1A] leading-snug mb-2 line-clamp-2">
          {item.name}
        </h3>
        <StarRating rating={item.rating} />
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-black text-saffron-600">
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.original_price > item.price && (
            <span className="text-xs text-[#A0A0A0] line-through">
              ₹{item.original_price.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#9A9A9A] mt-0.5">
          Condition: {item.condition}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAddToCart(item)}
          className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 transition-colors"
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Remove"
          className="px-3 py-2 rounded-xl border border-border text-[#9A9A9A] hover:border-red-200 hover:text-danger hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Recommended Card ─────────────────────────────────────────────────────────

function RecommendedCard({ item }: { item: RecommendedItem }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 hover:border-saffron-200 hover:shadow-sm transition-all">
      <div className="w-full h-20 bg-saffron-50 rounded-xl flex items-center justify-center mb-3">
        <Package size={24} className="text-saffron-200" />
      </div>
      <p className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-wider mb-1">
        {item.category}
      </p>
      <p className="text-xs font-semibold text-[#1A1A1A] leading-snug mb-2 line-clamp-2">
        {item.name}
      </p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-black text-saffron-600">
          ₹{item.price.toLocaleString("en-IN")}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={9}
              className={
                i < Math.round(item.rating / 2)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-[#D0D0C8]"
              }
            />
          ))}
        </div>
      </div>
      <Link
        href="/public/marketplace"
        className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-saffron-600 border border-saffron-200 rounded-xl py-1.5 hover:bg-saffron-50 transition-colors"
      >
        View <ChevronRight size={11} />
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [recommended, setRecommended] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient();
    db.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        window.location.href = "/public/login?next=/public/wishlist";
        return;
      }

      // Fetch wishlist items joined with redistribution_listings + products
      const { data: wishData } = await db
        .from("wishlist_items")
        .select(
          `id, listing_id,
           redistribution_listings (
             listing_code, listed_price_paise, condition_rating,
             products ( name, category )
           )`
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(24);

      if (wishData && wishData.length > 0) {
        setWishlistItems(
          wishData
            .filter((w) => w.redistribution_listings)
            .map((w) => {
              const listing = w.redistribution_listings as Record<string, unknown>;
              const product = (listing?.products ?? {}) as Record<string, unknown>;
              const pricePaise = (listing?.listed_price_paise as number) ?? 0;
              const rating = (listing?.condition_rating as number) ?? 5;
              const price = Math.round(pricePaise / 100);
              // Estimate MRP at ~28% above listing price
              const originalPrice = Math.round(price / 0.72);
              return {
                id: w.id,
                listing_id: String(w.listing_id ?? ""),
                name: (product?.name as string) ?? "Government Asset",
                category: (product?.category as string) ?? "Miscellaneous",
                price,
                original_price: originalPrice,
                rating,
                condition:
                  rating >= 8 ? "Excellent" : rating >= 6 ? "Good" : "Serviceable",
              };
            })
        );
      }

      // Fetch recommended items from marketplace view
      const { data: recData } = await db
        .from("v_marketplace")
        .select(
          "listing_code, product_name, category, listed_price_paise, condition_rating"
        )
        .order("condition_rating", { ascending: false })
        .limit(6);

      if (recData) {
        setRecommended(
          recData.map((r) => ({
            id: r.listing_code,
            name: r.product_name,
            category: r.category ?? "Asset",
            price: Math.round(r.listed_price_paise / 100),
            rating: r.condition_rating ?? 5,
          }))
        );
      }

      setLoading(false);
    });
  }, []);

  function handleRemove(id: string) {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    // Production: await db.from("wishlist_items").delete().eq("id", id)
  }

  function handleAddToCart(item: WishlistItem) {
    const cart: Record<string, unknown>[] = JSON.parse(
      localStorage.getItem("gams_cart") || "[]"
    );
    const exists = cart.find((c) => c.listing_id === item.listing_id);
    if (!exists) {
      cart.push({
        id: item.listing_id,
        listing_id: item.listing_id,
        name: item.name,
        category: item.category,
        price_paise: item.price * 100,
        original_price_paise: item.original_price * 100,
        rating: item.rating,
        qty: 1,
      });
      localStorage.setItem("gams_cart", JSON.stringify(cart));
    }
    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  }

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#7A7A7A]">Loading your wishlist…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#FF9933 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)",
        }}
      />

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#9A9A9A] mb-5">
          <Link href="/public" className="hover:text-[#5A5A5A]">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/public/marketplace" className="hover:text-[#5A5A5A]">
            Marketplace
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#1A1A1A] font-medium">My Wishlist</span>
        </div>

        {/* Cart-added toast */}
        {addedToCart && (
          <div className="fixed top-20 right-4 z-50 bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2">
            <ShoppingCart size={15} /> Added to cart!
          </div>
        )}

        {/* Page heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2.5">
              <Heart size={22} className="text-red-500 fill-red-500" /> My
              Wishlist
            </h1>
            <p className="text-sm text-[#7A7A7A] mt-1">
              {wishlistItems.length > 0
                ? `${wishlistItems.length} item${
                    wishlistItems.length !== 1 ? "s" : ""
                  } saved`
                : "No items saved yet"}
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Link
              href="/public/marketplace"
              className="flex items-center gap-2 text-sm font-semibold text-saffron-600 hover:underline"
            >
              Browse More <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* ─── Empty State ─── */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center max-w-md mx-auto mb-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={36} className="text-red-200" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-[#7A7A7A] mb-6 leading-relaxed">
              Save government-surplus assets you&apos;re interested in and buy
              them when you&apos;re ready. All items are inspector-rated and GFR
              2017 compliant.
            </p>
            <Link
              href="/public/marketplace"
              className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 transition-colors"
            >
              Browse Marketplace <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* Trust badges */}
            <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  icon: ShieldCheck,
                  label: "Govt. Verified Assets",
                  sub: "All items physically inspected & rated",
                },
                {
                  icon: Tag,
                  label: "Below Market Price",
                  sub: "Discounted government surplus",
                },
                {
                  icon: Truck,
                  label: "Tracked Delivery",
                  sub: "Nationwide logistics partner",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-green-50 border border-green-200 rounded-xl p-3 text-center"
                >
                  <Icon size={16} className="text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-green-800">{label}</p>
                  <p className="text-[10px] text-green-600 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Wishlist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {wishlistItems.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Go to cart CTA */}
            <div className="flex justify-center mb-10">
              <Link
                href="/public/cart"
                className="flex items-center gap-2 text-sm font-semibold text-saffron-700 border border-saffron-300 px-5 py-2.5 rounded-xl hover:bg-saffron-50 transition-colors"
              >
                <ShoppingCart size={15} /> Go to Cart
              </Link>
            </div>
          </>
        )}

        {/* ─── Recommended Section ─── */}
        {recommended.length > 0 && (
          <div className="border-t border-border pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Sparkles size={18} className="text-saffron-500" /> Recommended
                for You
              </h2>
              <Link
                href="/public/marketplace"
                className="text-sm text-saffron-600 font-semibold hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <p className="text-xs text-[#9A9A9A] mb-4">
              Top-rated government surplus assets available on the marketplace
              right now.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recommended.map((item) => (
                <RecommendedCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#1A3A6B] text-white py-8 mt-12">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AshokaChakra size={28} />
            <div>
              <p className="text-sm font-black">GAMS</p>
              <p className="text-[10px] text-blue-200">
                Government Asset Management System
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-200">
            © {new Date().getFullYear()} Ministry of Finance, Government of
            India · All rights reserved · GFR 2017 Compliant
          </p>
        </div>
      </footer>
    </>
  );
}
