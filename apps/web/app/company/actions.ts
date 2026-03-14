"use server";

import { createClient } from "@gams/lib/supabase/server";

// ─── Product Submission ────────────────────────────────────────────────────────

export type SubmitProductData = {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  qty: string;
  unitPrice: string;
  hsn: string;
  brand: string;
  model: string;
  specs: string;
  warrantyMonths: string;
  countryOfOrigin: string;
  makeInIndia: boolean;
  gemRegistered: boolean;
  gemId: string;
};

export async function submitProduct(
  data: SubmitProductData
): Promise<{ productCode: string } | { error: string }> {
  const db = await createClient();

  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const { data: cu, error: cuError } = await db
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (cuError || !cu) return { error: "Company not found for this user" };

  // Generate a sequential product code
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 90000) + 10000);
  const productCode = `PRD-${year}-${rand}`;

  const { error: insertError } = await db.from("products").insert({
    product_code: productCode,
    company_id: cu.company_id,
    name: data.name,
    product_type: "reusable" as const,
    category: data.category,
    sub_category: data.subcategory || null,
    description: data.description || null,
    original_price_paise: Math.round(Number(data.unitPrice) * 100),
    hsn_code: data.hsn || null,
    brand: data.brand || null,
    model_number: data.model || null,
    specifications: data.specs
      ? { notes: data.specs, country_of_origin: data.countryOfOrigin, make_in_india: data.makeInIndia, gem_registered: data.gemRegistered, gem_id: data.gemId || null }
      : { country_of_origin: data.countryOfOrigin, make_in_india: data.makeInIndia, gem_registered: data.gemRegistered },
    warranty_months: data.warrantyMonths ? Number(data.warrantyMonths) : null,
    status: "pending_approval" as const,
    gov_scope: "central",
    unit: "unit",
    images: [],
    variants: [],
  });

  if (insertError) return { error: insertError.message };
  return { productCode };
}
