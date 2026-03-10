---
status: draft
last_updated: 2026-03-10
owner: jer
tags: [deployment, vps, docker, caddy, proof]
---

# Direct VPS Private Proof

This document describes the **current active deployment proof path** for Kingston Care Connect.

Current goal:

1. package the app as a Docker container,
2. run it privately on the Hetzner VPS,
3. bind it to `127.0.0.1:3300`,
4. verify `GET /api/v1/health` before any public ingress or DNS change.

This is the active path for migration work. The root [DEPLOY.md](../../DEPLOY.md) file remains a **legacy Vercel guide** only.

## Runtime Shape

The private proof uses:

1. Docker on the host VPS,
2. host-managed Caddy for eventual ingress,
3. loopback-only bind during proof (`127.0.0.1:3300 -> container:3000`),
4. the Next.js standalone production output from `npm run build`.

## Local Prerequisites

Before copying anything to the VPS:

1. `npm run lint`
2. `npm run type-check`
3. `npm run build`
4. ensure the env contract is known from `.env.example`

Do not use Playwright locally for this proof step.

## Packaging Files

The direct VPS proof uses:

1. [`Dockerfile`](../../Dockerfile)
2. [`scripts/deploy-vps-proof.sh`](../../scripts/deploy-vps-proof.sh)

The deploy script expects exactly one argument:

```bash
./scripts/deploy-vps-proof.sh /path/to/env-file
```

It will:

1. build a tagged image,
2. replace the existing `kingston-care-connect-web` container if present,
3. run it with `--restart unless-stopped`,
4. publish `127.0.0.1:3300:3000`,
5. print the expected health URL.

## Expected Health Check

After the container starts, verify:

```bash
curl -fsS http://127.0.0.1:3300/api/v1/health
```

Expected outcome:

1. HTTP success,
2. JSON response,
3. no container crash loop.

## Current Limits

This document only covers the **private proof**.

It does not yet cover:

1. public DNS,
2. public Caddy site blocks,
3. apex vs `www` policy,
4. cutover or rollback sequencing.

Those should be documented only after the private proof is confirmed healthy on the VPS.
