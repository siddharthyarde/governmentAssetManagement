-- =============================================================================
-- GAMS — Migration 003: Helper Functions
-- =============================================================================

-- ---------------------------------------------------------------------------
-- decrement_listing_qty
-- Called by the Razorpay verify API route after successful payment to
-- atomically reduce available inventory on a listing.
-- Uses a floor of 0 to avoid negative quantities.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION decrement_listing_qty(
  p_listing_id UUID,
  p_qty        INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE redistribution_listings
  SET
    quantity_available = GREATEST(0, quantity_available - p_qty),
    quantity_reserved  = quantity_reserved + p_qty,
    status = CASE
               WHEN GREATEST(0, quantity_available - p_qty) = 0 THEN 'reserved'::redistribution_status
               ELSE status
             END,
    updated_at = NOW()
  WHERE id = p_listing_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- approve_redistribution_request
-- Admin helper: approves a redistribution request and decrements inventory.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION approve_redistribution_request(
  p_request_id UUID,
  p_admin_id   UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_listing_id UUID;
  v_qty        INTEGER;
BEGIN
  SELECT listing_id, quantity_requested
  INTO v_listing_id, v_qty
  FROM redistribution_requests
  WHERE id = p_request_id;

  UPDATE redistribution_requests
  SET
    status      = 'approved',
    approved_by = p_admin_id,
    approved_at = NOW(),
    updated_at  = NOW()
  WHERE id = p_request_id;

  PERFORM decrement_listing_qty(v_listing_id, v_qty);
END;
$$;

-- ---------------------------------------------------------------------------
-- get_company_stats — summary counts for company dashboard
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_company_stats(p_company_id UUID)
RETURNS TABLE(
  total_products BIGINT,
  approved_products BIGINT,
  pending_products BIGINT,
  active_instances BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)                                             AS total_products,
    COUNT(*) FILTER (WHERE status = 'approved')          AS approved_products,
    COUNT(*) FILTER (WHERE status = 'pending_approval')  AS pending_products,
    (
      SELECT COUNT(*) FROM product_instances
      WHERE company_id = p_company_id
        AND status IN ('deployed', 'in_stock')
    ) AS active_instances
  FROM products
  WHERE company_id = p_company_id;
END;
$$;

-- =============================================================================
-- Done
-- =============================================================================
