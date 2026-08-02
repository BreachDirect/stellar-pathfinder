# Architecture — Stellar Pathfinder

## Overview

React 18 + Vite SPA. Phase 1 has no backend — all data comes from a mock
anchor dataset shaped identically to what Phase 2's real Horizon/Anchor
calls will return, so the data-source swap in Phase 2 doesn't require
touching the routing engine or components.

```
┌─────────────────┐      ┌──────────────────┐      ┌────────────────┐
│  RemittanceForm │─────▶│   routingEngine  │─────▶│   RouteList     │
│  (currency in/  │      │   (pathfinding + │      │   (ranked       │
│   out, amount)  │      │    fee ranking)  │      │   RouteCards)   │
└─────────────────┘      └──────────────────┘      └────────────────┘
                                  ▲
                                  │
                          ┌───────────────┐
                          │ mockAnchors.js │  ← Phase 2 replaces this
                          │ (data source)  │     with live API calls
                          └───────────────┘
```

## Data shape (mock anchor dataset)

Each anchor entry mirrors the fields Phase 2's live SEP-24/SEP-31 info
endpoints will provide, so the routing engine's input contract doesn't
change later:

```js
{
  id: "anchor-usdc-eur",
  name: "MockAnchor EU",
  fromCurrency: "USDC",
  toCurrency: "EUR",
  feePercent: 0.5,       // matches SEP info endpoint "fee_fixed"/"fee_percent" shape
  estimatedMinutes: 15,
  minAmount: 1,
  maxAmount: 50000,
}
```

## Components

### `src/data/mockAnchors.js`
Static array of anchor entries covering enough currency pairs to exercise
both 1-hop and 2-hop routing (e.g. USD→USDC, USDC→EUR, USD→GBP directly,
EUR→NGN, etc.).

### `src/engine/routingEngine.js`
Pure function, no React/DOM dependency (easy to unit test in isolation,
and Phase 2 swaps its data input without touching this file):

```js
findRoutes({ fromCurrency, toCurrency, amount, anchors }) -> Route[]
```

Algorithm (Phase 1 scope — up to 2 hops):
1. Direct anchors where `fromCurrency -> toCurrency` exists: 1-hop routes.
2. For every anchor where `fromCurrency -> X`, look for a second anchor
   `X -> toCurrency`: 2-hop routes.
3. Each route computes: total fee (compounded across hops), total
   estimated time (summed across hops), and a `totalCost` used for
   ranking (fee-weighted; ties broken by time).
4. Returns routes sorted by `totalCost` ascending. Empty array (not an
   error) if no route exists — the UI renders a clear "no route found"
   state rather than treating this as a failure.

### `src/components/RemittanceForm.jsx`
Currency-pair selectors (populated from the set of currencies present in
`mockAnchors.js`, so Phase 2 swapping the data source automatically
updates available currencies) + amount input. On submit, calls
`findRoutes` and lifts the result to the parent.

### `src/components/RouteList.jsx`
Renders a list of `RouteCard`s, or an empty-state message when
`routes.length === 0`.

### `src/components/RouteCard.jsx`
One route: hop path (e.g. "USD → USDC → EUR"), total fee, total estimated
time, and per-hop breakdown.

### `src/App.jsx`
Wires `RemittanceForm` → routing state → `RouteList`. All state lives here
in Phase 1 (no state management library needed at this size).

## Why this structure survives into Phase 2/3

- `routingEngine.js` takes anchors as a parameter rather than importing
  the mock data directly — Phase 2 passes it live-fetched anchors instead,
  zero changes to the engine itself.
- Components only know about the `Route` shape returned by the engine,
  not where the anchor data came from — Phase 3's wallet/execution layer
  attaches to a route the same way regardless of data source.
- No premature backend/state-management complexity — Phase 1 stays a
  static, demoable SPA.

## Known limitations at end of Phase 1

- Data is fully mocked — no live Horizon/Anchor calls (Phase 2).
- No wallet connection or transaction execution (Phase 3).
- Routing engine caps at 2 hops (matches original project scope; deeper
  multi-hop routing is a possible Phase 3+ enhancement, not committed).
