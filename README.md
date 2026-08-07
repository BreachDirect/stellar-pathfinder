# Stellar Pathfinder

Compare cross-border remittance routes across Stellar anchors — 1-hop and
2-hop paths, ranked by compounded fee + time.

See `PRD.md` for the product goal and `architecture.md` for how it's built.

## Status

**Phase 1 — complete.** React + Vite scaffold, mocked anchor dataset,
routing engine (pathfinding + fee/time ranking, unit tested), form → engine
→ results UI, responsive styling. No backend or wallet yet — fully
demoable against mock data.

**Phase 2 / Phase 3 — not built yet.** Tracked as GitHub issues: live
Horizon + Anchor SEP-24/31 integration, Freighter wallet connect,
transaction execution, transaction history, error handling, CI, docs,
deployment.

## Run locally

```bash
npm install
npm run dev
```

## Run tests

```bash
npm test
```

## Build

```bash
npm run build
```

## PR previews

Every PR gets a live preview deployed to GitHub Pages via
[`rossjrw/pr-preview-action`](https://github.com/rossjrw/pr-preview-action)
(`.github/workflows/pr-preview.yml`), posted as a comment on the PR. This
needs no external account or secrets — just GitHub Pages.

**One-time setup required** (repo admin, not done by this PR): enable Pages
under **Settings → Pages**, source **"Deploy from a branch"**, branch
**`gh-pages`** / **`/ (root)`**. The action creates the `gh-pages` branch
itself on first run if it doesn't already exist, but the Pages source still
needs to be pointed at it manually once.

**Known limitation:** `pr-preview-action` v1 does not support PRs opened
from forks (only PRs from branches within this repo) — noted in
[the action's own README](https://github.com/rossjrw/pr-preview-action) as
a v2 feature. Since most contributions to this repo arrive via forks,
previews won't appear on those PRs yet. Worth revisiting once v2 ships, or
switching to a Vercel/Netlify integration (which does support fork PRs, at
the cost of needing an external account + secrets configured by a
maintainer) if fork previews are needed sooner.

## Project structure

```
src/
  data/mockAnchors.js      # Phase 2 replaces this with live API calls
  engine/routingEngine.js  # pure function — pathfinding + ranking, no React/DOM
  components/
    RemittanceForm.jsx
    RouteList.jsx
    RouteCard.jsx
  App.jsx                  # wires form -> engine -> results
tests/
  routingEngine.test.js
```
