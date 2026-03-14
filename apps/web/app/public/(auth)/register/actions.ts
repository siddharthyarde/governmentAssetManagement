"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@gams/lib/supabase/server";
import { z } from "zod";

const registerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  mobile: z.string().regex(/^[6-9][0-9]{9}$/, "Enter valid 10-digit mobile"),
  email: z.string().email("Enter valid email").optional().or(z.literal("")),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  address_line1: z.string().min(5, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state_code: z.string().length(2, "Select a state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit pincode"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export async function registerAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    redirect(`/public/register?error=${encodeURIComponent(firstError.message)}`);
  }

  const data = parsed.data;
  const supabase = await createClient();

  // Create auth user with mobile as phone
  const { data: authData, error: signUpError } =
    await supabase.auth.signUp({
      email: data.email || `${data.mobile}@gams-noreply.in`,
      password: data.password,
      phone: `+91${data.mobile}`,
      options: {
        data: {
          full_name: data.full_name,
          portal: "public",
        },
      },
    });

  if (signUpError) {
    redirect(`/public/register?error=${encodeURIComponent(signUpError.message)}`);
  }

  if (authData.user) {
    // Insert into public_user_profiles
    const { error: profileError } = await supabase
      .from("public_user_profiles")
      .insert({
        id: authData.user.id,
        full_name: data.full_name,
        email: data.email || null,
        mobile: data.mobile,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || null,
        city: data.city,
        district: data.district,
        state_code: data.state_code,
        pincode: data.pincode,
      });

    if (profileError) {
      redirect(`/public/register?error=${encodeURIComponent(profileError.message)}`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/public/account?welcome=1");
}
