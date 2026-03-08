-- =====================================================================================
-- Migration: v22.0 Phase 0 Pilot Tables (Additive Only)
-- =====================================================================================
-- Purpose:
-- 1. Create pilot instrumentation tables for contact/referral/metrics/feasibility.
-- 2. Enforce privacy-safe enums/check constraints.
-- 3. Add RLS policies aligned with organization membership and admin controls.
--
-- Safety:
-- - Additive only (no changes to existing core tables/policies/functions).
-- - No data migration or destructive operation.
-- =====================================================================================

-- =====================================================================================
-- 1) pilot_contact_attempt_events
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pilot_contact_attempt_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_cycle_id TEXT NOT NULL CHECK (char_length(pilot_cycle_id) <= 100),
  service_id TEXT NOT NULL REFERENCES services(id),
  recorded_by_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  attempt_channel TEXT NOT NULL CHECK (
    attempt_channel IN ('phone', 'website', 'email', 'in_person', 'referral')
  ),
  attempt_outcome TEXT NOT NULL CHECK (
    attempt_outcome IN (
      'connected',
      'disconnected_number',
      'no_response',
      'intake_unavailable',
      'invalid_routing',
      'other_failure'
    )
  ),
  attempted_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  outcome_notes_code TEXT CHECK (
    outcome_notes_code IS NULL OR outcome_notes_code IN (
      'busy_signal',
      'voicemail_only',
      'eligibility_mismatch',
      'hours_mismatch',
      'capacity_full',
      'unknown_failure'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pilot_contact_attempt_resolved_after_attempt
    CHECK (resolved_at IS NULL OR resolved_at >= attempted_at)
);

CREATE INDEX IF NOT EXISTS idx_pilot_contact_attempt_cycle_org_time
  ON pilot_contact_attempt_events(pilot_cycle_id, recorded_by_org_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_pilot_contact_attempt_service_time
  ON pilot_contact_attempt_events(service_id, attempted_at DESC);

ALTER TABLE pilot_contact_attempt_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pilot contact attempts select" ON pilot_contact_attempt_events;
CREATE POLICY "Pilot contact attempts select" ON pilot_contact_attempt_events
  FOR SELECT
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_contact_attempt_events.recorded_by_org_id
      AND om.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Pilot contact attempts insert" ON pilot_contact_attempt_events;
CREATE POLICY "Pilot contact attempts insert" ON pilot_contact_attempt_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_contact_attempt_events.recorded_by_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Pilot contact attempts update" ON pilot_contact_attempt_events;
CREATE POLICY "Pilot contact attempts update" ON pilot_contact_attempt_events
  FOR UPDATE
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_contact_attempt_events.recorded_by_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_contact_attempt_events.recorded_by_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Pilot contact attempts delete" ON pilot_contact_attempt_events;
CREATE POLICY "Pilot contact attempts delete" ON pilot_contact_attempt_events
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================================================
-- 2) pilot_referral_events
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pilot_referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_cycle_id TEXT NOT NULL CHECK (char_length(pilot_cycle_id) <= 100),
  source_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  target_service_id TEXT NOT NULL REFERENCES services(id),
  referral_state TEXT NOT NULL CHECK (
    referral_state IN ('initiated', 'connected', 'failed', 'client_withdrew', 'no_response_timeout')
  ),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  terminal_at TIMESTAMPTZ,
  failure_reason_code TEXT CHECK (
    failure_reason_code IS NULL OR failure_reason_code IN (
      'disconnected_number',
      'no_response',
      'intake_closed',
      'ineligible',
      'capacity_full',
      'unknown_failure'
    )
  ),

  CONSTRAINT pilot_referral_updated_after_created
    CHECK (updated_at >= created_at),
  CONSTRAINT pilot_referral_terminal_after_created
    CHECK (terminal_at IS NULL OR terminal_at >= created_at)
);

CREATE INDEX IF NOT EXISTS idx_pilot_referral_cycle_org_updated
  ON pilot_referral_events(pilot_cycle_id, source_org_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_pilot_referral_target_service
  ON pilot_referral_events(target_service_id);

ALTER TABLE pilot_referral_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pilot referrals select" ON pilot_referral_events;
CREATE POLICY "Pilot referrals select" ON pilot_referral_events
  FOR SELECT
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_referral_events.source_org_id
      AND om.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Pilot referrals insert" ON pilot_referral_events;
CREATE POLICY "Pilot referrals insert" ON pilot_referral_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_referral_events.source_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Pilot referrals update" ON pilot_referral_events;
CREATE POLICY "Pilot referrals update" ON pilot_referral_events
  FOR UPDATE
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_referral_events.source_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_referral_events.source_org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Pilot referrals delete" ON pilot_referral_events;
CREATE POLICY "Pilot referrals delete" ON pilot_referral_events
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================================================
-- 3) pilot_metric_snapshots
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pilot_metric_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_cycle_id TEXT NOT NULL CHECK (char_length(pilot_cycle_id) <= 100),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  metric_id TEXT NOT NULL CHECK (
    metric_id IN ('M1', 'M2_P50', 'M2_P75', 'M2_P90', 'M3', 'M4', 'M5', 'M6', 'M7')
  ),
  metric_value NUMERIC,
  numerator NUMERIC,
  denominator NUMERIC,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT pilot_metric_non_negative_denominator
    CHECK (denominator IS NULL OR denominator >= 0),
  CONSTRAINT pilot_metric_non_negative_numerator
    CHECK (numerator IS NULL OR numerator >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pilot_metric_cycle_org_calc
  ON pilot_metric_snapshots(pilot_cycle_id, org_id, calculated_at DESC);

CREATE INDEX IF NOT EXISTS idx_pilot_metric_cycle_metric_calc
  ON pilot_metric_snapshots(pilot_cycle_id, metric_id, calculated_at DESC);

ALTER TABLE pilot_metric_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pilot metric snapshots select" ON pilot_metric_snapshots;
CREATE POLICY "Pilot metric snapshots select" ON pilot_metric_snapshots
  FOR SELECT
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_metric_snapshots.org_id
      AND om.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Pilot metric snapshots insert" ON pilot_metric_snapshots;
CREATE POLICY "Pilot metric snapshots insert" ON pilot_metric_snapshots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = pilot_metric_snapshots.org_id
      AND om.user_id = (SELECT auth.uid())
      AND om.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Pilot metric snapshots update" ON pilot_metric_snapshots;
CREATE POLICY "Pilot metric snapshots update" ON pilot_metric_snapshots
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Pilot metric snapshots delete" ON pilot_metric_snapshots;
CREATE POLICY "Pilot metric snapshots delete" ON pilot_metric_snapshots
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================================================
-- 4) pilot_integration_feasibility_decisions
-- =====================================================================================
CREATE TABLE IF NOT EXISTS pilot_integration_feasibility_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision TEXT NOT NULL CHECK (decision IN ('go', 'conditional', 'blocked')),
  decision_date DATE NOT NULL,
  redline_checklist_version TEXT NOT NULL CHECK (char_length(redline_checklist_version) <= 50),
  violations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  compensating_controls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  owners TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  CONSTRAINT pilot_integration_owners_not_empty
    CHECK (array_length(owners, 1) IS NOT NULL AND array_length(owners, 1) >= 1),
  CONSTRAINT pilot_integration_go_has_no_violations
    CHECK (
      decision <> 'go'
      OR COALESCE(array_length(violations, 1), 0) = 0
    ),
  CONSTRAINT pilot_integration_conditional_requires_controls
    CHECK (
      decision <> 'conditional'
      OR COALESCE(array_length(compensating_controls, 1), 0) >= 1
    )
);

CREATE INDEX IF NOT EXISTS idx_pilot_integration_decisions_date
  ON pilot_integration_feasibility_decisions(decision_date DESC, created_at DESC);

ALTER TABLE pilot_integration_feasibility_decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pilot integration decisions select" ON pilot_integration_feasibility_decisions;
CREATE POLICY "Pilot integration decisions select" ON pilot_integration_feasibility_decisions
  FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Pilot integration decisions insert" ON pilot_integration_feasibility_decisions;
CREATE POLICY "Pilot integration decisions insert" ON pilot_integration_feasibility_decisions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin() AND (created_by IS NULL OR created_by = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Pilot integration decisions update" ON pilot_integration_feasibility_decisions;
CREATE POLICY "Pilot integration decisions update" ON pilot_integration_feasibility_decisions
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Pilot integration decisions delete" ON pilot_integration_feasibility_decisions;
CREATE POLICY "Pilot integration decisions delete" ON pilot_integration_feasibility_decisions
  FOR DELETE
  TO authenticated
  USING (is_admin());
