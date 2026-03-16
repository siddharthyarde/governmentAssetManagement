/**
 * GAMS — Create Test Users Script
 * Creates one user per role with a known password.
 *
 * Usage:  node scripts/create-test-users.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tngrjxbzamkrdkwpyqel.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3JqeGJ6YW1rcmRrd3B5cWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgwNzExMSwiZXhwIjoyMDg4MzgzMTExfQ.O7SX9AKWAiX6Qo_8Q0aoouw-JhhEiBSyUkg4SSeanUc";

// Admin/service client – bypasses RLS
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Test user definitions ────────────────────────────────────────────────────

const TEST_USERS = [
  // ── Manage portal (government staff) ──────────────────────────────────────
  {
    email: "admin@gams.gov.in",
    password: "Admin@1234",
    full_name: "System Administrator",
    role: "super_admin",
    gov_level: "central",
    designation: "System Administrator",
    department: "National Informatics Centre",
    portal: "manage",
  },
  {
    email: "inspector@gams.gov.in",
    password: "Inspector@1234",
    full_name: "Mukesh Verma",
    role: "inspector",
    gov_level: "central",
    designation: "Asset Inspector",
    department: "Ministry of Finance",
    portal: "manage",
  },
  {
    email: "volunteer@gams.gov.in",
    password: "Volunteer@1234",
    full_name: "Ramesh Kumar",
    role: "volunteer",
    gov_level: "state",
    designation: "Event Volunteer",
    department: "State Government Delhi",
    portal: "manage",
  },
  {
    email: "viewer@gams.gov.in",
    password: "Viewer@1234",
    full_name: "Audit Officer",
    role: "auditor",
    gov_level: "central",
    designation: "Auditor",
    department: "Comptroller and Auditor General",
    portal: "manage",
  },
  {
    email: "eventmanager@gams.gov.in",
    password: "Manager@1234",
    full_name: "Priya Singh",
    role: "event_manager",
    gov_level: "central",
    designation: "Event Manager",
    department: "Ministry of Finance",
    portal: "manage",
  },
  {
    email: "warehouse@gams.gov.in",
    password: "Warehouse@1234",
    full_name: "Suresh Nair",
    role: "warehouse_officer",
    gov_level: "central",
    designation: "Warehouse Officer",
    department: "Ministry of Finance",
    portal: "manage",
  },

  // ── Public portal (citizen) ────────────────────────────────────────────────
  {
    email: "citizen@example.com",
    password: "Citizen@1234",
    full_name: "Rahul Sharma",
    role: "citizen",
    portal: "public",
  },

  // ── Company portal (supplier) ──────────────────────────────────────────────
  {
    email: "company@example.com",
    password: "Company@1234",
    full_name: "TechCorp Representative",
    role: "company_rep",
    portal: "company",
  },

  // ── Buyer/Institutional portal ─────────────────────────────────────────────
  {
    email: "ngo@example.com",
    password: "Ngo@12345",
    full_name: "Asha Foundation",
    role: "institution_rep",
    portal: "buyer",
  },
];

// ─── Helper: upsert a Supabase Auth user ─────────────────────────────────────

async function upsertAuthUser(email, password, metadata) {
  // Check if user already exists by listing (admin can't directly get by email easily)
  const { data: existing } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const found = existing?.users?.find((u) => u.email === email);

  if (found) {
    // Update password and metadata on existing user
    const { data, error } = await admin.auth.admin.updateUserById(found.id, {
      password,
      user_metadata: metadata,
      email_confirm: true,
    });
    if (error) throw new Error(`Update ${email}: ${error.message}`);
    console.log(`  ↻  Updated  : ${email} (id: ${found.id})`);
    return data.user;
  } else {
    // Create new user
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });
    if (error) throw new Error(`Create ${email}: ${error.message}`);
    console.log(`  ✓  Created  : ${email} (id: ${data.user.id})`);
    return data.user;
  }
}

// ─── Helper: upsert user_profiles row (for manage portal users) ──────────────

async function upsertUserProfile(userId, user) {
  if (user.portal !== "manage") return; // Only manage portal users need user_profiles

  const profileData = {
    id: userId,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    gov_level: user.gov_level || "central",
    designation: user.designation || null,
    department: user.department || null,
    is_active: true,
  };

  const { error } = await admin
    .from("user_profiles")
    .upsert(profileData, { onConflict: "id" });

  if (error) {
    console.warn(`  ⚠  Profile warning for ${user.email}: ${error.message}`);
  } else {
    console.log(`  ✓  Profile  : ${user.role} → user_profiles`);
  }
}

// ─── Helper: upsert public_user_profiles row (for public portal citizens) ─────

async function upsertPublicProfile(userId, user) {
  if (user.portal !== "public") return;

  const { error } = await admin.from("public_user_profiles").upsert(
    {
      id: userId,
      full_name: user.full_name,
      email: user.email,
      mobile: "9999999999",
      aadhaar_verified: false,
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.warn(`  ⚠  Public profile warning for ${user.email}: ${error.message}`);
  } else {
    console.log(`  ✓  Profile  : citizen → public_user_profiles`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════════════");
console.log("  GAMS — Test User Setup                                    ");
console.log("═══════════════════════════════════════════════════════════\n");

const results = [];

for (const user of TEST_USERS) {
  console.log(`\n[${user.portal.toUpperCase()}] ${user.full_name} <${user.email}>`);
  try {
    const authUser = await upsertAuthUser(user.email, user.password, {
      full_name: user.full_name,
      role: user.role,
    });

    await upsertUserProfile(authUser.id, user);
    await upsertPublicProfile(authUser.id, user);

    results.push({ ...user, id: authUser.id, status: "✓" });
  } catch (err) {
    console.error(`  ✗  FAILED   : ${err.message}`);
    results.push({ ...user, status: "✗ " + err.message });
  }
}

// ─── Print Summary ────────────────────────────────────────────────────────────

console.log("\n\n═══════════════════════════════════════════════════════════");
console.log("  CREDENTIALS SUMMARY                                       ");
console.log("═══════════════════════════════════════════════════════════\n");

const portals = ["manage", "public", "company", "buyer"];
for (const portal of portals) {
  const users = results.filter((u) => u.portal === portal);
  if (users.length === 0) continue;

  const portalLabel = {
    manage: "MANAGE PORTAL  →  http://localhost:3001/manage/login",
    public: "PUBLIC PORTAL  →  http://localhost:3001/public/login",
    company: "COMPANY PORTAL →  http://localhost:3001/company/login",
    buyer: "BUYER PORTAL   →  http://localhost:3001/buyer/login",
  }[portal];

  console.log(`\n  ${portalLabel}`);
  console.log("  " + "─".repeat(60));

  for (const u of users) {
    const rolePad = (u.role || "").padEnd(20);
    console.log(`  ${u.status} [${rolePad}]  ${u.email.padEnd(30)}  ${u.password}`);
  }
}

console.log("\n═══════════════════════════════════════════════════════════\n");
