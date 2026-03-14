"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@gams/lib/supabase/server";

/** Normalize phone: strip spaces, dashes, leading 0/+91, ensure 10 digits */
function normalizePhone(raw: string): string {
  let p = raw.replace(/[\s\-().]/g, "");
  // Remove leading +91 or 0091 or 91 (if 12 digits starting with 91) or leading 0
  if (p.startsWith("+91")) p = p.slice(3);
  else if (p.startsWith("0091")) p = p.slice(4);
  else if (p.length === 12 && p.startsWith("91")) p = p.slice(2);
  else if (p.startsWith("0")) p = p.slice(1);
  return p;
}

function normalizeOtpToken(raw: string): string {
  return (raw || "").replace(/\D/g, "").slice(0, 6);
}

function mapOtpError(message: string): string {
  const msg = (message || "").toLowerCase();

  if (msg.includes("otp_disabled")) {
    return "Phone OTP is currently unavailable. Please try password login or contact support.";
  }

  if (msg.includes("signups not allowed for otp") || msg.includes("not found") || msg.includes("user not found")) {
    return "No account found for this number. Please register first.";
  }

  if (msg.includes("invalid token") || msg.includes("expired")) {
    return "Invalid or expired OTP. Please request a new code and try again.";
  }

  return message;
}

/** Step 1: Send OTP to mobile number via Twilio SMS */
export async function sendOtpAction(formData: FormData) {
  const rawPhone = formData.get("phone") as string;
  const phone = normalizePhone(rawPhone);
  const next = (formData.get("next") as string) || "/public/account";

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    redirect(
      `/public/login?error=${encodeURIComponent("Invalid phone number. Enter a 10-digit Indian mobile number.")}&next=${encodeURIComponent(next)}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
    options: { shouldCreateUser: false },
  });

  if (error) {
    const msg = mapOtpError(error.message);
    redirect(
      `/public/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`
    );
  }

  redirect(
    `/public/login?step=otp&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}`
  );
}

/** Step 2: Verify the 6-digit OTP entered by user */
export async function verifyOtpAction(formData: FormData) {
  const rawPhone = formData.get("phone") as string;
  const phone = normalizePhone(rawPhone);
  const token = normalizeOtpToken((formData.get("token") as string) || "");
  const next = (formData.get("next") as string) || "/public/account";

  if (!/^[0-9]{6}$/.test(token)) {
    redirect(
      `/public/login?step=otp&phone=${encodeURIComponent(phone)}&error=${encodeURIComponent("Enter a valid 6-digit OTP.")}&next=${encodeURIComponent(next)}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: `+91${phone}`,
    token,
    type: "sms",
  });

  if (error) {
    redirect(
      `/public/login?step=otp&phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(mapOtpError(error.message))}&next=${encodeURIComponent(next)}`
    );
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/public");
}

