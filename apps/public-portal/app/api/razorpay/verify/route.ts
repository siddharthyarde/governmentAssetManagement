import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { createClient } from "@gams/lib/supabase/server";

const VerifySchema = z.object({
  razorpay_order_id:   z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature:  z.string().min(1),
  order_db_id:         z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = VerifySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = parsed.data;

    // Verify HMAC signature — prevents payment tamper
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (hmac !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Fetch the order to confirm it belongs to this user
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, user_id, status, total_paise")
      .eq("id", order_db_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "pending_payment") {
      // Already processed — idempotent success
      return NextResponse.json({ success: true, already_processed: true });
    }

    // Mark order as paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "payment_received",
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order_db_id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    // Insert audit log entry
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      actor_role: "citizen",
      action: "orders.payment_received",
      entity_type: "orders",
      entity_id: order_db_id,
      new_data: {
        razorpay_order_id,
        razorpay_payment_id,
        total_paise: order.total_paise,
      },
    } as never);

    // Decrement listing's available quantity (fire-and-forget; inventory will sync)
    const { data: items } = await supabase
      .from("order_items")
      .select("listing_id, quantity")
      .eq("order_id", order_db_id);

    if (items) {
      for (const item of items) {
        await supabase.rpc("decrement_listing_qty" as never, {
          p_listing_id: item.listing_id,
          p_qty: item.quantity,
        } as never);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[razorpay/verify]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
