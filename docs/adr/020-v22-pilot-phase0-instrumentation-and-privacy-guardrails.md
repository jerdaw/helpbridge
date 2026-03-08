---
status: stable
last_updated: 2026-03-08
owner: jer
tags: [architecture, pilot, privacy, rls, supabase, governance]
---

# ADR-020: v22 Phase 0 Pilot Instrumentation and Privacy Guardrails

## Context and Problem Statement

v22 requires measurable evidence of non-duplicate value (connection outcomes, referral completion, and freshness reliability) before expanding feature scope. Existing production schema did not include pilot outcome event tables, and pilot APIs needed strict privacy and authorization controls from day one.

Without explicit schema and API guardrails:

1. pilot metrics could not be captured consistently,
2. raw user-text fields could leak into instrumentation payloads,
3. internal pilot APIs could drift from governance redlines,
4. migration history could diverge when SQL is run manually in the Supabase dashboard.

## Decision Drivers

- Preserve privacy-first constraints (no raw query-text persistence).
- Keep migration risk low (additive-only schema introduction).
- Enforce RLS and least privilege before pilot writes begin.
- Provide explicit missing-table safety behavior to avoid silent failures.
- Keep local and remote migration history consistent after manual SQL execution.

## Considered Options

1. Defer schema work and store pilot data in existing generic tables.
   - Rejected: weak contracts, higher privacy drift risk, hard to audit.
2. Add pilot tables without dedicated API/schema validation.
   - Rejected: unsafe write surface and poor governance enforcement.
3. Add dedicated pilot tables + strict validation + RLS from first migration.
   - Chosen.

## Decision Outcome

Adopt dedicated Phase 0 pilot instrumentation with additive Supabase migrations, strict request contracts, and privacy/authorization guardrails.

Implemented components:

1. Pilot schema migration with four tables and full CRUD RLS policies:
   - `pilot_contact_attempt_events`
   - `pilot_referral_events`
   - `pilot_metric_snapshots`
   - `pilot_integration_feasibility_decisions`
2. Admin hardening migration:
   - `bulk_update_service_status` now enforces `is_admin()` and no longer depends on `user_metadata`.
3. Internal pilot APIs:
   - `POST /api/v1/pilot/events/contact-attempt`
   - `POST /api/v1/pilot/events/referral`
   - `PATCH /api/v1/pilot/events/referral/{id}`
   - `GET /api/v1/pilot/metrics/scorecard`
   - `POST /api/v1/pilot/integration-feasibility`
4. Zod schemas with disallowed-key privacy guards (`query`, `query_text`, `message`, `user_text`, `notes`).
5. Read-only verification and rollback scripts for safe operations.

## Consequences

### Positive

- Pilot instrumentation is now auditable, scoped, and test-covered.
- Governance redlines are enforced in both schema and API validation.
- Migration state is reproducible and tracked in Supabase migration history.
- Missing-table conditions remain explicit (`501`) rather than silently dropping writes.

### Negative / Tradeoffs

- Additional schema and policy surface area increases maintenance overhead.
- Gate 0 still depends on non-schema artifacts (decision locks, threat model closure, baseline evidence).
- Manual dashboard SQL still requires CLI `migration repair` discipline to keep history aligned.

## Implementation Notes

- Migrations:
  - `20260308120000_v22_pilot_phase0_tables.sql`
  - `20260308121000_v22_harden_bulk_update_service_status_admin_check.sql`
- Verification scripts:
  - `supabase/scripts/v22-pilot-migration-preflight.sql`
  - `supabase/scripts/v22-pilot-migration-preflight-safe.sql`
  - `supabase/scripts/v22-pilot-migration-preflight-ultra-safe.sql`
  - `supabase/scripts/v22-pilot-post-migration-verify.sql`
  - `supabase/scripts/v22-pilot-rollback.sql`

## Related Decisions

- [ADR-013: Consolidated RLS Policies](013-consolidated-rls-policies.md)
- [ADR-017: Authorization Resilience Strategy](017-authorization-resilience-strategy.md)
- [ADR-019: Production Observability and Alerting System](019-production-observability-and-alerting.md)

## Links

- `docs/planning/v22-0-non-duplicate-value-decision-plan.md`
- `docs/planning/v22-0-approval-checklist.md`
- `docs/implementation/v22-0-phase-0-implementation-plan.md`
- `docs/implementation/v22-0-db-migration-readiness-audit.md`
