/**
 * Displays a single ranked route: its currency path, headline stats
 * (output amount, total fee, estimated time), and an expandable per-hop
 * breakdown.
 *
 * Note: `route.totalCost` (the engine's internal ranking score) is
 * deliberately not displayed here — it's not a monetary amount, only a
 * sort key used to order the route list.
 *
 * @param {Object} props
 * @param {import('../engine/routingEngine').Route} props.route - The route to display.
 * @param {number} props.rank - This route's 1-based position in the ranked list, for display (e.g. "#1").
 */
export default function RouteCard({ route, rank }) {
  const path = [route.hops[0].fromCurrency, ...route.hops.map((h) => h.toCurrency)].join(' → ')

  return (
    <li className="route-card">
      <div className="route-card-header">
        <span className="route-rank">#{rank}</span>
        <span className="route-path">{path}</span>
      </div>

      <div className="route-card-stats">
        <div>
          <span className="stat-label">You receive</span>
          <span className="stat-value">{route.outputAmount}</span>
        </div>
        <div>
          <span className="stat-label">Total fee</span>
          <span className="stat-value">{route.totalFeePercent}%</span>
        </div>
        <div>
          <span className="stat-label">Est. time</span>
          <span className="stat-value">{route.totalEstimatedMinutes} min</span>
        </div>
      </div>

      <details className="route-card-hops">
        <summary>{route.hops.length === 1 ? '1 hop' : `${route.hops.length} hops`}</summary>
        <ul>
          {route.hops.map((hop) => (
            <li key={hop.anchorId}>
              {hop.fromCurrency} → {hop.toCurrency} via <strong>{hop.anchorName}</strong> — {hop.feePercent}%
              fee, ~{hop.estimatedMinutes} min
            </li>
          ))}
        </ul>
      </details>
    </li>
  )
}
