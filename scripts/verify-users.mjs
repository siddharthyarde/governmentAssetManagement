import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  "https://tngrjxbzamkrdkwpyqel.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZ3JqeGJ6YW1rcmRrd3B5cWVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgwNzExMSwiZXhwIjoyMDg4MzgzMTExfQ.O7SX9AKWAiX6Qo_8Q0aoouw-JhhEiBSyUkg4SSeanUc",
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TARGET_EMAILS = [
  "admin@gams.gov.in",
  "inspector@gams.gov.in",
  "volunteer@gams.gov.in",
  "viewer@gams.gov.in",
  "eventmanager@gams.gov.in",
  "warehouse@gams.gov.in",
  "citizen@example.com",
  "company@example.com",
  "ngo@example.com",
];

const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
if (error) { console.error("Error:", error.message); process.exit(1); }

const found = data.users.filter((u) => TARGET_EMAILS.includes(u.email ?? ""));

console.log("\n╔══════════════════════════════════════════════════════════════════╗");
console.log("║                  GAMS DATABASE — USER LIST                      ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

console.log(`${"Email".padEnd(32)} ${"Role".padEnd(22)} ${"Status"}`);
console.log("─".repeat(68));
for (const u of found) {
  const role = (u.user_metadata?.role ?? "—").padEnd(22);
  const confirmed = u.confirmed_at ? "✓ Confirmed" : "✗ Pending";
  console.log(`${(u.email ?? "").padEnd(32)} ${role} ${confirmed}`);
}

console.log("\n");
