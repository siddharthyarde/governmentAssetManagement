"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@gams/lib/supabase/server";

/** Step 1: Send OTP to mobile via email (Supabase OTP) */
export async function sendOtpAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  const next = (formData.get("next") as string) || "/account";

  // Supabase phone OTP requires SMS provider configuration.
  // We use email OTP as fallback — user enters their mobile-linked email.
  // In production, integrate Twilio/MSG91 through Supabase Auth.
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { shouldCreateUser: false },
  });

  if (error) {
    redirect(
      `/login?step=otp&phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  redirect(
    `/login?step=otp&phone=${encodeURIComponent(phone)}&next=${encodeURIComponent(next)}`
  );
}

/** Step 2: Verify OTP entered by user */
export async function verifyOtpAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;
  const next = (formData.get("next") as string) || "/account";

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    redirect(
      `/login?step=otp&phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
