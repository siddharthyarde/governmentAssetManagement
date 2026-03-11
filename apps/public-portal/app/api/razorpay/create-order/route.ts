import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { createClient } from "@gams/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const CreateOrderSchema = z.object({
  listing_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  shipping_address: z.object({
    line1:    z.string().min(1).max(200),
    line2:    z.string().max(200).optional(),
    city:     z.string().min(1).max(100),
    district: z.string().min(1).max(100),
    state:    z.string().min(1).max(100),
    pincode:  z.string().regex(/^\d{6}$/),
  }),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = CreateOrderSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { listing_id, quantity, shipping_address } = parsed.data;

    // Get session user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Fetch listing + product details
    const { data: listing, error: listingError } = await supabase
      .from("redistribution_listings")
      .select("id, listed_price_paise, original_price_paise, quantity_available, status")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.status !== "listed") {
      return NextResponse.json({ error: "Listing is no longer available" }, { status: 409 });
    }

    if (listing.quantity_available < quantity) {
      return NextResponse.json(
        { error: `Only ${listing.quantity_available} units available` },
        { status: 409 }
      );
    }

    const unit_price = listing.listed_price_paise ?? listing.original_price_paise;
    const subtotal_paise = unit_price * quantity;
    const shipping_paise = 0; // Free shipping for govt redistribution
    const total_paise = subtotal_paise + shipping_paise;

    // Generate sequential order number
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });
    const seq = String((count ?? 0) + 1).padStart(8, "0");
    const order_number = `ORD-${new Date().getFullYear()}-${seq}`;

    // Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: total_paise,
      currency: "INR",
      receipt: order_number,
      notes: {
        listing_id,
        user_id: user.id,
        quantity: String(quantity),
      },
    });

    // Insert pending order into DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number,
        user_id: user.id,
        status: "pending_payment",
        subtotal_paise,
        shipping_paise,
        total_paise,
        razorpay_order_id: rzpOrder.id,
        shipping_address: {
          ...shipping_address,
          full_name: user.user_metadata?.full_name ?? "—",
          email: user.email ?? "",
        },
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order record" },
        { status: 500 }
      );
    }

    // Insert order item
    await supabase.from("order_items").insert({
      order_id: order.id,
      listing_id,
      quantity,
      unit_price_paise: unit_price,
      total_paise: subtotal_paise,
    });

    return NextResponse.json({
      order_id: rzpOrder.id,           // Razorpay order ID for checkout
      order_db_id: order.id,           // Our DB order ID
      order_number,
      amount: total_paise,             // paise
      currency: "INR",
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
