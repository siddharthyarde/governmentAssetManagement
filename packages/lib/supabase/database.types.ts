/**
 * Supabase Database Types
 * Hand-crafted to match supabase/migrations/001_initial_schema.sql
 * Run `supabase gen types typescript --project-id tngrjxbzamkrdkwpyqel` to regenerate.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Enum types ────────────────────────────────────────────────────────────────
export type GovLevel = "central" | "state" | "municipal" | "panchayat";
export type UserRole =
  | "super_admin" | "gov_admin" | "event_manager" | "inspector"
  | "volunteer" | "warehouse_officer" | "auditor"
  | "company_rep" | "institution_rep" | "citizen";
export type CompanyStatus =
  | "pending_review" | "documents_requested" | "approved" | "suspended" | "blacklisted";
export type InstitutionType =
  | "central_govt" | "state_govt" | "municipal_body" | "panchayat"
  | "public_sector_undertaking" | "autonomous_body" | "ngo_registered"
  | "educational_institution" | "hospital_govt" | "defence" | "police" | "other";
export type InstitutionStatus =
  | "pending_review" | "documents_requested" | "approved" | "suspended" | "rejected";
export type ProductType = "reusable" | "disposable";
export type ProductStatus =
  | "draft" | "pending_approval" | "approved" | "rejected" | "discontinued";
export type ProductInstanceStatus =
  | "in_stock" | "deployed" | "in_transit" | "under_repair"
  | "pending_rating" | "redistributed" | "condemned" | "lost" | "written_off";
export type EventType =
  | "national_celebration" | "state_celebration" | "cultural" | "sports"
  | "exhibition" | "relief_distribution" | "public_service" | "other";
export type EventStatus =
  | "draft" | "approved" | "assets_requested" | "assets_confirmed"
  | "ongoing" | "ended" | "post_event_review" | "closed";
export type ScanAction =
  | "check_in" | "check_out" | "defect_report" | "condition_rating"
  | "dispatch" | "receive" | "verify";
export type DefectSeverity = "minor" | "moderate" | "major" | "critical";
export type RedistributionType =
  | "public_sale" | "inter_government" | "ngo_donation" | "freebie";
export type RedistributionStatus =
  | "listed" | "reserved" | "dispatched" | "completed" | "cancelled";
export type OrderStatus =
  | "pending_payment" | "payment_received" | "processing"
  | "dispatched" | "delivered" | "returned" | "refunded" | "cancelled";
export type RepairStatus =
  | "assessed" | "sent_for_repair" | "under_repair" | "repaired" | "beyond_repair";

// ── Table row types ───────────────────────────────────────────────────────────
export type UserProfileRow = {
  id: string;
  full_name: string;
  display_name: string | null;
  email: string;
  mobile: string | null;
  aadhaar_masked: string | null;
  employee_id: string | null;
  designation: string | null;
  department: string | null;
  ministry: string | null;
  gov_level: GovLevel;
  state_code: string | null;
  district: string | null;
  role: UserRole;
  avatar_url: string | null;
  digilocker_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicUserProfileRow = {
  id: string;
  full_name: string;
  email: string | null;
  mobile: string;
  aadhaar_masked: string | null;
  aadhaar_verified: boolean;
  date_of_birth: string | null;
  gender: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  district: string | null;
  state_code: string | null;
  pincode: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanyRow = {
  id: string;
  company_code: string;
  legal_name: string;
  trade_name: string | null;
  cin: string | null;
  gstin: string | null;
  pan: string;
  msme_number: string | null;
  is_msme: boolean;
  msme_category: string | null;
  registered_address: Json;
  contact_email: string;
  contact_mobile: string;
  website: string | null;
  logo_url: string | null;
  status: CompanyStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  documents: Json;
  bank_account: Json | null;
  created_at: string;
  updated_at: string;
};

export type InstitutionRow = {
  id: string;
  institution_code: string;
  name: string;
  institution_type: InstitutionType;
  gov_level: GovLevel | null;
  pan: string | null;
  gstin: string | null;
  registration_number: string | null;
  registered_address: Json;
  contact_email: string;
  contact_mobile: string;
  head_of_organisation: string | null;
  nodal_officer: string | null;
  nodal_officer_mobile: string | null;
  status: InstitutionStatus;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  documents: Json;
  is_80g_certified: boolean;
  is_12a_certified: boolean;
  created_at: string;
  updated_at: string;
};

export type CompanyUserRow = {
  id: string;
  company_id: string;
  user_id: string;
  is_primary: boolean;
  created_at: string;
};

export type InstitutionUserRow = {
  id: string;
  institution_id: string;
  user_id: string;
  is_primary: boolean;
  created_at: string;
};

export type ProductRow = {
  id: string;
  product_code: string;
  company_id: string;
  name: string;
  name_hi: string | null;
  description: string | null;
  description_hi: string | null;
  product_type: ProductType;
  category: string;
  sub_category: string | null;
  gov_scope: string;
  brand: string | null;
  model_number: string | null;
  hsn_code: string | null;
  unit: string;
  original_price_paise: number;
  specifications: Json;
  variants: Json;
  images: Json;
  status: ProductStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  mfg_year: number | null;
  warranty_months: number | null;
  created_at: string;
  updated_at: string;
};

export type ProductInstanceRow = {
  id: string;
  instance_code: string;
  product_id: string;
  company_id: string;
  qr_payload: string | null;
  qr_generated_at: string | null;
  serial_number: string | null;
  variant_index: number;
  purchase_price_paise: number | null;
  mfg_date: string | null;
  mfg_year: number | null;
  condition_rating: number | null;
  status: ProductInstanceStatus;
  current_event_id: string | null;
  warehouse_location: string | null;
  procured_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  event_code: string;
  name: string;
  name_hi: string | null;
  event_type: EventType;
  description: string | null;
  gov_level: GovLevel;
  organising_ministry: string | null;
  state_code: string | null;
  district: string | null;
  venue: string;
  venue_coordinates: unknown | null;
  start_date: string;
  end_date: string;
  expected_footfall: number | null;
  status: EventStatus;
  created_by: string;
  approved_by: string | null;
  approved_at: string | null;
  closed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RedistributionListingRow = {
  id: string;
  listing_code: string;
  instance_id: string | null;
  batch_id: string | null;
  redistribution_type: RedistributionType;
  condition_rating: number | null;
  listed_price_paise: number | null;
  original_price_paise: number;
  discount_pct: number | null;
  quantity_available: number;
  quantity_reserved: number;
  eligible_for: InstitutionType[] | null;
  status: RedistributionStatus;
  listed_by: string;
  listed_at: string;
  expires_at: string | null;
  delivery_photos: Json;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal_paise: number;
  shipping_paise: number;
  total_paise: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  paid_at: string | null;
  shipping_address: Json;
  tracking_number: string | null;
  dispatched_at: string | null;
  delivered_at: string | null;
  delivery_photos: Json;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  listing_id: string;
  instance_id: string | null;
  batch_id: string | null;
  quantity: number;
  unit_price_paise: number;
  total_paise: number;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export type AuditLogRow = {
  id: string;
  logged_at: string;
  actor_id: string | null;
  actor_role: UserRole | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Json | null;
  new_data: Json | null;
  ip_address: string | null;
  user_agent: string | null;
};

export type DefectRow = {
  id: string;
  scan_id: string;
  instance_id: string | null;
  batch_id: string | null;
  event_id: string | null;
  reported_by: string | null;
  severity: DefectSeverity;
  description: string;
  photos: Json;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_note: string | null;
  created_at: string;
};

export type ScanRow = {
  id: string;
  scanned_at: string;
  scanner_id: string | null;
  scanner_role: UserRole | null;
  instance_id: string | null;
  batch_id: string | null;
  event_id: string | null;
  action: ScanAction;
  latitude: number | null;
  longitude: number | null;
  device_info: Json;
  notes: string | null;
  is_valid: boolean;
};

export type ConditionRatingRow = {
  id: string;
  instance_id: string;
  event_id: string;
  rated_by: string;
  rated_at: string;
  rating: number;
  rating_label: string;
  notes: string | null;
  photos: Json;
  recommended_action: string | null;
};

export type RedistributionRequestRow = {
  id: string;
  listing_id: string;
  requested_by_user: string | null;
  requested_by_institution: string | null;
  quantity_requested: number;
  status: RedistributionStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// ── Main Database interface ───────────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: Partial<UserProfileRow> & Pick<UserProfileRow, "id" | "full_name" | "email" | "gov_level" | "role">;
        Update: Partial<UserProfileRow>;
        Relationships: [];
      };
      public_user_profiles: {
        Row: PublicUserProfileRow;
        Insert: Partial<PublicUserProfileRow> & Pick<PublicUserProfileRow, "id" | "full_name" | "mobile">;
        Update: Partial<PublicUserProfileRow>;
        Relationships: [];
      };
      companies: {
        Row: CompanyRow;
        Insert: Partial<CompanyRow> & Pick<CompanyRow, "legal_name" | "pan" | "contact_email" | "contact_mobile" | "registered_address" | "company_code">;
        Update: Partial<CompanyRow>;
        Relationships: [];
      };
      company_users: {
        Row: CompanyUserRow;
        Insert: Pick<CompanyUserRow, "company_id" | "user_id"> & Partial<CompanyUserRow>;
        Update: Partial<CompanyUserRow>;
        Relationships: [];
      };
      institutions: {
        Row: InstitutionRow;
        Insert: Partial<InstitutionRow> & Pick<InstitutionRow, "name" | "institution_code" | "institution_type" | "contact_email" | "contact_mobile" | "registered_address">;
        Update: Partial<InstitutionRow>;
        Relationships: [];
      };
      institution_users: {
        Row: InstitutionUserRow;
        Insert: Pick<InstitutionUserRow, "institution_id" | "user_id"> & Partial<InstitutionUserRow>;
        Update: Partial<InstitutionUserRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & Pick<ProductRow, "product_code" | "company_id" | "name" | "product_type" | "category" | "original_price_paise">;
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      product_instances: {
        Row: ProductInstanceRow;
        Insert: Partial<ProductInstanceRow> & Pick<ProductInstanceRow, "instance_code" | "product_id" | "company_id">;
        Update: Partial<ProductInstanceRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Partial<EventRow> & Pick<EventRow, "event_code" | "name" | "event_type" | "gov_level" | "venue" | "start_date" | "end_date" | "created_by">;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      redistribution_listings: {
        Row: RedistributionListingRow;
        Insert: Partial<RedistributionListingRow> & Pick<RedistributionListingRow, "listing_code" | "redistribution_type" | "original_price_paise" | "quantity_available" | "listed_by">;
        Update: Partial<RedistributionListingRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> & Pick<OrderRow, "order_number" | "user_id" | "shipping_address">;
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Partial<OrderItemRow> & Pick<OrderItemRow, "order_id" | "listing_id" | "quantity" | "unit_price_paise" | "total_paise">;
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & Pick<NotificationRow, "user_id" | "title" | "body">;
        Update: Partial<NotificationRow>;
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Partial<AuditLogRow> & Pick<AuditLogRow, "action" | "entity_type">;
        Update: never;
        Relationships: [];
      };
      defects: {
        Row: DefectRow;
        Insert: Partial<DefectRow> & Pick<DefectRow, "scan_id" | "severity" | "description">;
        Update: Partial<DefectRow>;
        Relationships: [];
      };
      scans: {
        Row: ScanRow;
        Insert: Partial<ScanRow> & Pick<ScanRow, "action">;
        Update: Partial<ScanRow>;
        Relationships: [];
      };
      condition_ratings: {
        Row: ConditionRatingRow;
        Insert: Partial<ConditionRatingRow> & Pick<ConditionRatingRow, "instance_id" | "event_id" | "rated_by" | "rating" | "rating_label">;
        Update: Partial<ConditionRatingRow>;
        Relationships: [];
      };
      redistribution_requests: {
        Row: RedistributionRequestRow;
        Insert: Partial<RedistributionRequestRow> & Pick<RedistributionRequestRow, "listing_id" | "quantity_requested">;
        Update: Partial<RedistributionRequestRow>;
        Relationships: [];
      };
    };
    Views: {
      v_active_events: {
        Row: {
          id: string;
          event_code: string;
          name: string;
          event_type: EventType;
          gov_level: GovLevel;
          venue: string;
          start_date: string;
          end_date: string;
          status: EventStatus;
          instance_count: number;
          batch_count: number;
        };
        Relationships: [];
      };
      v_marketplace: {
        Row: {
          id: string;
          listing_code: string;
          redistribution_type: RedistributionType;
          condition_rating: number | null;
          listed_price_paise: number | null;
          original_price_paise: number;
          discount_pct: number | null;
          quantity_available: number;
          delivery_photos: Json;
          product_name: string;
          product_name_hi: string | null;
          category: string;
          product_images: Json;
          specifications: Json;
          brand: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [fn: string]: {
        Args: Record<string, unknown> | never;
        Returns: unknown;
      };
    };
    Enums: {
      gov_level: GovLevel;
      user_role: UserRole;
      company_status: CompanyStatus;
      institution_type: InstitutionType;
      institution_status: InstitutionStatus;
      product_type: ProductType;
      product_status: ProductStatus;
      product_instance_status: ProductInstanceStatus;
      event_type: EventType;
      event_status: EventStatus;
      scan_action: ScanAction;
      defect_severity: DefectSeverity;
      redistribution_type: RedistributionType;
      redistribution_status: RedistributionStatus;
      order_status: OrderStatus;
      repair_status: RepairStatus;
    };
  };
}
