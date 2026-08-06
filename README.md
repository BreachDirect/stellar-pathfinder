# Stellar Pathfinder

Compare cross-border remittance routes across Stellar anchors — 1-hop and
2-hop paths, ranked by compounded fee + time.

See `PRD.md` for the product goal and `architecture.md` for how it's built.
See [`adr/`](adr/) for the reasoning behind significant architecture decisions.

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
