---
status: draft
last_updated: 2026-03-08
owner: jer
tags: [implementation, v22.0, database, migration, safety]
---

# v22.0 DB Migration Readiness Audit

## Objective

Establish a **safe, evidence-first migration posture** before introducing any v22.0 pilot tables.

This audit is intentionally non-destructive and focuses on:

1. understanding effective schema/RLS/function behavior,
2. identifying schema drift risks,
3. defining a preflight protocol to prevent data loss/regression.

## Scope and Method

Evidence sources reviewed:

1. `supabase/migrations/*.sql` (full ordered chain)
2. `supabase/schema.sql`
3. runtime DB usage in `app/**`, `lib/**`, `hooks/**`, `scripts/**`, `tests/**`
4. Supabase config and setup docs (`supabase/config.toml`, `README.md`)

Limitations:

1. No live DB credentials currently present in this environment (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` all missing).
2. Local migration replay could not be executed because Docker is unavailable (`supabase db reset` failed before running migrations).

## High-Risk Findings

### 1) Documentation and schema bootstrap drift (Critical)

`README.md` still instructs bootstrap via `supabase/schema.sql`, but that file is not an up-to-date canonical representation of the migration chain.

Evidence:

1. Setup instruction uses `supabase/schema.sql` directly.
2. `schema.sql` `services` table does not define `hours_text`, `fees_fr`, `eligibility_fr`, `application_process_fr`, but `services_public` in the same file selects them.

Impact:

1. New-environment bootstrap risk.
2. High probability of inconsistent environments.

### 2) Migration chain appears non-self-contained (Critical)

Current migrations do not include base `CREATE TABLE` for core objects such as `services`, `organizations`, and `analytics_events`, yet later migrations depend on them.

Impact:

1. Replay-from-scratch reliability risk.
2. Potential hidden/manual baseline dependency.

### 3) Supabase config seed path mismatch (High)

`supabase/config.toml` references `./seed.sql`, but repository currently has `seed-plain-language.sql` only.

Impact:

1. `supabase db reset`/seed workflows may be incomplete or fail depending on environment.

### 4) Generated DB typings are stale vs migrations/runtime (High)

`types/supabase.ts` lacks many active tables/views/columns and still encodes legacy shapes (`service_update_requests.updates` vs actual `field_updates`, legacy `plain_language_summaries` shape, no `organization_settings`, `app_admins`, etc.).

Impact:

1. Type-safety blind spots.
2. Migration work may appear “type-clean” while still being runtime-incompatible.

### 5) Mixed admin authority model persists (Medium)

DB policies/functions moved toward `app_admins`/`is_admin()`, but some function and app code paths still depend on `auth.jwt()->user_metadata->role`.

Impact:

1. Split-brain admin semantics.
2. Harder rollout validation during migration windows.

### 6) Pilot tables are referenced by API/storage but not yet in schema (Expected)

Internal pilot routes intentionally return `501` when pilot tables are absent.

Impact:

1. Safe fail behavior exists now.
2. Migration must be additive-only and carefully permissioned.

## Effective DB Surface Used by Application

Runtime currently references these key objects:

1. Core data: `services`, `services_public`, `organizations`, `organization_members`
2. Feedback/update loop: `feedback`, `service_update_requests`, `plain_language_summaries`, `feedback_aggregations`, `unmet_needs_summary`
3. Analytics/ops: `analytics_events`, `search_analytics`, `partner_service_analytics`, `notifications`, `notification_audit`, `reindex_progress`, `audit_logs`, `admin_actions`
4. Governance/admin: `app_admins`, `organization_settings`, `organization_invitations`, `partner_terms_acceptance`, `service_submissions`, `push_subscriptions`
5. RPCs: `soft_delete_service`, `transfer_ownership`, `log_admin_action`, `update_reindex_progress`

## v22 Pilot Target Objects (Not Yet Migrated)

1. `pilot_contact_attempt_events`
2. `pilot_referral_events`
3. `pilot_metric_snapshots`
4. `pilot_integration_feasibility_decisions`

## Safe Migration Protocol (Mandatory)

### Phase A: Preflight (Read-only, no schema changes)

1. Run `supabase/scripts/v22-pilot-migration-preflight.sql` in Supabase SQL Editor.
   Preferred: run `supabase/scripts/v22-pilot-migration-preflight-ultra-safe.sql` first.
2. Export results (CSV/screenshots) as migration evidence.
3. Confirm:
   1. core object existence,
   2. RLS and policy state,
   3. grants/search_path posture,
   4. row-count baseline for critical tables.

### Phase B: Migration design constraints

1. **Additive-only** first migration (new pilot tables only).
2. No modifications to existing core tables/policies/functions in first pass.
3. Explicit RLS for pilot tables from day 1.
4. Foreign keys only where contractually required and low-risk.
5. Avoid introducing new global enums if text + CHECK is sufficient for first cut.

### Phase C: Post-migration verification

1. Re-run preflight script and diff key sections.
2. Verify no regressions on existing policy/table visibility.
3. Validate pilot endpoints return `201/200` paths where appropriate and no longer return `501` for missing tables.

### Phase D: Rollback readiness

1. Keep rollback SQL prepared before apply.
2. Rollback should drop only newly introduced pilot objects.
3. Never drop/alter existing legacy objects during rollback.

## Autonomous Work Completed vs Remaining

Completed autonomously:

1. full repository migration + runtime usage audit,
2. risk classification,
3. read-only live-DB preflight script.

Blocked pending credentials/infrastructure:

1. live production/dev DB inventory execution,
2. before/after row-count diff capture,
3. dry-run migration replay in local Supabase (Docker unavailable).

## Next Gate

Do **not** author/apply pilot migration SQL until preflight evidence is collected from the live database.

Once preflight output is available, we can finalize an additive migration with exact constraints/policies against the observed live state.
