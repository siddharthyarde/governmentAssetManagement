-- =============================================================================
-- GAMS — Government Asset Management System
-- Migration 001: Initial Schema
-- Supabase / PostgreSQL 15
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ---------------------------------------------------------------------------
-- 1. Enum Types
-- ---------------------------------------------------------------------------

CREATE TYPE gov_level AS ENUM (
  'central',
  'state',
  'municipal',
  'panchayat'
);

CREATE TYPE user_role AS ENUM (
  'super_admin',       -- NIC / top-level GAMS admin
  'gov_admin',         -- ministry / department admin
  'event_manager',     -- creates/manages events
  'inspector',         -- rates asset condition post-event
  'volunteer',         -- scans QR on-ground
  'warehouse_officer', -- manages physical storage + dispatch
  'auditor',           -- read-only audit access
  'company_rep',       -- supplier company user
  'institution_rep',   -- buyer portal user (NGO / institution)
  'citizen'            -- public portal user
);

CREATE TYPE company_status AS ENUM (
  'pending_review',
  'documents_requested',
  'approved',
  'suspended',
  'blacklisted'
);

CREATE TYPE institution_type AS ENUM (
  'central_govt',
  'state_govt',
  'municipal_body',
  'panchayat',
  'public_sector_undertaking',
  'autonomous_body',
  'ngo_registered',
  'educational_institution',
  'hospital_govt',
  'defence',
  'police',
  'other'
);

CREATE TYPE institution_status AS ENUM (
  'pending_review',
  'documents_requested',
  'approved',
  'suspended'
);

CREATE TYPE product_type AS ENUM (
  'reusable',   -- individually QR-tagged, tracked per item
  'disposable'  -- bulk-packed, tracked per batch
);

CREATE TYPE product_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'discontinued'
);

CREATE TYPE product_instance_status AS ENUM (
  'in_stock',
  'deployed',          -- assigned to an active event
  'in_transit',
  'under_repair',
  'pending_rating',    -- event ended, awaiting inspector rating
  'redistributed',     -- listed on marketplace / given away
  'condemned',         -- rating ≤ 4, not suitable for further use
  'lost',
  'written_off'
);

CREATE TYPE event_type AS ENUM (
  'national_celebration',   -- Republic Day, Independence Day, etc.
  'state_celebration',
  'cultural',
  'sports',
  'exhibition',
  'relief_distribution',
  'public_service',
  'other'
);

CREATE TYPE event_status AS ENUM (
  'draft',
  'approved',
  'assets_requested',
  'assets_confirmed',
  'ongoing',
  'ended',
  'post_event_review',
  'closed'
);

CREATE TYPE scan_action AS ENUM (
  'check_in',
  'check_out',
  'defect_report',
  'condition_rating',
  'dispatch',
  'receive',
  'verify'
);

CREATE TYPE defect_severity AS ENUM (
  'minor',
  'moderate',
  'major',
  'critical'
);

CREATE TYPE redistribution_type AS ENUM (
  'public_sale',         -- sold to citizens at discounted price
  'inter_government',    -- transferred to another govt body
  'ngo_donation',        -- donated to approved NGO
  'freebie'              -- given free to eligible institution
);

CREATE TYPE redistribution_status AS ENUM (
  'listed',
  'reserved',
  'dispatched',
  'completed',
  'cancelled'
);

CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'payment_received',
  'processing',
  'dispatched',
  'delivered',
  'returned',
  'refunded',
  'cancelled'
);

CREATE TYPE repair_status AS ENUM (
  'assessed',
  'sent_for_repair',
  'under_repair',
  'repaired',
  'beyond_repair'
);

CREATE TYPE delivery_photo_stage AS ENUM (
  'packed',
  'dispatched',
  'in_transit',
  'delivered'
);

-- ---------------------------------------------------------------------------
-- 2. user_profiles — internal management portal users (linked to auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE user_profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  display_name      TEXT,
  email             TEXT NOT NULL,
  mobile            TEXT,
  aadhaar_masked    TEXT,                      -- last 4 digits only, e.g. "XXXX-XXXX-6543"
  employee_id       TEXT UNIQUE,               -- government employee ID
  designation       TEXT,
  department        TEXT,
  ministry          TEXT,
  gov_level         gov_level NOT NULL DEFAULT 'central',
  state_code        CHAR(2),                   -- ISO 3166-2:IN state code
  district          TEXT,
  role              user_role NOT NULL DEFAULT 'volunteer',
  avatar_url        TEXT,
  digilocker_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3. public_user_profiles — citizen users (linked to auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public_user_profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  email             TEXT,
  mobile            TEXT NOT NULL,
  aadhaar_masked    TEXT,                      -- "XXXX-XXXX-6543" format
  aadhaar_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  date_of_birth     DATE,
  gender            TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address_line1     TEXT,
  address_line2     TEXT,
  city              TEXT,
  district          TEXT,
  state_code        CHAR(2),
  pincode           CHAR(6),
  avatar_url        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. companies — supplier companies (company portal)
-- ---------------------------------------------------------------------------
CREATE TABLE companies (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_code          TEXT NOT NULL UNIQUE,   -- e.g. "MHT001" used in product ID
  legal_name            TEXT NOT NULL,
  trade_name            TEXT,
  cin                   TEXT UNIQUE,            -- Ministry of Corporate Affairs CIN
  gstin                 TEXT UNIQUE,
  pan                   TEXT NOT NULL UNIQUE,
  msme_number           TEXT,
  is_msme               BOOLEAN NOT NULL DEFAULT FALSE,
  msme_category         TEXT CHECK (msme_category IN ('micro', 'small', 'medium')),
  registered_address    JSONB NOT NULL DEFAULT '{}',  -- {line1, line2, city, district, state, pincode}
  contact_email         TEXT NOT NULL,
  contact_mobile        TEXT NOT NULL,
  website               TEXT,
  logo_url              TEXT,
  status                company_status NOT NULL DEFAULT 'pending_review',
  review_notes          TEXT,
  reviewed_by           UUID REFERENCES user_profiles(id),
  reviewed_at           TIMESTAMPTZ,
  documents             JSONB NOT NULL DEFAULT '[]',  -- [{type, url, uploaded_at}]
  bank_account          JSONB,                 -- {bank_name, ifsc, account_no_masked}
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- rep user linked to a company
CREATE TABLE company_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 5. institutions — buyer portal organisations
-- ---------------------------------------------------------------------------
CREATE TABLE institutions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_code      TEXT NOT NULL UNIQUE,
  name                  TEXT NOT NULL,
  institution_type      institution_type NOT NULL,
  gov_level             gov_level,
  pan                   TEXT UNIQUE,
  gstin                 TEXT UNIQUE,
  registration_number   TEXT,                  -- NGO reg / Trust deed / Bye-law number
  registered_address    JSONB NOT NULL DEFAULT '{}',
  contact_email         TEXT NOT NULL,
  contact_mobile        TEXT NOT NULL,
  head_of_organisation  TEXT,
  nodal_officer         TEXT,
  nodal_officer_mobile  TEXT,
  status                institution_status NOT NULL DEFAULT 'pending_review',
  review_notes          TEXT,
  reviewed_by           UUID REFERENCES user_profiles(id),
  reviewed_at           TIMESTAMPTZ,
  documents             JSONB NOT NULL DEFAULT '[]',
  is_80g_certified      BOOLEAN NOT NULL DEFAULT FALSE,
  is_12a_certified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE institution_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id  UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 6. products — product catalog (managed by companies + approved by gov admin)
-- ---------------------------------------------------------------------------
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_code        TEXT NOT NULL UNIQUE,   -- full ID: "GOI-MHT001-R-ELEC-2025-00000001"
  company_id          UUID NOT NULL REFERENCES companies(id),
  name                TEXT NOT NULL,
  name_hi             TEXT,                   -- Hindi name
  description         TEXT,
  description_hi      TEXT,
  product_type        product_type NOT NULL,
  category            TEXT NOT NULL,          -- e.g. "ELEC", "FURN", "VEH"
  sub_category        TEXT,
  gov_scope           TEXT NOT NULL DEFAULT 'GOI',   -- GOI / state code
  brand               TEXT,
  model_number        TEXT,
  hsn_code            TEXT,                   -- Harmonised System of Nomenclature
  unit                TEXT NOT NULL DEFAULT 'piece', -- piece / kg / litre / set / pair
  original_price_paise BIGINT NOT NULL,       -- MRP in paise (avoid float)
  specifications      JSONB NOT NULL DEFAULT '{}',   -- key-value pairs
  variants            JSONB NOT NULL DEFAULT '[]',   -- [{color, size, spec, additional_price_paise}]
  images              JSONB NOT NULL DEFAULT '[]',   -- [{url, alt, is_primary}]
  status              product_status NOT NULL DEFAULT 'draft',
  approved_by         UUID REFERENCES user_profiles(id),
  approved_at         TIMESTAMPTZ,
  rejection_reason    TEXT,
  mfg_year            SMALLINT,
  warranty_months     SMALLINT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 7. product_instances — individually QR-tagged reusable items
-- ---------------------------------------------------------------------------
CREATE TABLE product_instances (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_code       TEXT NOT NULL UNIQUE,   -- same format as product_code + serial suffix
  product_id          UUID NOT NULL REFERENCES products(id),
  company_id          UUID NOT NULL REFERENCES companies(id),
  qr_payload          TEXT,                   -- HMAC-signed JWT for QR code
  qr_generated_at     TIMESTAMPTZ,
  serial_number       TEXT,                   -- manufacturer serial if available
  variant_index       SMALLINT DEFAULT 0,     -- index into product.variants[]
  purchase_price_paise BIGINT,               -- actual government purchase price
  mfg_date            DATE,
  mfg_year            SMALLINT GENERATED ALWAYS AS (EXTRACT(YEAR FROM mfg_date)::SMALLINT) STORED,
  condition_rating    SMALLINT CHECK (condition_rating BETWEEN 1 AND 10),
  status              product_instance_status NOT NULL DEFAULT 'in_stock',
  current_event_id    UUID,                   -- FK added after events table
  warehouse_location  TEXT,
  procured_by         UUID REFERENCES user_profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 8. product_batches — bulk disposable packs
-- ---------------------------------------------------------------------------
CREATE TABLE product_batches (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_code            TEXT NOT NULL UNIQUE,
  product_id            UUID NOT NULL REFERENCES products(id),
  company_id            UUID NOT NULL REFERENCES companies(id),
  qr_payload            TEXT,
  qr_generated_at       TIMESTAMPTZ,
  quantity_total        INTEGER NOT NULL CHECK (quantity_total > 0),
  quantity_remaining    INTEGER NOT NULL,
  unit_purchase_price_paise BIGINT,
  mfg_date              DATE,
  expiry_date           DATE,
  batch_number          TEXT,
  warehouse_location    TEXT,
  procured_by           UUID REFERENCES user_profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT qty_remaining_valid CHECK (quantity_remaining >= 0 AND quantity_remaining <= quantity_total)
);

-- ---------------------------------------------------------------------------
-- 9. events
-- ---------------------------------------------------------------------------
CREATE TABLE events (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_code          TEXT NOT NULL UNIQUE,   -- e.g. "EVT-2026-RD-001"
  name                TEXT NOT NULL,
  name_hi             TEXT,
  event_type          event_type NOT NULL,
  description         TEXT,
  gov_level           gov_level NOT NULL,
  organising_ministry TEXT,
  state_code          CHAR(2),
  district            TEXT,
  venue               TEXT NOT NULL,
  venue_coordinates   POINT,                  -- lat/lng for map
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  expected_footfall   INTEGER,
  status              event_status NOT NULL DEFAULT 'draft',
  created_by          UUID NOT NULL REFERENCES user_profiles(id),
  approved_by         UUID REFERENCES user_profiles(id),
  approved_at         TIMESTAMPTZ,
  closed_at           TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ---------------------------------------------------------------------------
-- 10. event_areas — logical zones within an event
-- ---------------------------------------------------------------------------
CREATE TABLE event_areas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  area_code   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Now add FK from product_instances to events
ALTER TABLE product_instances
  ADD CONSTRAINT fk_current_event
  FOREIGN KEY (current_event_id) REFERENCES events(id);

-- ---------------------------------------------------------------------------
-- 11. event_assets — which assets are assigned to which event
-- ---------------------------------------------------------------------------
CREATE TABLE event_assets (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id            UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_area_id       UUID REFERENCES event_areas(id),
  -- exactly one of the following two must be non-null
  instance_id         UUID REFERENCES product_instances(id),
  batch_id            UUID REFERENCES product_batches(id),
  quantity_requested  INTEGER DEFAULT 1,      -- for batches
  quantity_dispatched INTEGER DEFAULT 0,
  quantity_returned   INTEGER DEFAULT 0,
  requested_by        UUID NOT NULL REFERENCES user_profiles(id),
  approved_by         UUID REFERENCES user_profiles(id),
  dispatched_at       TIMESTAMPTZ,
  returned_at         TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT only_one_asset CHECK (
    (instance_id IS NOT NULL AND batch_id IS NULL) OR
    (instance_id IS NULL AND batch_id IS NOT NULL)
  )
);

-- ---------------------------------------------------------------------------
-- 12. scans — every QR scan logged immutably
-- ---------------------------------------------------------------------------
CREATE TABLE scans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scanned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scanner_id      UUID REFERENCES auth.users(id),  -- null = anonymous scan
  scanner_role    user_role,
  instance_id     UUID REFERENCES product_instances(id),
  batch_id        UUID REFERENCES product_batches(id),
  event_id        UUID REFERENCES events(id),
  action          scan_action NOT NULL,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  device_info     JSONB DEFAULT '{}',          -- user-agent, OS, etc.
  notes           TEXT,
  is_valid        BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE if HMAC verification failed
  CONSTRAINT scan_has_asset CHECK (
    (instance_id IS NOT NULL) OR (batch_id IS NOT NULL)
  )
);

-- ---------------------------------------------------------------------------
-- 13. defects — volunteer defect reports attached to scan
-- ---------------------------------------------------------------------------
CREATE TABLE defects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id         UUID NOT NULL REFERENCES scans(id),
  instance_id     UUID REFERENCES product_instances(id),
  batch_id        UUID REFERENCES product_batches(id),
  event_id        UUID REFERENCES events(id),
  reported_by     UUID REFERENCES auth.users(id),
  severity        defect_severity NOT NULL,
  description     TEXT NOT NULL,
  photos          JSONB NOT NULL DEFAULT '[]',  -- [{url, caption}]
  is_resolved     BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by     UUID REFERENCES user_profiles(id),
  resolved_at     TIMESTAMPTZ,
  resolution_note TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 14. condition_ratings — inspector post-event ratings (1–10 scale)
-- ---------------------------------------------------------------------------
CREATE TABLE condition_ratings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id     UUID NOT NULL REFERENCES product_instances(id),
  event_id        UUID NOT NULL REFERENCES events(id),
  rated_by        UUID NOT NULL REFERENCES user_profiles(id),
  rated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
  -- 10=Mint, 9=Excellent, 8=Very Good, 7=Good, 6=Fair, 5=Acceptable, 4-1=Condemned
  rating_label    TEXT NOT NULL,
  notes           TEXT,
  photos          JSONB NOT NULL DEFAULT '[]',
  recommended_action TEXT CHECK (recommended_action IN (
    'return_to_stock', 'send_for_repair', 'list_for_redistribution', 'condemn'
  )),
  UNIQUE(instance_id, event_id)  -- one rating per instance per event
);

-- ---------------------------------------------------------------------------
-- 15. repair_orders
-- ---------------------------------------------------------------------------
CREATE TABLE repair_orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instance_id       UUID NOT NULL REFERENCES product_instances(id),
  raised_by         UUID NOT NULL REFERENCES user_profiles(id),
  status            repair_status NOT NULL DEFAULT 'assessed',
  assessment_notes  TEXT,
  repair_vendor     TEXT,
  repair_cost_paise BIGINT,
  sent_at           TIMESTAMPTZ,
  returned_at       TIMESTAMPTZ,
  outcome_notes     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 16. redistribution_listings — marketplace listings (all three channels)
-- ---------------------------------------------------------------------------
CREATE TABLE redistribution_listings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_code            TEXT NOT NULL UNIQUE,
  instance_id             UUID REFERENCES product_instances(id),
  batch_id                UUID REFERENCES product_batches(id),
  redistribution_type     redistribution_type NOT NULL,
  condition_rating        SMALLINT CHECK (condition_rating BETWEEN 5 AND 10), -- ≥5 to be listed
  listed_price_paise      BIGINT,     -- NULL for freebies / inter-govt transfers
  original_price_paise    BIGINT NOT NULL,
  discount_pct            SMALLINT,   -- e.g. 35 for 35% off
  quantity_available      INTEGER NOT NULL DEFAULT 1,
  quantity_reserved       INTEGER NOT NULL DEFAULT 0,
  eligible_for            institution_type[],  -- NULL = open to all
  status                  redistribution_status NOT NULL DEFAULT 'listed',
  listed_by               UUID NOT NULL REFERENCES user_profiles(id),
  listed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at              TIMESTAMPTZ,
  delivery_photos         JSONB NOT NULL DEFAULT '[]', -- real photos, not stock
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_asset_per_listing CHECK (
    (instance_id IS NOT NULL AND batch_id IS NULL) OR
    (instance_id IS NULL AND batch_id IS NOT NULL)
  )
);

-- ---------------------------------------------------------------------------
-- 17. redistribution_requests — institution / citizen requests
-- ---------------------------------------------------------------------------
CREATE TABLE redistribution_requests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id          UUID NOT NULL REFERENCES redistribution_listings(id),
  requested_by_user   UUID REFERENCES auth.users(id),        -- citizen
  requested_by_institution UUID REFERENCES institutions(id), -- institution
  quantity_requested  INTEGER NOT NULL DEFAULT 1,
  status              redistribution_status NOT NULL DEFAULT 'listed',
  approved_by         UUID REFERENCES user_profiles(id),
  approved_at         TIMESTAMPTZ,
  rejection_reason    TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_requester CHECK (
    (requested_by_user IS NOT NULL AND requested_by_institution IS NULL) OR
    (requested_by_user IS NULL AND requested_by_institution IS NOT NULL)
  )
);

-- ---------------------------------------------------------------------------
-- 18. orders — public citizen purchases via Razorpay
-- ---------------------------------------------------------------------------
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number        TEXT NOT NULL UNIQUE,   -- "ORD-2026-00000001"
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  status              order_status NOT NULL DEFAULT 'pending_payment',
  subtotal_paise      BIGINT NOT NULL DEFAULT 0,
  shipping_paise      BIGINT NOT NULL DEFAULT 0,
  total_paise         BIGINT NOT NULL DEFAULT 0,
  razorpay_order_id   TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature  TEXT,
  paid_at             TIMESTAMPTZ,
  shipping_address    JSONB NOT NULL DEFAULT '{}',
  tracking_number     TEXT,
  dispatched_at       TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  delivery_photos     JSONB NOT NULL DEFAULT '[]',  -- photos at each stage
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 19. order_items
-- ---------------------------------------------------------------------------
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id      UUID NOT NULL REFERENCES redistribution_listings(id),
  instance_id     UUID REFERENCES product_instances(id),
  batch_id        UUID REFERENCES product_batches(id),
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price_paise BIGINT NOT NULL,
  total_paise     BIGINT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 20. audit_logs — append-only immutable audit trail
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id            UUID NOT NULL DEFAULT uuid_generate_v4(),
  logged_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id      UUID,                      -- auth.users id — null for system actions
  actor_role    user_role,
  action        TEXT NOT NULL,             -- e.g. "product.approved", "event.closed"
  entity_type   TEXT NOT NULL,             -- table name
  entity_id     UUID,
  old_data      JSONB,
  new_data      JSONB,
  ip_address    INET,
  user_agent    TEXT,
  PRIMARY KEY (id, logged_at)             -- partition key must include partitioning column
) PARTITION BY RANGE (logged_at);

-- Create partitions per year (add more as needed)
CREATE TABLE audit_logs_2025 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE audit_logs_2026 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE audit_logs_2027 PARTITION OF audit_logs
  FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');

-- ---------------------------------------------------------------------------
-- 21. notifications — in-app notifications
-- ---------------------------------------------------------------------------
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  link        TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 22. batch_jobs — async QR / ID generation progress
-- ---------------------------------------------------------------------------
CREATE TABLE batch_jobs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type        TEXT NOT NULL,       -- 'qr_generate', 'csv_import', 'label_export'
  initiated_by    UUID NOT NULL REFERENCES auth.users(id),
  entity_type     TEXT,                -- 'product_instances' | 'product_batches'
  total           INTEGER NOT NULL DEFAULT 0,
  processed       INTEGER NOT NULL DEFAULT 0,
  failed          INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','done','failed')),
  result_url      TEXT,                -- download URL for CSV/ZIP output
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 23. Indexes
-- ---------------------------------------------------------------------------

-- companies
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_gstin ON companies(gstin);

-- products — full-text + trigram for search
CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_trgm_name ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_products_trgm_code ON products USING GIN (product_code gin_trgm_ops);

-- product_instances
CREATE INDEX idx_instances_product ON product_instances(product_id);
CREATE INDEX idx_instances_company ON product_instances(company_id);
CREATE INDEX idx_instances_status ON product_instances(status);
CREATE INDEX idx_instances_event ON product_instances(current_event_id) WHERE current_event_id IS NOT NULL;
CREATE INDEX idx_instances_rating ON product_instances(condition_rating);
CREATE INDEX idx_instances_trgm_code ON product_instances USING GIN (instance_code gin_trgm_ops);

-- product_batches
CREATE INDEX idx_batches_product ON product_batches(product_id);
CREATE INDEX idx_batches_company ON product_batches(company_id);

-- events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_gov_level ON events(gov_level);
CREATE INDEX idx_events_dates ON events(start_date, end_date);

-- event_assets
CREATE INDEX idx_event_assets_event ON event_assets(event_id);
CREATE INDEX idx_event_assets_instance ON event_assets(instance_id) WHERE instance_id IS NOT NULL;
CREATE INDEX idx_event_assets_batch ON event_assets(batch_id) WHERE batch_id IS NOT NULL;

-- scans
CREATE INDEX idx_scans_instance ON scans(instance_id) WHERE instance_id IS NOT NULL;
CREATE INDEX idx_scans_event ON scans(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_scans_scanner ON scans(scanner_id) WHERE scanner_id IS NOT NULL;
CREATE INDEX idx_scans_at ON scans(scanned_at DESC);
CREATE INDEX idx_scans_action ON scans(action);

-- defects
CREATE INDEX idx_defects_instance ON defects(instance_id) WHERE instance_id IS NOT NULL;
CREATE INDEX idx_defects_event ON defects(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_defects_unresolved ON defects(is_resolved) WHERE NOT is_resolved;

-- condition_ratings
CREATE INDEX idx_ratings_instance ON condition_ratings(instance_id);
CREATE INDEX idx_ratings_event ON condition_ratings(event_id);

-- redistribution_listings
CREATE INDEX idx_listings_status ON redistribution_listings(status);
CREATE INDEX idx_listings_type ON redistribution_listings(redistribution_type);
CREATE INDEX idx_listings_rating ON redistribution_listings(condition_rating);
CREATE INDEX idx_listings_instance ON redistribution_listings(instance_id) WHERE instance_id IS NOT NULL;

-- orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE NOT is_read;

-- audit_logs
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, logged_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id, logged_at DESC);

-- ---------------------------------------------------------------------------
-- 24. updated_at auto-trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'user_profiles', 'public_user_profiles', 'companies', 'institutions',
    'products', 'product_instances', 'product_batches', 'events',
    'event_assets', 'redistribution_listings', 'redistribution_requests',
    'orders', 'repair_orders', 'batch_jobs'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 25. Audit log trigger — auto-log UPDATE/DELETE on key tables
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs(actor_id, action, entity_type, entity_id, old_data, new_data)
    VALUES (
      auth.uid(),
      TG_TABLE_NAME || '.update',
      TG_TABLE_NAME,
      NEW.id,
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs(actor_id, action, entity_type, entity_id, old_data)
    VALUES (
      auth.uid(),
      TG_TABLE_NAME || '.delete',
      TG_TABLE_NAME,
      OLD.id,
      row_to_json(OLD)::jsonb
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Apply audit trigger to sensitive tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'companies', 'institutions', 'products', 'product_instances',
    'product_batches', 'events', 'condition_ratings', 'orders'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_audit
       AFTER UPDATE OR DELETE ON %I
       FOR EACH ROW EXECUTE FUNCTION audit_log_changes()',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- 26. Row Level Security — enable on all tables
-- ---------------------------------------------------------------------------
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE redistribution_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE redistribution_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;
-- audit_logs: no RLS — append-only via trigger, not directly accessible to users

-- ---------------------------------------------------------------------------
-- 27. RLS Policies
-- ---------------------------------------------------------------------------

-- ── user_profiles ──────────────────────────────────────────────────────────
-- Users can read and update their own profile
CREATE POLICY "own_profile_select" ON user_profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "own_profile_update" ON user_profiles
  FOR UPDATE USING (id = auth.uid());
-- Admins can read all profiles
CREATE POLICY "admin_read_all_profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
        AND up.role IN ('super_admin', 'gov_admin', 'auditor')
    )
  );

-- ── public_user_profiles ───────────────────────────────────────────────────
CREATE POLICY "own_public_profile_select" ON public_user_profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "own_public_profile_update" ON public_user_profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "own_public_profile_insert" ON public_user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ── companies — company reps see only their own company ───────────────────
CREATE POLICY "company_rep_select" ON companies
  FOR SELECT USING (
    id IN (SELECT company_id FROM company_users WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin', 'gov_admin', 'auditor')
    )
  );
CREATE POLICY "company_rep_update" ON companies
  FOR UPDATE USING (
    id IN (SELECT company_id FROM company_users WHERE user_id = auth.uid())
    AND status NOT IN ('blacklisted')
  );
CREATE POLICY "company_insert" ON companies
  FOR INSERT WITH CHECK (TRUE); -- anyone can apply; status starts as pending_review

-- ── company_users ──────────────────────────────────────────────────────────
CREATE POLICY "company_users_select" ON company_users
  FOR SELECT USING (user_id = auth.uid());

-- ── institutions ───────────────────────────────────────────────────────────
CREATE POLICY "institution_rep_select" ON institutions
  FOR SELECT USING (
    id IN (SELECT institution_id FROM institution_users WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin', 'gov_admin', 'auditor')
    )
  );
CREATE POLICY "institution_insert" ON institutions
  FOR INSERT WITH CHECK (TRUE);

-- ── institution_users ──────────────────────────────────────────────────────
CREATE POLICY "institution_users_select" ON institution_users
  FOR SELECT USING (user_id = auth.uid());

-- ── products — public read of approved, company reps manage their own ──────
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'approved');
CREATE POLICY "products_company_all" ON products
  FOR ALL USING (
    company_id IN (SELECT company_id FROM company_users WHERE user_id = auth.uid())
  );
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin', 'gov_admin')
    )
  );

-- ── product_instances / batches — management portal only ──────────────────
CREATE POLICY "instances_management_select" ON product_instances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','event_manager','inspector',
                        'volunteer','warehouse_officer','auditor')
    )
  );
CREATE POLICY "instances_public_read_listed" ON product_instances
  FOR SELECT USING (status = 'redistributed');

CREATE POLICY "batches_management_select" ON product_batches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','event_manager','inspector',
                        'volunteer','warehouse_officer','auditor')
    )
  );

-- ── events — management reads all; event_manager can insert/update ─────────
CREATE POLICY "events_management_read" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','event_manager','inspector',
                        'volunteer','warehouse_officer','auditor')
    )
  );
CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (status IN ('ongoing', 'ended', 'closed'));
CREATE POLICY "events_manager_write" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','event_manager')
    )
  );

-- ── scans — insert by any authenticated management user, read by management ─
CREATE POLICY "scans_insert" ON scans
  FOR INSERT WITH CHECK (scanner_id = auth.uid());
CREATE POLICY "scans_management_read" ON scans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','event_manager','inspector',
                        'volunteer','warehouse_officer','auditor')
    )
  );

-- ── redistribution_listings — public read of listed items ─────────────────
CREATE POLICY "listings_public_read" ON redistribution_listings
  FOR SELECT USING (status = 'listed');
CREATE POLICY "listings_management_write" ON redistribution_listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','warehouse_officer')
    )
  );

-- ── orders — users see only their own orders ───────────────────────────────
CREATE POLICY "orders_own_select" ON orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_insert" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders_admin_read" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','auditor','warehouse_officer')
    )
  );
CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin','warehouse_officer')
    )
  );

-- ── notifications — users see only their own ──────────────────────────────
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- ── batch_jobs — initiator sees their own; admins see all ─────────────────
CREATE POLICY "batch_jobs_own" ON batch_jobs
  FOR SELECT USING (initiated_by = auth.uid());
CREATE POLICY "batch_jobs_admin" ON batch_jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles up WHERE up.id = auth.uid()
        AND up.role IN ('super_admin','gov_admin')
    )
  );

-- ---------------------------------------------------------------------------
-- 28. Helper Views (no RLS — backed by tables that have RLS)
-- ---------------------------------------------------------------------------

-- Live event summary
CREATE OR REPLACE VIEW v_active_events AS
SELECT
  e.id,
  e.event_code,
  e.name,
  e.event_type,
  e.gov_level,
  e.venue,
  e.start_date,
  e.end_date,
  e.status,
  COUNT(DISTINCT ea.id) FILTER (WHERE ea.instance_id IS NOT NULL) AS instance_count,
  COUNT(DISTINCT ea.id) FILTER (WHERE ea.batch_id IS NOT NULL)    AS batch_count
FROM events e
LEFT JOIN event_assets ea ON ea.event_id = e.id
WHERE e.status IN ('approved', 'assets_confirmed', 'ongoing')
GROUP BY e.id;

-- Public marketplace summary
CREATE OR REPLACE VIEW v_marketplace AS
SELECT
  rl.id,
  rl.listing_code,
  rl.redistribution_type,
  rl.condition_rating,
  rl.listed_price_paise,
  rl.original_price_paise,
  rl.discount_pct,
  rl.quantity_available,
  rl.delivery_photos,
  p.name        AS product_name,
  p.name_hi     AS product_name_hi,
  p.category,
  p.images      AS product_images,
  p.specifications,
  p.brand
FROM redistribution_listings rl
JOIN product_instances pi2 ON pi2.id = rl.instance_id
JOIN products p ON p.id = pi2.product_id
WHERE rl.status = 'listed'
  AND rl.redistribution_type = 'public_sale'
UNION ALL
SELECT
  rl.id,
  rl.listing_code,
  rl.redistribution_type,
  rl.condition_rating,
  rl.listed_price_paise,
  rl.original_price_paise,
  rl.discount_pct,
  rl.quantity_available,
  rl.delivery_photos,
  p.name,
  p.name_hi,
  p.category,
  p.images,
  p.specifications,
  p.brand
FROM redistribution_listings rl
JOIN product_batches pb ON pb.id = rl.batch_id
JOIN products p ON p.id = pb.product_id
WHERE rl.status = 'listed'
  AND rl.redistribution_type = 'public_sale';

-- ---------------------------------------------------------------------------
-- Done
-- ---------------------------------------------------------------------------
