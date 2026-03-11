// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole =
  | "super_admin"
  | "gov_admin"
  | "event_manager"
  | "warehouse_officer"
  | "auditor"
  | "volunteer"
  | "inspector"
  | "company_rep"
  | "citizen"
  | "institution_rep";

export type PortalType = "manage" | "company" | "public" | "buyer";

export type GovLevel = "central" | "state" | "municipal";

export type ProductType = "reusable" | "disposable";

export type ProductStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "discontinued"
  | "condemned"
  | "lost";

export type EventStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ongoing"
  | "ended"
  | "post_event_review"
  | "closed"
  | "archived";

export type EventType =
  | "national"
  | "state"
  | "sports"
  | "cultural"
  | "disaster_relief"
  | "institutional";

export type CompanyStatus = "pending" | "approved" | "rejected" | "suspended";

export type InstitutionType =
  | "pvt_ltd"
  | "llp"
  | "opc"
  | "partnership"
  | "trust"
  | "society"
  | "section_8"
  | "ngo"
  | "govt_institution"
  | "other";

export type RedistributionType = "public_sale" | "institution_allocation" | "freebie";

export type RedistributionStatus =
  | "available"
  | "requested"
  | "approved"
  | "dispatched"
  | "delivered"
  | "returned";

export type ConditionRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type OrderStatus =
  | "pending"
  | "payment_received"
  | "approved"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "grievance_raised";

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  cin: string;
  gem_id: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string | null;
  registered_address: string;
  state: string;
  city: string;
  pincode: string;
  status: CompanyStatus;
  credibility_score: number;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface Product {
  id: string;
  unique_id: string; // GOI-MHT001-R-ELEC-2025-00000001
  company_id: string;
  name: string;
  description: string;
  type: ProductType;
  category: string;
  subcategory: string | null;
  mfg_year: number;
  unit_price: number;
  currency: "INR";
  variants: ProductVariant[];
  delivery_photo_url: string | null;
  qr_code_url: string | null;
  is_individually_tracked: boolean; // true if price > threshold
  status: "pending_approval" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
}

export interface ProductVariant {
  name: string;       // e.g. "Color", "Size", "Material"
  value: string;      // e.g. "White", "Large", "Steel"
}

export interface ProductInstance {
  id: string;
  product_id: string;
  unique_id: string;
  serial_number: string | null;
  status: ProductStatus;
  current_event_id: string | null;
  current_area_id: string | null;
  warehouse_zone: string | null;
  warehouse_shelf: string | null;
  condition_rating: ConditionRating | null;
  last_scanned_at: string | null;
  last_scanned_by: string | null;
  created_at: string;
}

export interface ProductBatch {
  id: string;
  product_id: string;
  batch_unique_id: string;
  quantity: number;
  unit: string;
  quantity_used: number;
  status: ProductStatus;
  event_id: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  level: GovLevel;
  location: string;
  state: string;
  city: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  admin_id: string;
  description: string | null;
  expected_footfall: number | null;
  created_at: string;
}

export interface EventArea {
  id: string;
  event_id: string;
  area_name: string;
  assigned_volunteer_id: string | null;
  description: string | null;
}

export interface Defect {
  id: string;
  product_instance_id: string;
  batch_id: string | null;
  volunteer_id: string;
  description: string;
  repair_cost: number;
  photo_url: string | null;
  repair_status: "reported" | "in_repair" | "resolved";
  created_at: string;
}

export interface ConditionRatingRecord {
  id: string;
  product_instance_id: string;
  inspector_id: string;
  rating: ConditionRating;
  notes: string;
  condition_photo_url: string | null;
  rated_at: string;
}

export interface RedistributionListing {
  id: string;
  product_instance_id: string;
  listing_type: RedistributionType;
  original_price: number;
  asking_price: number;
  min_reserve_price: number;
  rating: ConditionRating;
  status: RedistributionStatus;
  listed_at: string;
  admin_id: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  notes: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  ip_address: string | null;
  created_at: string;
}

export interface PublicUser {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  aadhaar_number_hash: string; // never store raw Aadhaar
  pan_number: string | null;
  email: string;
  phone: string;
  address: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  preferred_language: "en" | "hi";
  verified: boolean;
  created_at: string;
}

export interface Institution {
  id: string;
  legal_name: string;
  org_type: InstitutionType;
  cin: string | null;
  gstin: string;
  pan: string;
  year_established: number;
  nature_of_work: string;
  annual_turnover_range: string;
  employee_count_range: string;
  registered_address: string;
  state: string;
  city: string;
  pincode: string;
  official_email: string;
  phone: string;
  website: string | null;
  signatory_name: string;
  signatory_designation: string;
  signatory_phone: string;
  signatory_email: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_name: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  credibility_score: number;
  created_at: string;
}

// ─── UI / App Types ───────────────────────────────────────────────────────────

export interface BentoCard {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: "default" | "saffron" | "green" | "gold" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
}

export interface NavItem {
  label: string;
  labelHi?: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  roles?: UserRole[];
}

export interface RatingInfo {
  rating: ConditionRating;
  label: string;
  labelHi: string;
  description: string;
  priceMultiplier: number;
  eligibleFor: RedistributionType[];
  color: string;
}
