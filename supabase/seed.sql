-- =============================================================================
-- GAMS — Seed Data
-- Run after 001_initial_schema.sql and 002_storage_setup.sql
-- Creates realistic test data for all portals.
--
-- IMPORTANT: This seed uses Supabase auth.users — accounts must be created
-- via the Supabase Dashboard → Authentication → Users → "Add User" first,
-- then paste the generated UUID into the variables below.
--
-- Quick-start minimal seed (companies, events, products, listings) that
-- works with the SQL functions already in the schema.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Seed helper — run inside a DO block so we can use variables
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  -- ── Paste real auth user UUIDs here after creating them in Supabase ──────
  v_admin_id       UUID := '00000000-0000-0000-0000-000000000001';  -- placeholder
  v_company_user   UUID := '00000000-0000-0000-0000-000000000002';
  v_institution_user UUID := '00000000-0000-0000-0000-000000000003';

  -- Inserted record IDs (filled as we go)
  v_company_id     UUID;
  v_institution_id UUID;
  v_product_id     UUID;
  v_event_id       UUID;
  v_listing_id     UUID;
  v_instance_id    UUID;

BEGIN

-- ---------------------------------------------------------------------------
-- 1. user_profiles — management admin (skip if auth user doesn't exist yet)
-- ---------------------------------------------------------------------------
INSERT INTO user_profiles (
  id, full_name, email, role, gov_level, ministry, designation, is_active
) VALUES (
  v_admin_id,
  'Kiran Mehta',
  'admin@gams.gov.in',
  'super_admin',
  'central',
  'Ministry of Electronics and IT',
  'Programme Director – GAMS',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name   = EXCLUDED.full_name,
  role        = EXCLUDED.role,
  updated_at  = NOW();

-- ---------------------------------------------------------------------------
-- 2. companies
-- ---------------------------------------------------------------------------
INSERT INTO companies (
  id, company_code, legal_name, trade_name, gstin, pan,
  contact_email, contact_mobile, website,
  registered_address, status, reviewed_by, reviewed_at
) VALUES (
  uuid_generate_v4(),
  'MHT001',
  'Godrej Interio Limited',
  'Godrej Interio',
  '27AABCG1234F1ZX',
  'AABCG1234F',
  'procurement@godrejinterio.com',
  '9821000001',
  'https://www.godrejinterio.com',
  '{"line1":"Pirojshanagar, Eastern Express Highway","city":"Mumbai","district":"Mumbai","state":"MH","pincode":"400079"}'::jsonb,
  'approved',
  v_admin_id,
  NOW()
)
ON CONFLICT (gstin) DO NOTHING
RETURNING id INTO v_company_id;

-- Fall back if company already inserted
IF v_company_id IS NULL THEN
  SELECT id INTO v_company_id FROM companies WHERE gstin = '27AABCG1234F1ZX';
END IF;

-- Link company user
INSERT INTO company_users (company_id, user_id, is_primary)
VALUES (v_company_id, v_company_user, true)
ON CONFLICT (company_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. institutions
-- ---------------------------------------------------------------------------
INSERT INTO institutions (
  id, institution_code, name, institution_type, gov_level,
  contact_email, contact_mobile, head_of_organisation, nodal_officer,
  nodal_officer_mobile, registered_address, status, reviewed_by, reviewed_at
) VALUES (
  uuid_generate_v4(),
  'RSBSEC001',
  'Rajya Sabha Secretariat',
  'central_govt',
  'central',
  'procurement@rajyasabha.nic.in',
  '9811000001',
  'Secretary-General',
  'Procurement Officer',
  '9811000002',
  '{"line1":"Parliament House Annexe","city":"New Delhi","district":"New Delhi","state":"DL","pincode":"110001"}'::jsonb,
  'approved',
  v_admin_id,
  NOW()
)
ON CONFLICT (institution_code) DO NOTHING
RETURNING id INTO v_institution_id;

IF v_institution_id IS NULL THEN
  SELECT id INTO v_institution_id FROM institutions WHERE institution_code = 'RSBSEC001';
END IF;

-- Link institution user
INSERT INTO institution_users (institution_id, user_id, is_primary)
VALUES (v_institution_id, v_institution_user, true)
ON CONFLICT (institution_id, user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. products — a reusable and a disposable
-- ---------------------------------------------------------------------------
INSERT INTO products (
  id, product_code, company_id, name, description,
  product_type, category, sub_category, hsn_code,
  unit, original_price_paise, status,
  approved_by, approved_at, mfg_year
) VALUES (
  uuid_generate_v4(),
  'GOI-MHT001-R-FURN-2025-00000001',
  v_company_id,
  'Folding Chair — Steel Frame, Black Fabric',
  'Heavy-duty banquet folding chair with steel frame and PVC foam-padded seat. Stackable up to 10 units. Weight capacity: 150 kg.',
  'reusable',
  'Furniture',
  'Seating',
  '94016900',
  'piece',
  320000,  -- ₹3,200 per chair
  'approved',
  v_admin_id,
  NOW(),
  2025
)
ON CONFLICT (product_code) DO NOTHING
RETURNING id INTO v_product_id;

IF v_product_id IS NULL THEN
  SELECT id INTO v_product_id FROM products WHERE product_code = 'GOI-MHT001-R-FURN-2025-00000001';
END IF;

-- Disposable
INSERT INTO products (
  product_code, company_id, name, description,
  product_type, category, sub_category, hsn_code,
  unit, original_price_paise, status,
  approved_by, approved_at, mfg_year
) VALUES (
  'GOI-MHT001-D-FURN-2025-00000002',
  v_company_id,
  'Paper Tablecloth Roll — White, 100m',
  'Food-grade white paper tablecloth on a disposable roll. 1.2m wide, 100m long. Suitable for events.',
  'disposable',
  'Disposables',
  'Table Linen',
  '48111000',
  'roll',
  85000,  -- ₹850 per roll
  'approved',
  v_admin_id,
  NOW(),
  2025
)
ON CONFLICT (product_code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5. events
-- ---------------------------------------------------------------------------
INSERT INTO events (
  id, event_code, name, event_type, gov_level,
  description, organising_ministry, state_code, district,
  venue, start_date, end_date, status,
  expected_footfall, created_by, approved_by, approved_at
) VALUES (
  uuid_generate_v4(),
  'EVT-GOI-2026-00001',
  'India International Trade Fair 2026',
  'exhibition',
  'central',
  'Annual national trade fair showcasing indigenous products and government initiatives.',
  'Ministry of Commerce & Industry',
  'DL',
  'New Delhi',
  'Pragati Maidan, Mathura Road, New Delhi',
  '2026-11-14',
  '2026-11-27',
  'approved',
  500000,
  v_admin_id,
  v_admin_id,
  NOW()
)
ON CONFLICT (event_code) DO NOTHING
RETURNING id INTO v_event_id;

IF v_event_id IS NULL THEN
  SELECT id INTO v_event_id FROM events WHERE event_code = 'EVT-GOI-2026-00001';
END IF;

-- ---------------------------------------------------------------------------
-- 6. product_instances (10 chairs for deployment)
-- ---------------------------------------------------------------------------
INSERT INTO product_instances (
  instance_code, product_id, company_id,
  condition_rating, status, mfg_year
)
SELECT
  'GOI-MHT001-R-FURN-2025-' || LPAD(gs::text, 8, '0'),
  v_product_id,
  v_company_id,
  9,       -- Excellent condition
  'in_stock'::product_instance_status,
  2025
FROM generate_series(1, 10) AS gs
ON CONFLICT (instance_code) DO NOTHING;

-- Pick one instance for the redistribution listing
SELECT id INTO v_instance_id
FROM product_instances
WHERE product_id = v_product_id
  AND status = 'in_stock'
LIMIT 1;

-- ---------------------------------------------------------------------------
-- 7. redistribution_listings (marketplace)
-- ---------------------------------------------------------------------------
INSERT INTO redistribution_listings (
  id, listing_code, instance_id,
  redistribution_type, condition_rating,
  listed_price_paise, original_price_paise, discount_pct,
  quantity_available, status, listed_by, listed_at
) VALUES (
  uuid_generate_v4(),
  'LST-2026-00001',
  v_instance_id,
  'public_sale',
  9,
  208000,   -- ₹2,080 (35% off ₹3,200)
  320000,
  35,
  1,
  'listed',
  v_admin_id,
  NOW()
)
ON CONFLICT (listing_code) DO NOTHING
RETURNING id INTO v_listing_id;

-- ---------------------------------------------------------------------------
-- 8. notifications for the admin user
-- ---------------------------------------------------------------------------
INSERT INTO notifications (user_id, title, body, link) VALUES
(v_admin_id, 'Welcome to GAMS', 'Your management portal is ready. Start by creating your first event.', '/events'),
(v_admin_id, 'New Company Registration', 'Godrej Interio has submitted their company registration for review.', '/approvals'),
(v_admin_id, 'Seed data loaded', 'Sample companies, events, products and listings have been added to the system.', '/assets')
ON CONFLICT DO NOTHING;

END $$;

-- =============================================================================
-- Done
-- =============================================================================
