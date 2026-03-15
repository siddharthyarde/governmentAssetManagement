/**
 * GAMS — Email + API Health Check
 * node scripts/test-api-and-email.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tngrjxbzamkrdkwpyqel.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3JqeGJ6YW1rcmRrd3B5cWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgwNzExMSwiZXhwIjoyMDg4MzgzMTExfQ.O7SX9AKWAiX6Qo_8Q0aoouw-JhhEiBSyUkg4SSeanUc";

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // ── EMAIL DELIVERY TEST ────────────────────────────────────────────────────
  console.log("\n━━━ EMAIL DELIVERY TEST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const { data: emailData, error: emailErr } = await sb.auth.admin.generateLink({
    type: "recovery",
    email: "siddharthyarde@gmail.com",
    options: { redirectTo: "http://localhost:3000/public/login" },
  });
  if (emailErr) {
    console.error("  ❌ Email link generation failed:", emailErr.message);
  } else {
    console.log("  ✅ Password-reset link generated for siddharthyarde@gmail.com");
    const link = emailData?.properties?.action_link;
    if (link) {
      console.log("  📎 Direct link (use if SMTP not configured):");
      console.log("    ", link);
    } else {
      console.log("  📧 Link sent via Supabase email — check siddharthyarde@gmail.com");
    }
  }

  // ── API / TABLE HEALTH CHECK ───────────────────────────────────────────────
  console.log("\n━━━ TABLE HEALTH CHECK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const tables = [
    "user_profiles", "public_user_profiles", "companies", "company_users",
    "institutions", "institution_users", "products", "product_instances",
    "product_batches", "events", "event_products", "redistribution_listings",
    "redistribution_requests", "orders", "order_items", "notifications",
    "audit_logs", "defects", "scans", "condition_ratings",
  ];

  let passed = 0, failed = 0;
  for (const t of tables) {
    const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
    if (error) {
      console.log(`  ❌ ${t.padEnd(32)} ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓  ${t.padEnd(32)} ${count} rows`);
      passed++;
    }
  }

  console.log("\n  Views:");
  for (const v of ["v_marketplace", "v_active_events"]) {
    const { data, error } = await sb.from(v).select("*").limit(5);
    if (error) {
      console.log(`  ❌ ${v.padEnd(32)} ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓  ${v.padEnd(32)} ${data.length} rows returned`);
      passed++;
    }
  }

  console.log(`\n  Summary: ${passed} passed | ${failed} failed`);

  // ── VERIFY USER RECORDS ────────────────────────────────────────────────────
  console.log("\n━━━ USER RECORD VERIFICATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const checks = [
    { id: "a4274b54-f3b5-41fa-8c87-a188f52b003c", label: "Manage Admin",     table: "user_profiles" },
    { id: "f376e4e5-45a8-430c-bec6-573e0ddeae99", label: "Company Supplier", table: "user_profiles" },
    { id: "f3b890fe-aa29-4741-bb1e-14d0b416db5a", label: "Buyer Nodal",      table: "user_profiles" },
    { id: "b893ad95-d3ef-4b6b-bd28-13c797f2566a", label: "Citizen Siddharth",table: "public_user_profiles" },
  ];

  for (const { id, label, table } of checks) {
    const { data: row } = await sb
      .from(table)
      .select("full_name, role, is_active, email, mobile")
      .eq("id", id)
      .maybeSingle();

    if (row) {
      console.log(`  ✓  ${label.padEnd(22)} → ${row.full_name} | role: ${row.role ?? "citizen"} | active: ${row.is_active}`);
    } else {
      console.log(`  ❌ ${label.padEnd(22)} → NOT FOUND in ${table}`);
    }
  }

  // ── COMPANY + INSTITUTION RECORDS ─────────────────────────────────────────
  console.log("\n━━━ COMPANY / INSTITUTION RECORDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const { data: company } = await sb.from("companies").select("legal_name, status, company_code").eq("company_code", "DLH001").maybeSingle();
  if (company) console.log(`  ✓  Company: ${company.legal_name} [${company.company_code}] — ${company.status}`);
  else console.log("  ❌ Company DLH001 not found");

  const { data: inst } = await sb.from("institutions").select("name, status, institution_code").eq("institution_code", "NGO-MH-0001").maybeSingle();
  if (inst) console.log(`  ✓  Institution: ${inst.name} [${inst.institution_code}] — ${inst.status}`);
  else console.log("  ❌ Institution NGO-MH-0001 not found");

  // ── SUPABASE AUTH SMTP STATUS ──────────────────────────────────────────────
  console.log("\n━━━ FINAL CREDENTIALS SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ┌─────────────┬─────────────────────────────────────────┬──────────────────────┐");
  console.log("  │ PORTAL      │ EMAIL / LOGIN                           │ PASSWORD             │");
  console.log("  ├─────────────┼─────────────────────────────────────────┼──────────────────────┤");
  console.log("  │ Manage      │ superadmin@gams.gov.in                  │ GAMSAdmin@2026       │");
  console.log("  │ Company     │ supplier@technocraft.gams.in            │ GAMSSupplier@2026    │");
  console.log("  │ Buyer       │ nodal@ashafoundation.gams.in            │ GAMSBuyer@2026       │");
  console.log("  │ Public      │ siddharthyarde@gmail.com                │ GAMSCitizen@2026     │");
  console.log("  └─────────────┴─────────────────────────────────────────┴──────────────────────┘");
  console.log("  NOTE: Public portal login is being updated to email+password (OTP disabled).");
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });
