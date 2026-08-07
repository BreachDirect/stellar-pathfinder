# Data Shapes: `Route` and `Hop`

Quick reference for the two core data shapes produced by
[`routingEngine.js`](../src/engine/routingEngine.js), so consumers don't need
to read the source to know what fields are available. These are also
documented inline as JSDoc `@typedef`s in that file — this document exists
for a faster look-up, not as a replacement.

## `Hop`

A single leg of a route: moving funds through one anchor from one currency
to another.

| Field | Type | Description |
|---|---|---|
| `anchorId` | `string` | Unique identifier of the anchor providing this leg |
| `anchorName` | `string` | Human-readable anchor name, for display |
| `fromCurrency` | `string` | Currency this hop accepts as input |
| `toCurrency` | `string` | Currency this hop outputs |
| `feePercent` | `number` | This hop's own fee, as a percentage (e.g. `0.5` = 0.5%) |
| `estimatedMinutes` | `number` | Estimated settlement time for this hop alone |

Example:

```js
{
  anchorId: "anchor-usdc-eur",
  anchorName: "MockAnchor EU",
  fromCurrency: "USDC",
  toCurrency: "EUR",
  feePercent: 0.5,
  estimatedMinutes: 15,
}
```

## `Route`

A complete path from the requested `fromCurrency` to `toCurrency` — either a
single `Hop` (direct) or two `Hop`s chained through an intermediate
currency.

| Field | Type | Description |
|---|---|---|
| `hops` | `Hop[]` | Ordered legs of this route (length 1 or 2 in the current pathfinding logic) |
| `totalFeePercent` | `number` | **Compounded** fee across all hops, not a simple sum — see [Compounding, not summing](#compounding-not-summing) below. Rounded to 4 decimal places |
| `totalEstimatedMinutes` | `number` | Sum of each hop's `estimatedMinutes` |
| `totalCost` | `number` | Ranking score used to sort routes (lower is better); not a currency amount — see [Ranking score](#ranking-score) below |
| `outputAmount` | `number` | Amount received after all fees, for the input amount that was requested. Rounded to 2 decimal places |

Example (2-hop route, for a requested input amount of 1000):

```js
{
  hops: [
    { anchorId: "a1", anchorName: "Anchor A", fromCurrency: "USDC", toCurrency: "MXN", feePercent: 0.5, estimatedMinutes: 10 },
    { anchorId: "a2", anchorName: "Anchor B", fromCurrency: "MXN", toCurrency: "EUR", feePercent: 0.8, estimatedMinutes: 20 },
  ],
  totalFeePercent: 1.296,
  totalEstimatedMinutes: 30,
  totalCost: 159.6,
  outputAmount: 987.04,
}
```

### Compounding, not summing

Two hops with 1% fees each do **not** produce a 2% total fee — fees compound
against the amount remaining after each prior hop, so the true total is
closer to 1.99%. This is computed by `compoundFeePercent()` and matters even
in the current mocked-data phase, since Phase 2 plugs real anchor fee data
into this exact same formula.

### Ranking score

`totalCost` is **not** a monetary amount — it's an internal score used only
to sort routes cheapest-first (fee is the dominant factor, estimated time is
a tiebreaker). Don't display `totalCost` to end users as if it were a fee or
a currency value; display `totalFeePercent` and `totalEstimatedMinutes`
separately instead, as [`RouteCard`](../src/components/RouteCard.jsx) does.

## Where these shapes come from and go to

- Produced by `findRoutes()` in `routingEngine.js`, from an `anchors` array
  (see `architecture.md` for the anchor data shape) plus a requested
  `fromCurrency`/`toCurrency`/`amount`.
- `findRoutes()` returns `Route[]`, already sorted cheapest-first. An empty
  array means no valid route was found for the request — this is a normal,
  expected outcome, not an error.
- Consumed by [`RouteList`](../src/components/RouteList.jsx) /
  [`RouteCard`](../src/components/RouteCard.jsx) for display; `RouteCard`
  also derives a human-readable path string (e.g. `USDC → MXN → EUR`) from
  `hops[0].fromCurrency` followed by each hop's `toCurrency`.
