// Pure routing engine — no React/DOM dependency. Takes anchors as a
// parameter (not imported directly) so Phase 2 can pass live-fetched data
// without touching this file.

/**
 * @typedef {Object} Hop
 * @property {string} anchorId
 * @property {string} anchorName
 * @property {string} fromCurrency
 * @property {string} toCurrency
 * @property {number} feePercent
 * @property {number} estimatedMinutes
 *
 * @typedef {Object} Route
 * @property {Hop[]} hops
 * @property {number} totalFeePercent   - compounded fee across all hops
 * @property {number} totalEstimatedMinutes
 * @property {number} totalCost         - ranking score (lower is better)
 * @property {number} outputAmount      - amount received after fees, for the given input amount
 */

/**
 * Compounds fee percentages across hops. Two 1% fees compound to
 * ~1.99%, not exactly 2% — this matters at scale and is worth getting right
 * even in Phase 1's mocked version, since Phase 2 swaps in real fee data
 * against this same formula.
 */
function compoundFeePercent(feePercents) {
  const remaining = feePercents.reduce((acc, feePercent) => acc * (1 - feePercent / 100), 1)
  return (1 - remaining) * 100
}

function buildRoute(hops, amount) {
  const totalFeePercent = compoundFeePercent(hops.map((h) => h.feePercent))
  const totalEstimatedMinutes = hops.reduce((sum, h) => sum + h.estimatedMinutes, 0)
  const outputAmount = amount * (1 - totalFeePercent / 100)

  // Ranking score: fee is the dominant factor, time is a tiebreaker.
  // Weighting keeps a 45-minute-cheaper route from losing to a
  // 5-minute-faster-but-pricier one, which matches how a remittance
  // user actually thinks about the tradeoff.
  const totalCost = totalFeePercent * 100 + totalEstimatedMinutes

  return {
    hops,
    totalFeePercent: Number(totalFeePercent.toFixed(4)),
    totalEstimatedMinutes,
    totalCost,
    outputAmount: Number(outputAmount.toFixed(2)),
  }
}

function toHop(anchor) {
  return {
    anchorId: anchor.id,
    anchorName: anchor.name,
    fromCurrency: anchor.fromCurrency,
    toCurrency: anchor.toCurrency,
    feePercent: anchor.feePercent,
    estimatedMinutes: anchor.estimatedMinutes,
  }
}

function amountFitsAnchor(anchor, amount) {
  return amount >= anchor.minAmount && amount <= anchor.maxAmount
}

/**
 * Finds all valid 1-hop and 2-hop routes from fromCurrency to toCurrency,
 * ranked cheapest-first. Returns an empty array (not an error/exception)
 * when no route exists — callers should treat that as a normal, expected
 * outcome, not a failure state.
 *
 * @param {{fromCurrency: string, toCurrency: string, amount: number, anchors: object[]}} params
 * @returns {Route[]}
 */
export function findRoutes({ fromCurrency, toCurrency, amount, anchors }) {
  if (!fromCurrency || !toCurrency) {
    throw new Error('fromCurrency and toCurrency are required')
  }
  if (fromCurrency === toCurrency) {
    throw new Error('fromCurrency and toCurrency must differ')
  }
  if (!(amount > 0)) {
    throw new Error('amount must be a positive number')
  }
  if (!Array.isArray(anchors)) {
    throw new Error('anchors must be an array (received: ' + typeof anchors + ')')
  }

  const routes = []

  // 1-hop: direct anchor matches
  const directAnchors = anchors.filter(
    (a) => a.fromCurrency === fromCurrency && a.toCurrency === toCurrency && amountFitsAnchor(a, amount)
  )
  directAnchors.forEach((a) => routes.push(buildRoute([toHop(a)], amount)))

  // 2-hop: fromCurrency -> X, then X -> toCurrency
  const firstHops = anchors.filter((a) => a.fromCurrency === fromCurrency && amountFitsAnchor(a, amount))
  firstHops.forEach((first) => {
    const intermediateAmount = amount * (1 - first.feePercent / 100)
    const secondHops = anchors.filter(
      (a) =>
        a.fromCurrency === first.toCurrency &&
        a.toCurrency === toCurrency &&
        amountFitsAnchor(a, intermediateAmount)
    )
    secondHops.forEach((second) => {
      routes.push(buildRoute([toHop(first), toHop(second)], amount))
    })
  })

  return routes.sort((a, b) => a.totalCost - b.totalCost)
}
