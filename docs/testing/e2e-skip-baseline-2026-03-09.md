---
status: stable
last_updated: 2026-03-09
owner: jer
tags: [testing, e2e, baseline, known-limitations, v19.0]
---

# E2E Skip Baseline (2026-03-09)

This document records the accepted baseline for currently skipped E2E tests in v19 Phase 1.5.

Policy:

1. Skips are allowed only with explicit rationale, workaround, owner, and revisit date.
2. New skips require updates to this baseline file and roadmap references.

## Current Skip Inventory (Total: 7)

| Test File                          | Test Name                                                  | Skip Type               | Rationale                                                                                                       | Workaround                                                                              | Owner | Revisit Date |
| ---------------------------------- | ---------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----- | ------------ |
| `tests/e2e/about.spec.ts`          | `Navigation links work`                                    | unconditional           | Locale route transition assertion is flaky; URL remains on locale root in CI runs.                              | Validate navigation links manually in Phase 1 QA browser walkthrough.                   | jer   | 2026-04-15   |
| `tests/e2e/dashboard.spec.ts`      | `should navigate to partner login`                         | unconditional           | Full partner auth redirect flow requires stable Supabase auth-state mocking not present in current E2E harness. | Manual partner-login verification with Supabase-enabled local/production environment.   | jer   | 2026-04-15   |
| `tests/e2e/offline.spec.ts`        | `Service worker is registered (manual)`                    | unconditional           | Service worker registration is production-only; disabled in dev/CI execution mode.                              | Validate via `npm run build && npm start` and manual browser SW inspection.             | jer   | 2026-04-15   |
| `tests/e2e/multi-lingual.spec.ts`  | `Language selector switches locales and updates UI labels` | unconditional           | Sequential Radix popover locale switching is flaky in CI timing conditions.                                     | Validate core switching in `tests/e2e/language.spec.ts` plus manual multi-locale sweep. | jer   | 2026-04-15   |
| `tests/e2e/multi-lingual.spec.ts`  | `Provincial crisis lines are visible and labeled`          | unconditional           | Depends on fixture/data alignment for `crisis-988` with `scope=canada` and badge rendering.                     | Verify badge behavior manually with server search mode and known dataset.               | jer   | 2026-04-15   |
| `tests/e2e/data-integrity.spec.ts` | `Critical services have correct scope configuration`       | conditional (`CI` only) | Requires live Supabase + server search mode; not stable in CI environment.                                      | Run locally with `NEXT_PUBLIC_SEARCH_MODE=server` and valid Supabase credentials.       | jer   | 2026-04-15   |
| `tests/e2e/data-integrity.spec.ts` | `Search API returns valid structure for all locales`       | conditional (`CI` only) | Requires live Supabase + server search mode; CI environment lacks required data/auth context.                   | Run locally with `NEXT_PUBLIC_SEARCH_MODE=server` and valid Supabase credentials.       | jer   | 2026-04-15   |

## Acceptance Decision

- Baseline accepted for v19 Phase 1.5: `yes`
- Scope: launch-readiness execution while v22 Gate 0 evidence is still closing
- Follow-up requirement: re-evaluate all 7 skips by `2026-04-15`

## Change Control

When skip count or rationale changes:

1. Update this file.
2. Update [Roadmap](../planning/roadmap.md) skip references.
3. Update [v19 Phase 1 Execution Handoff](../implementation/v19-phase-1-execution-handoff-2026-03-09.md).
