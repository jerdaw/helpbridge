---
status: stable
last_updated: 2026-03-12
owner: jer
tags: [testing, e2e, baseline, known-limitations, v19.0]
---

# E2E Automation Baseline (2026-03-12)

This document records the accepted browser-automation baseline after the inline-skip cleanup completed on **2026-03-12**.

Policy:

1. The default `tests/e2e/**` Chromium suite should not carry inline `test.skip()` debt.
2. Environment-dependent checks should move into explicit opt-in automation commands, not remain as hidden default-suite skips.
3. New permanent skips require updates to this baseline file and roadmap references.

## Current Default-Suite Skip Inventory

Total inline skips in `tests/e2e/**`: **0**

## Dedicated Opt-In Suites

These checks remain automated, but they now live behind explicit commands because they require production-like or server-mode environments:

| Command                         | Purpose                                                                     | Environment                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run test:e2e:prod-local`   | Verify production-only browser behavior such as service worker registration | local production build plus Playwright-managed standalone server                                      |
| `npm run test:e2e:server-local` | Verify server-search/data-integrity behavior                                | local production build with `NEXT_PUBLIC_SEARCH_MODE=server` and Playwright-managed standalone server |

## Acceptance Decision

- Default-suite skip baseline accepted: `yes`
- Scope: launch-readiness automation while v22 Gate 0 evidence is still closing
- Follow-up requirement: keep the opt-in suites runnable and documented

## Change Control

When default-suite skip count or opt-in suite expectations change:

1. Update this file.
2. Update [Roadmap](../planning/roadmap.md) skip references.
3. Update [v19 Phase 1 Execution Handoff](../implementation/v19-phase-1-execution-handoff-2026-03-09.md).
