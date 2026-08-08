# ADR-0001: Keep the routing engine framework-agnostic

**Status:** Accepted
**Date:** 2026-08-02

## Context

`src/engine/routingEngine.js` is the core of the app: it takes a currency
pair, an amount, and a set of anchors, and returns ranked routes. It would
have been easy to write it as a React hook (e.g. `useRoutes()`) or to have
it reach directly into `mockAnchors.js` for its data, since Phase 1 only
ever calls it from one place (`App.jsx`).

But two things were already known when this was built:

- Phase 2 replaces the mock anchor dataset with live SEP-24/SEP-31 data
  fetched from real anchors — the routing engine's *input* would need to
  change from "imported constant" to "fetched data," regardless of how the
  engine itself was written.
- The routing/ranking logic (fee compounding across hops, cheapest-first
  ranking) is exactly the kind of logic that benefits most from being unit
  tested directly, without needing to render any component to exercise it.

## Decision

`routingEngine.js` is a pure function with no React or DOM dependency:

```js
findRoutes({ fromCurrency, toCurrency, amount, anchors }) -> Route[]
```

It receives `anchors` as a parameter rather than importing `mockAnchors.js`
itself, and it has no knowledge of React, hooks, or the component tree.
Components (`App.jsx`) own the state and call `findRoutes` directly, the
same way they'd call any other plain function.

## Consequences

- **Positive:** Phase 2 swaps the mock dataset for live anchor data by
  changing what gets passed into `findRoutes` at the call site in
  `App.jsx` — zero changes to `routingEngine.js` itself.
- **Positive:** the routing engine's test suite (`tests/routingEngine.test.js`)
  can exercise every routing/ranking case directly, with no component
  rendering, wallet mocking, or DOM setup required.
- **Positive:** if a future phase ever needs routing logic outside a React
  context (e.g. a CLI tool, a backend job, a different frontend framework),
  this module can be reused as-is.
- **Negative / trade-off:** state management (loading state, the currently
  selected route, error display) has to live in the calling component
  rather than being bundled into a hook — acceptable at Phase 1's size
  (see `architecture.md`, "No premature backend/state-management
  complexity"), but worth revisiting if routing-related state grows
  complex enough to want a hook wrapping `findRoutes` later.

## Alternatives considered

- **A `useRoutes()` hook wrapping the algorithm:** would have coupled the
  algorithm to React from day one, working against the "swap the data
  source without touching the engine" goal above, and made the algorithm
  harder to unit test in isolation.
- **Importing `mockAnchors.js` directly inside the engine:** simpler for
  Phase 1 alone, but would have required editing `routingEngine.js` itself
  in Phase 2 to swap in live data, rather than only editing the call site.
