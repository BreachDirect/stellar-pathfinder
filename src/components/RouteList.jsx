import RouteCard from './RouteCard'

/**
 * Renders the ranked list of routes returned by the routing engine, or an
 * appropriate empty/no-results state.
 *
 * Renders nothing at all before a search has run (`searched === false`),
 * rather than an empty list, so the UI doesn't imply "no routes exist"
 * before the user has actually searched.
 *
 * @param {Object} props
 * @param {import('../engine/routingEngine').Route[]} props.routes - Ranked routes to display, cheapest-first.
 * @param {boolean} props.searched - Whether a search has been run yet this session.
 */
export default function RouteList({ routes, searched }) {
  if (!searched) {
    return null
  }

  if (routes.length === 0) {
    return (
      <p className="no-routes" role="status">
        No route found for that currency pair and amount. Try a different pair, or check the amount
        fits within anchor limits.
      </p>
    )
  }

  return (
    <ul className="route-list">
      {routes.map((route, index) => (
        <RouteCard key={route.hops.map((h) => h.anchorId).join('-')} route={route} rank={index + 1} />
      ))}
    </ul>
  )
}
