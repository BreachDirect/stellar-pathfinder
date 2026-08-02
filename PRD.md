# PRD — Stellar Pathfinder

## Problem

Sending money across currencies via Stellar means going through one or more
Anchors (fiat on/off-ramps). Each anchor has different fees, processing
times, and supported currency pairs. There's no easy way for a user to
compare routes and find the cheapest/fastest path from currency A to
currency B.

## Goal

A dashboard where a user picks a source currency, destination currency, and
amount, and gets back ranked routes (including multi-hop, e.g.
USD → USDC → EUR) with fee and time estimates — eventually executable
on-chain via a connected wallet.

## Users

Individuals and small businesses making cross-border transfers who want to
compare anchor routes instead of picking one blind.

## Success metrics (Phase 1)

- User can enter a source currency, destination currency, and amount, and
  see a ranked list of routes (1-hop and 2-hop) with fee/time estimates.
- Routing engine correctly finds all valid paths through a mocked anchor
  dataset, ranks them by total cost, and handles the "no route exists" case
  cleanly.
- UI is responsive and usable end to end against mock data — no backend
  dependency required to demo Phase 1.

## Phases

**Phase 1 (this build):** React + Vite scaffold, mocked anchor dataset,
routing engine (1-hop and 2-hop path-finding + fee/time ranking),
`RemittanceForm` / `RouteList` / `RouteCard` components, basic responsive
styling. No live network calls yet — data comes from a mock anchor list
that mirrors real Stellar Anchor info-endpoint shapes, so swapping in live
data in Phase 2 is a data-source change, not a redesign.

**Phase 2 (issues only, not built yet):** Replace mock data with live
Stellar Horizon API calls and live Anchor SEP-24/SEP-31 info endpoints;
routing engine re-ranks using real fee/time data; graceful degradation when
an anchor's info endpoint is unreachable.

**Phase 3 (issues only, not built yet):** Freighter wallet connect,
on-chain transaction execution for the selected route, transaction history,
error handling/toasts, test coverage, CI, docs, deployment.
