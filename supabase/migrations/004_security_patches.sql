-- =============================================================================
-- GAMS — Migration 004: Security Patches
-- Adds missing RLS policies for orders and notifications.
-- =============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_own_select" ON public.orders;
CREATE POLICY "orders_own_select"
ON public.orders
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "orders_own_insert" ON public.orders;
CREATE POLICY "orders_own_insert"
ON public.orders
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_all"
ON public.orders
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'gov_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role IN ('super_admin', 'gov_admin')
  )
);

DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
CREATE POLICY "notifications_own"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_own_update" ON public.notifications;
CREATE POLICY "notifications_own_update"
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
