/**
 * GAMS — Test User Setup Script
 * Usage: node scripts/setup-test-users.mjs
 *
 * Creates one verified Supabase auth account for each portal,
 * inserts the matching profile/company/institution rows, and
 * sends a password-reset email to siddharthyarde@gmail.com.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tngrjxbzamkrdkwpyqel.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3JqeGJ6YW1rcmRrd3B5cWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgwNzExMSwiZXhwIjoyMDg4MzgzMTExfQ.O7SX9AKWAiX6Qo_8Q0aoouw-JhhEiBSyUkg4SSeanUc";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const log  = (msg) => console.log(`  ✅ ${msg}`);
const warn = (msg) => console.warn(`  ⚠️  ${msg}`);
const fail = (msg) => { console.error(`  ❌ ${msg}`); };

// ─── Helper: upsert an auth user ──────────────────────────────────────────────
async function upsertAuthUser({ email, phone, password, full_name }) {
  const { data: listData, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw new Error(`listUsers: ${listErr.message}`);

  const existing = listData?.users?.find((u) => u.email === email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      phone_confirm: phone ? true : undefined,
      ...(phone ? { phone } : {}),
      user_metadata: { full_name },
    });
    if (error) throw new Error(`updateUser(${email}): ${error.message}`);
    log(`Auth user updated: ${email} [${existing.id}]`);
    return data.user;
  }

  const payload = { email, password, email_confirm: true, user_metadata: { full_name } };
  if (phone) { payload.phone = phone; payload.phone_confirm = true; }

  const { data, error } = await supabase.auth.admin.createUser(payload);
  if (error) throw new Error(`createUser(${email}): ${error.message}`);
  log(`Auth user created: ${email} [${data.user.id}]`);
  return data.user;
}

// ─── Helper: safe upsert (logs instead of throw on dup) ──────────────────────
async function upsertRow(table, record, conflictCol) {
  const { error } = await supabase
    .from(table)
    .upsert(record, { onConflict: conflictCol, ignoreDuplicates: false });
  if (error) {
    // Already exists with same key is fine
    if (error.code === "23505" || error.message?.includes("duplicate")) {
      warn(`${table}: row already exists (skipped)`);
    } else {
      throw new Error(`upsert(${table}): ${error.message}`);
    }
  }
}

// ─── Helper: insert if not exists by condition ────────────────────────────────
async function insertIfMissing(table, record, matchCol, matchVal) {
  const { data } = await supabase.from(table).select("id").eq(matchCol, matchVal).maybeSingle();
  if (data) { warn(`${table} [${matchCol}=${matchVal}]: already exists, skipped`); return data; }
  const { data: ins, error } = await supabase.from(table).insert(record).select("id").single();
  if (error) throw new Error(`insert(${table}): ${error.message}`);
  log(`${table} row created [id=${ins.id}]`);
  return ins;
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTAL 1 — Management / Government Staff
// ══════════════════════════════════════════════════════════════════════════════
async function setupManageAdmin() {
  console.log("\n🟠 [1/4] Manage Portal — super_admin");

  const user = await upsertAuthUser({
    email:     "superadmin@gams.gov.in",
    password:  "GAMSAdmin@2026",
    full_name: "Siddharth Yarde",
  });

  await upsertRow("user_profiles", {
    id:                   user.id,
    full_name:            "Siddharth Yarde",
    display_name:         "Siddharth (Admin)",
    email:                "superadmin@gams.gov.in",
    mobile:               "9876543210",
    employee_id:          "NIC-GOI-00001",
    designation:          "Senior Systems Administrator",
    department:           "National Informatics Centre",
    ministry:             "Ministry of Electronics and IT",
    gov_level:            "central",
    role:                 "super_admin",
    is_active:            true,
    digilocker_verified:  true,
  }, "id");

  return user;
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTAL 2 — Company / Supplier
// ══════════════════════════════════════════════════════════════════════════════
async function setupCompanyUser() {
  console.log("\n🟠 [2/4] Company Portal — company_rep");

  const user = await upsertAuthUser({
    email:     "supplier@technocraft.gams.in",
    password:  "GAMSSupplier@2026",
    full_name: "Siddharth Yarde",
  });

  // Insert into user_profiles (company reps are also in user_profiles)
  await upsertRow("user_profiles", {
    id:                  user.id,
    full_name:           "Siddharth Yarde",
    display_name:        "TechnoCraft — Siddharth",
    email:               "supplier@technocraft.gams.in",
    mobile:              "9876543211",
    designation:         "Director",
    department:          "Operations",
    gov_level:           "central",
    role:                "company_rep",
    is_active:           true,
    digilocker_verified: false,
  }, "id");

  // Create company
  const company = await insertIfMissing("companies", {
    company_code:      "DLH001",
    legal_name:        "TechnoCraft Solutions Pvt Ltd",
    trade_name:        "TechnoCraft",
    cin:               "U72900DL2020PTC370001",
    gstin:             "07AABCT1234R1ZS",
    pan:               "AABCT1234R",
    is_msme:           true,
    msme_category:     "small",
    registered_address: {
      line1:    "Plot 24, Sector 18, NSP",
      city:     "New Delhi",
      district: "New Delhi",
      state:    "DL",
      pincode:  "110034",
    },
    contact_email:  "supplier@technocraft.gams.in",
    contact_mobile: "9876543211",
    status:         "approved",
    bank_account: {
      bank_name:         "State Bank of India",
      ifsc:              "SBIN0001234",
      account_no_masked: "XXXX-XXXX-3421",
    },
  }, "company_code", "DLH001");

  // Link user → company
  const { data: existingLink } = await supabase
    .from("company_users")
    .select("id")
    .eq("company_id", company.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingLink) {
    const { error: linkErr } = await supabase.from("company_users").insert({
      company_id: company.id,
      user_id:    user.id,
      is_primary: true,
    });
    if (linkErr) throw new Error(`company_users link: ${linkErr.message}`);
    log("company_users link created");
  } else {
    warn("company_users link already exists, skipped");
  }

  return user;
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTAL 3 — Buyer / Institutional
// ══════════════════════════════════════════════════════════════════════════════
async function setupBuyerUser() {
  console.log("\n🟠 [3/4] Buyer Portal — institution_rep");

  const user = await upsertAuthUser({
    email:     "nodal@ashafoundation.gams.in",
    password:  "GAMSBuyer@2026",
    full_name: "Siddharth Yarde",
  });

  await upsertRow("user_profiles", {
    id:                  user.id,
    full_name:           "Siddharth Yarde",
    display_name:        "Asha Foundation — Nodal Officer",
    email:               "nodal@ashafoundation.gams.in",
    mobile:              "9876543212",
    designation:         "Nodal Officer",
    department:          "Administration",
    gov_level:           "state",
    role:                "institution_rep",
    is_active:           true,
    digilocker_verified: false,
  }, "id");

  // Create institution
  const inst = await insertIfMissing("institutions", {
    institution_code:    "NGO-MH-0001",
    name:                "Asha Foundation",
    institution_type:    "ngo_registered",
    registration_number: "MH/2018/REG/12345",
    pan:                 "AAATF1234K",
    status:              "approved",
    contact_email:       "nodal@ashafoundation.gams.in",
    contact_mobile:      "9876543212",
    registered_address: {
      line1:    "45, Shivaji Nagar",
      city:     "Pune",
      district: "Pune",
      state:    "MH",
      pincode:  "411005",
    },
    nodal_officer:        "Siddharth Yarde",
    nodal_officer_mobile: "9876543212",
    head_of_organisation: "Siddharth Yarde",
    is_80g_certified:     true,
    is_12a_certified:     true,
  }, "institution_code", "NGO-MH-0001");

  // Link user → institution
  const { data: existingLink } = await supabase
    .from("institution_users")
    .select("id")
    .eq("institution_id", inst.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingLink) {
    const { error: linkErr } = await supabase.from("institution_users").insert({
      institution_id: inst.id,
      user_id:        user.id,
      is_primary:     true,
    });
    if (linkErr) throw new Error(`institution_users link: ${linkErr.message}`);
    log("institution_users link created");
  } else {
    warn("institution_users link already exists");
  }

  return user;
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTAL 4 — Public / Citizen
// ══════════════════════════════════════════════════════════════════════════════
async function setupPublicUser() {
  console.log("\n🟠 [4/4] Public Portal — citizen (Siddharth Yarde)");

  const user = await upsertAuthUser({
    email:     "siddharthyarde@gmail.com",
    password:  "GAMSCitizen@2026",
    full_name: "Siddharth Yarde",
  });

  await upsertRow("public_user_profiles", {
    id:               user.id,
    full_name:        "Siddharth Yarde",
    email:            "siddharthyarde@gmail.com",
    mobile:           "+919999999999",
    aadhaar_masked:   "XXXX-XXXX-9999",
    aadhaar_verified: false,
    city:             "Pune",
    state_code:       "MH",
    pincode:          "411001",
    is_active:        true,
  }, "id");

  return user;
}

// ══════════════════════════════════════════════════════════════════════════════
// EMAIL TEST — send a password-reset email
// ══════════════════════════════════════════════════════════════════════════════
async function testEmailDelivery(email) {
  console.log(`\n📧 Testing email delivery → ${email}`);
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: "http://localhost:3000/public/login" },
  });
  if (error) {
    fail(`Email test: ${error.message}`);
    return;
  }
  log(`Password-reset link generated (Supabase SMTP will deliver it)`);
  if (data?.properties?.action_link) {
    console.log("  📎 Direct link (if SMTP not configured):", data.properties.action_link);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// API TESTS — ping every table + view
// ══════════════════════════════════════════════════════════════════════════════
async function testApiCalls() {
  console.log("\n🔌 API / Table health check:");

  const tables = [
    "user_profiles",
    "public_user_profiles",
    "companies",
    "company_users",
    "institutions",
    "institution_users",
    "products",
    "product_instances",
    "events",
    "redistribution_listings",
    "orders",
    "order_items",
    "notifications",
    "audit_logs",
    "defects",
    "scans",
    "condition_ratings",
  ];

  let passed = 0, failed = 0;
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
    if (error) {
      fail(`${t}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ ${t.padEnd(28)} ${count ?? 0} rows`);
      passed++;
    }
  }

  // Views
  for (const v of ["v_marketplace", "v_active_events"]) {
    const { data, error } = await supabase.from(v).select("*").limit(1);
    if (error) {
      fail(`VIEW ${v}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ VIEW ${v.padEnd(22)} OK`);
      passed++;
    }
  }

  console.log(`\n  Results: ${passed} passed, ${failed} failed`);
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║          GAMS — Test User & Database Setup Script               ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");

  try {
    const adminUser   = await setupManageAdmin();
    const companyUser = await setupCompanyUser();
    const buyerUser   = await setupBuyerUser();
    const publicUser  = await setupPublicUser();

    await testEmailDelivery("siddharthyarde@gmail.com");
    await testApiCalls();

    console.log("\n");
    console.log("╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║                     TEST CREDENTIALS SUMMARY                        ║");
    console.log("╠═══════════╦═══════════════════════════════════╦══════════════════════╣");
    console.log("║ PORTAL    ║ EMAIL                             ║ PASSWORD             ║");
    console.log("╠═══════════╬═══════════════════════════════════╬══════════════════════╣");
    console.log("║ Manage    ║ superadmin@gams.gov.in            ║ GAMSAdmin@2026       ║");
    console.log("║ Company   ║ supplier@technocraft.gams.in      ║ GAMSSupplier@2026    ║");
    console.log("║ Buyer     ║ nodal@ashafoundation.gams.in      ║ GAMSBuyer@2026       ║");
    console.log("║ Public    ║ siddharthyarde@gmail.com          ║ GAMSCitizen@2026     ║");
    console.log("╠═══════════╬═══════════════════════════════════╬══════════════════════╣");
    console.log("║ LOGIN URLs: /manage/login  /company/login  /buyer/login  /public/login ║");
    console.log("╚══════════════════════════════════════════════════════════════════════╝");
    console.log("\n  Auth UUIDs:");
    console.log("  Manage  :", adminUser.id);
    console.log("  Company :", companyUser.id);
    console.log("  Buyer   :", buyerUser.id);
    console.log("  Public  :", publicUser.id);
    console.log("\n✅ All done!");
  } catch (e) {
    fail(e.message);
    console.error(e);
    process.exit(1);
  }
}

main();
