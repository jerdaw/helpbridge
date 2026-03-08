---
status: draft
last_updated: 2026-03-08
owner: jer
tags: [security, v22.0, threat-model, offline, privacy]
---

# v22.0 Offline/Local Data Threat Model

This document evaluates confidentiality, integrity, and availability risks for offline/local data handling in v22 pilot workflows.

Related:

1. [v22.0 Phase 0 Implementation Plan](../implementation/v22-0-phase-0-implementation-plan.md)
2. [v22.0 Non-Duplicate Value Decision Plan](../planning/v22-0-non-duplicate-value-decision-plan.md)

## Scope

In scope:

1. Browser local storage and IndexedDB caches.
2. Offline synchronization queues.
3. Pilot event payloads stored/transmitted locally.
4. Device-loss and unauthorized local access scenarios.

Out of scope:

1. Unrelated server infrastructure not used by pilot workflows.
2. Third-party systems beyond integration redline assessment.

## Assets

| Asset                               | Sensitivity | Storage Location        | Owner                    |
| ----------------------------------- | ----------- | ----------------------- | ------------------------ |
| Service directory cache             | Medium      | IndexedDB               | Engineering              |
| Embeddings cache                    | Low/Medium  | IndexedDB               | Engineering              |
| Pilot contact/referral event drafts | High        | Local/offline queue     | Engineering + Governance |
| Sync metadata and timestamps        | Medium      | Local storage/IndexedDB | Engineering              |

## Threat Scenarios

| Threat ID | Scenario                                                      | Impact                      | Likelihood | Severity (`critical` \| `high` \| `medium` \| `low`) | Mitigation                                                  | Owner                 | Status  |
| --------- | ------------------------------------------------------------- | --------------------------- | ---------- | ---------------------------------------------------- | ----------------------------------------------------------- | --------------------- | ------- |
| T1        | Lost or stolen device exposes locally cached pilot event data | Confidentiality breach      | Medium     | high                                                 | Minimize local payload, avoid PII fields, aggressive expiry | Engineering           | pending |
| T2        | Malicious script attempts local data exfiltration             | Confidentiality breach      | Low/Medium | high                                                 | CSP hardening, input sanitization, no raw query persistence | Engineering           | pending |
| T3        | Offline queue replay duplicates/poisons metrics events        | Integrity loss              | Medium     | medium                                               | Idempotency keys and duplicate guards                       | Engineering           | pending |
| T4        | Stale offline data appears current to pilot users             | Integrity loss              | Medium     | medium                                               | Freshness timestamps and stale-state UI flags               | Product + Engineering | pending |
| T5        | Local corruption drops queued referral outcomes               | Availability/integrity loss | Low/Medium | medium                                               | Retry + health checks + sync diagnostics                    | Engineering           | pending |

## Risk Acceptance Rule

1. Any unresolved `critical` finding blocks Gate 0 completion.
2. Any unresolved `high` finding requires explicit owner, due date, and mitigation plan.

## Mitigation Tracking

| Finding ID | Severity | Mitigation Plan | Owner | Due Date | Verification Method | Verified |
| ---------- | -------- | --------------- | ----- | -------- | ------------------- | -------- |
| F1         | Pending  | Pending         | TBD   | TBD      | TBD                 | no       |

## Validation Checklist

- [ ] Device-loss scenario assessed for all local data classes
- [ ] Local payload minimization reviewed against privacy redlines
- [ ] Sync queue integrity controls documented
- [ ] Stale-data handling and UX fallback reviewed
- [ ] No unresolved `critical` findings

## Gate 0 Security Outcome

| Criterion                                        | Status |
| ------------------------------------------------ | ------ |
| Critical findings resolved                       | NO-GO  |
| High findings have owners and mitigation plans   | NO-GO  |
| Threat model signed by security/governance owner | NO-GO  |
