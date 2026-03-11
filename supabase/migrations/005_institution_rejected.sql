-- =============================================================================
-- GAMS — Migration 005: Add 'rejected' value to institution_status enum
-- Needed so rejectInstitution() can set a semantically correct status
-- instead of reusing 'suspended' for first-time rejections.
-- =============================================================================

ALTER TYPE institution_status ADD VALUE IF NOT EXISTS 'rejected';
