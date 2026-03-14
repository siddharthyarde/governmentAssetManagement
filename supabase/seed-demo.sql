-- =============================================================================
-- GAMS — Demo Seed (Manual SQL)
-- Run this after migrations (001..004) in Supabase SQL Editor.
-- =============================================================================

-- Demo approved company
INSERT INTO public.companies (
  id,
  company_code,
  legal_name,
  gstin,
  pan,
  status,
  registered_address,
  contact_email,
  contact_mobile
)
VALUES (
  gen_random_uuid(),
  'MHT001',
  'Jai Hind Traders Pvt Ltd',
  '27AABCJ1234A1Z5',
  'AABCJ1234A',
  'approved',
  '{"line1":"42 Nariman Point","city":"Mumbai","state":"MH","pincode":"400021"}'::jsonb,
  'contact@jaihindtraders.in',
  '9876543210'
)
ON CONFLICT (company_code) DO NOTHING;

-- Demo closed event
INSERT INTO public.events (
  id,
  event_code,
  name,
  event_type,
  gov_level,
  state_code,
  district,
  venue,
  start_date,
  end_date,
  status
)
VALUES (
  gen_random_uuid(),
  'EVT-2026-RD-001',
  'Republic Day Parade 2026',
  'national_celebration',
  'central',
  'DL',
  'New Delhi',
  'Kartavya Path',
  '2026-01-26',
  '2026-01-26',
  'closed'
)
ON CONFLICT (event_code) DO NOTHING;
