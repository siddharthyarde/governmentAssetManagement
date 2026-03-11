"use server";

import { createAdminClient } from "@gams/lib/supabase/admin";
import { createClient as createServerClient } from "@gams/lib/supabase/server";
import { verifyQrPayload } from "@gams/lib/id-generator";
import type { UserRole, GovLevel, EventType, EventStatus, ScanAction, DefectSeverity } from "@gams/lib/supabase/database.types";

// ─── Company Actions ──────────────────────────────────────────────────────────

export async function approveCompany(companyCode: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("company_code", companyCode);
  if (error) throw new Error(error.message);
}

export async function rejectCompany(companyCode: string, reason: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ status: "blacklisted", review_notes: reason, reviewed_at: new Date().toISOString() })
    .eq("company_code", companyCode);
  if (error) throw new Error(error.message);
}

export async function requestInfoCompany(companyCode: string, note: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ status: "documents_requested", review_notes: note, reviewed_at: new Date().toISOString() })
    .eq("company_code", companyCode);
  if (error) throw new Error(error.message);
}

export async function suspendCompany(companyCode: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ status: "suspended", reviewed_at: new Date().toISOString() })
    .eq("company_code", companyCode);
  if (error) throw new Error(error.message);
}

export async function reinstateCompany(companyCode: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("company_code", companyCode);
  if (error) throw new Error(error.message);
}

// ─── Institution Actions ──────────────────────────────────────────────────────

export async function approveInstitution(institutionCode: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("institutions")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("institution_code", institutionCode);
  if (error) throw new Error(error.message);
}

export async function rejectInstitution(institutionCode: string, reason: string) {
  const admin = createAdminClient();
  // 'suspended' is the closest available negative status for institutions in the DB enum
  const { error } = await admin
    .from("institutions")
    .update({ status: "suspended", review_notes: reason, reviewed_at: new Date().toISOString() })
    .eq("institution_code", institutionCode);
  if (error) throw new Error(error.message);
}

export async function requestInfoInstitution(institutionCode: string, note: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("institutions")
    .update({ status: "documents_requested", review_notes: note, reviewed_at: new Date().toISOString() })
    .eq("institution_code", institutionCode);
  if (error) throw new Error(error.message);
}

// ─── Product Actions ──────────────────────────────────────────────────────────

export async function approveProduct(productCode: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ status: "approved" })
    .eq("product_code", productCode);
  if (error) throw new Error(error.message);
}

export async function rejectProduct(productCode: string, reason: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("products")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("product_code", productCode);
  if (error) throw new Error(error.message);
}

// ─── Staff User Actions ───────────────────────────────────────────────────────

const ROLE_MAP: Record<string, string> = {
  "Super Admin": "super_admin",
  "Admin":       "gov_admin",
  "Inspector":   "inspector",
  "Volunteer":   "volunteer",
  "Viewer":      "auditor",
};

export async function inviteStaffUser(email: string, fullName: string, uiRole: string) {
  const admin = createAdminClient();
  const dbRole = ROLE_MAP[uiRole] ?? "auditor";

  // Step 1: Send invite email via Supabase Auth
  const { data, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role: dbRole },
  });
  if (inviteErr) throw new Error(inviteErr.message);

  const userId = data.user?.id;
  if (!userId) throw new Error("Invite succeeded but no user ID returned.");

  // Step 2: Insert user_profiles row so role is set before user logs in
  const { error: profileErr } = await admin.from("user_profiles").insert({
    id: userId,
    full_name: fullName,
    email,
    role: dbRole as UserRole,
    gov_level: "central" as GovLevel,
    is_active: false, // activated when they accept the invite
  });
  if (profileErr && !profileErr.message.includes("duplicate")) {
    throw new Error(profileErr.message);
  }
}

// ─── Event Actions ────────────────────────────────────────────────────────────

export async function createEvent(data: {
  name: string;
  event_type: string;
  gov_level: string;
  state_code: string;
  district: string;
  venue: string;
  start_date: string;
  end_date: string;
  expected_footfall: number | null;
  organising_ministry: string;
  description: string;
}) {
  const admin = createAdminClient();
  const serverClient = await createServerClient();

  // Get current user to populate created_by
  const { data: { user } } = await serverClient.auth.getUser();
  const createdBy = user?.id ?? "00000000-0000-0000-0000-000000000000";

  // Generate event_code: EVT-YYYY-XXXXXX
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const event_code = `EVT-${year}-${rand}`;

  const { error } = await admin.from("events").insert({
    event_code,
    name: data.name,
    event_type: data.event_type as EventType,
    gov_level: (data.gov_level || "central") as GovLevel,
    state_code: data.state_code || null,
    district: data.district || null,
    venue: data.venue,
    start_date: data.start_date,
    end_date: data.end_date,
    expected_footfall: data.expected_footfall,
    organising_ministry: data.organising_ministry || null,
    description: data.description || null,
    status: "draft" as EventStatus,
    created_by: createdBy,
  });
  if (error) throw new Error(error.message);
  return event_code;
}

// ─── Scan Actions ─────────────────────────────────────────────────────────────

/**
 * Verify a QR token or plain instance code.
 * Returns product + instance info and the current user's role.
 * Also writes a "verify" scan record to the scans table.
 */
export async function verifyScanToken(rawToken: string): Promise<
  | { valid: false; error: string; userRole?: UserRole }
  | {
      valid: true;
      scanId: string | null;
      instance: {
        id: string;
        code: string;
        status: string;
        warehouseLocation: string | null;
        conditionRating: number | null;
        eventId: string | null;
      };
      product: { name: string; category: string; productType: string };
      userRole: UserRole;
    }
> {
  const admin = createAdminClient();
  const serverClient = await createServerClient();

  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) return { valid: false, error: "Not authenticated" };

  const { data: profile } = await admin
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = (profile?.role ?? "auditor") as UserRole;

  // Determine if it's a signed QR payload (contains ".") or a plain instance code
  let instanceCode: string;
  let signedPayload = false;

  if (rawToken.includes(".")) {
    const payload = verifyQrPayload(rawToken);
    if (!payload) return { valid: false, error: "Invalid or tampered QR code", userRole };
    instanceCode = payload.uid;
    signedPayload = true;
  } else {
    instanceCode = rawToken.trim().toUpperCase();
  }

  // Look up product instance (try by instance_code, fall back to id)
  const { data: instance } = await admin
    .from("product_instances")
    .select("id, instance_code, product_id, status, warehouse_location, condition_rating, current_event_id")
    .or(`instance_code.eq.${instanceCode},id.eq.${instanceCode}`)
    .maybeSingle();

  if (!instance) {
    return { valid: false, error: "Asset not found in GAMS registry", userRole };
  }

  // Look up product name/category separately to avoid join type issues
  const { data: product } = await admin
    .from("products")
    .select("name, category, product_type")
    .eq("id", instance.product_id)
    .maybeSingle();

  // Record the verify scan
  const { data: scanRecord } = await admin.from("scans").insert({
    action: "verify" as ScanAction,
    instance_id: instance.id,
    scanner_id: user.id,
    scanner_role: userRole,
    is_valid: true,
    notes: signedPayload ? "Scanned via QR camera" : "Manual entry",
  }).select("id").single();

  return {
    valid: true,
    scanId: scanRecord?.id ?? null,
    instance: {
      id: instance.id,
      code: instance.instance_code,
      status: instance.status,
      warehouseLocation: instance.warehouse_location,
      conditionRating: instance.condition_rating,
      eventId: instance.current_event_id,
    },
    product: {
      name: product?.name ?? "Unknown Asset",
      category: product?.category ?? "—",
      productType: product?.product_type ?? "—",
    },
    userRole,
  };
}

/**
 * Submit a condition rating for an inspected instance.
 */
export async function submitConditionRating(data: {
  instanceId: string;
  eventId: string;
  rating: number;
  ratingLabel: string;
  notes?: string;
  recommendedAction?: string;
}) {
  const admin = createAdminClient();
  const serverClient = await createServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await admin.from("condition_ratings").insert({
    instance_id: data.instanceId,
    event_id: data.eventId,
    rated_by: user.id,
    rating: data.rating,
    rating_label: data.ratingLabel,
    notes: data.notes ?? null,
    recommended_action: data.recommendedAction ?? null,
    photos: [],
  });
  if (error) throw new Error(error.message);
}

/**
 * Submit a defect report. Creates a defect_report scan record and a defects row.
 */
export async function submitDefectReport(data: {
  instanceId: string;
  severity: DefectSeverity;
  description: string;
  scanId?: string;
}) {
  const admin = createAdminClient();
  const serverClient = await createServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await admin
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = (profile?.role ?? "volunteer") as UserRole;

  // Create (or reuse) a defect_report scan record
  let scanId = data.scanId;
  if (!scanId) {
    const { data: scan } = await admin.from("scans").insert({
      action: "defect_report" as ScanAction,
      instance_id: data.instanceId,
      scanner_id: user.id,
      scanner_role: userRole,
      is_valid: true,
    }).select("id").single();
    scanId = scan?.id;
  }
  if (!scanId) throw new Error("Failed to create scan record");

  const { error } = await admin.from("defects").insert({
    scan_id: scanId,
    instance_id: data.instanceId,
    reported_by: user.id,
    severity: data.severity,
    description: data.description,
    photos: [],
    is_resolved: false,
  });
  if (error) throw new Error(error.message);
}

/**
 * Record a warehouse receive or dispatch action and update the instance status.
 */
export async function submitWarehouseAction(data: {
  instanceId: string;
  action: "dispatch" | "receive";
  warehouseLocation?: string;
  notes?: string;
  eventId?: string;
}) {
  const admin = createAdminClient();
  const serverClient = await createServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const newStatus = data.action === "dispatch" ? "deployed" : "in_stock";

  await admin.from("product_instances").update({
    status: newStatus,
    warehouse_location: data.warehouseLocation ?? null,
    current_event_id: data.action === "dispatch" ? (data.eventId ?? null) : null,
    updated_at: new Date().toISOString(),
  }).eq("id", data.instanceId);

  const { error } = await admin.from("scans").insert({
    action: (data.action === "dispatch" ? "dispatch" : "receive") as ScanAction,
    instance_id: data.instanceId,
    scanner_id: user.id,
    scanner_role: "warehouse_officer" as UserRole,
    notes: data.notes ?? null,
    is_valid: true,
    event_id: data.eventId ?? null,
  });
  if (error) throw new Error(error.message);
}
