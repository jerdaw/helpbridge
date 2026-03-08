-- =====================================================================================
-- Migration: v22.0 Harden bulk_update_service_status admin check
-- =====================================================================================
-- Purpose:
-- Replace legacy auth.jwt()->user_metadata role check with secure app_admins-backed
-- is_admin() authorization, to align with current admin model.
-- =====================================================================================

CREATE OR REPLACE FUNCTION bulk_update_service_status(
  p_service_ids TEXT[],
  p_verification_status TEXT DEFAULT NULL,
  p_published BOOLEAN DEFAULT NULL,
  p_admin_user_id UUID DEFAULT NULL
) RETURNS TABLE(updated_count INT, failed_ids TEXT[]) AS $$
DECLARE
  v_updated_count INT := 0;
  v_failed_ids TEXT[] := ARRAY[]::TEXT[];
  v_service_id TEXT;
BEGIN
  -- Validate admin role against app_admins table
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can bulk update services';
  END IF;

  -- Update each service
  FOREACH v_service_id IN ARRAY p_service_ids
  LOOP
    BEGIN
      UPDATE services
      SET
        verification_status = COALESCE(p_verification_status, verification_status),
        published = COALESCE(p_published, published),
        reviewed_by = COALESCE(p_admin_user_id, (SELECT auth.uid())),
        last_admin_review = NOW(),
        updated_at = NOW()
      WHERE id = v_service_id;

      IF FOUND THEN
        v_updated_count := v_updated_count + 1;
      ELSE
        v_failed_ids := array_append(v_failed_ids, v_service_id);
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_failed_ids := array_append(v_failed_ids, v_service_id);
    END;
  END LOOP;

  RETURN QUERY SELECT v_updated_count, v_failed_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Keep immutable search_path hardening in place
ALTER FUNCTION bulk_update_service_status(TEXT[], TEXT, BOOLEAN, UUID) SET search_path = public;
