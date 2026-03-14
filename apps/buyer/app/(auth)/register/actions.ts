"use server";

import { redirect } from "next/navigation";
import { createClient } from "@gams/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  name: z.string().min(3, "Institution name required"),
  institution_type: z.string().min(1, "Select institution type"),
  gov_level: z.string().optional(),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN")
    .optional()
    .or(z.literal("")),
  gstin: z.string().optional(),
  registration_number: z.string().optional(),
  contact_email: z.string().email(),
  contact_mobile: z.string().regex(/^[6-9][0-9]{9}$/),
  head_of_organisation: z.string().optional(),
  nodal_officer: z.string().min(2, "Nodal officer name required"),
  nodal_officer_mobile: z.string().regex(/^[6-9][0-9]{9}$/),
  addr_line1: z.string().min(5),
  addr_line2: z.string().optional(),
  addr_city: z.string().min(2),
  addr_district: z.string().min(2),
  addr_state: z.string().length(2),
  addr_pincode: z.string().regex(/^[1-9][0-9]{5}$/),
  is_80g: z.string().optional(),
  is_12a: z.string().optional(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export async function registerInstitutionAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    redirect(`/register?error=${encodeURIComponent(firstError.message)}`);
  }

  const d = parsed.data;
  const supabase = await createClient();

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      data: { portal: "buyer", institution_name: d.name },
    },
  });

  if (signUpError) {
    redirect(`/register?error=${encodeURIComponent(signUpError.message)}`);
  }

  if (!authData.user) {
    redirect("/register?error=Account+creation+failed");
  }

  const { data: institution, error: instError } = await supabase
    .from("institutions")
    .insert({
      name: d.name,
      institution_code: `PENDING-${Date.now()}`,
      institution_type: d.institution_type as never,
      gov_level: (d.gov_level || null) as never,
      pan: d.pan || null,
      gstin: d.gstin || null,
      registration_number: d.registration_number || null,
      contact_email: d.contact_email,
      contact_mobile: d.contact_mobile,
      head_of_organisation: d.head_of_organisation || null,
      nodal_officer: d.nodal_officer,
      nodal_officer_mobile: d.nodal_officer_mobile,
      registered_address: {
        line1: d.addr_line1,
        line2: d.addr_line2 || "",
        city: d.addr_city,
        district: d.addr_district,
        state: d.addr_state,
        pincode: d.addr_pincode,
      },
      is_80g_certified: d.is_80g === "yes",
      is_12a_certified: d.is_12a === "yes",
    })
    .select("id")
    .single();

  if (instError) {
    redirect(`/register?error=${encodeURIComponent(instError.message)}`);
  }

  await supabase.from("institution_users").insert({
    institution_id: institution.id,
    user_id: authData.user.id,
    is_primary: true,
  });

  redirect("/dashboard?registered=1");
}
