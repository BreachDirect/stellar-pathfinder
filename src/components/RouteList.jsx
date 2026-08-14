import RouteCard from './RouteCard'

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
        <RouteCard
          key={route.hops.map((h) => h.anchorId).join('-')}
          route={route}
          rank={index + 1}
        />
      ))}
    </ul>
  )
}
