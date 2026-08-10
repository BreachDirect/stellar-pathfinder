import RouteCard from './RouteCard'
import { findRoutes } from '../engine/routingEngine'
import { mockAnchors } from '../data/mockAnchors'

// Real routes from the routing engine over the mock anchor dataset, so the
// stories always show the same data shapes RouteCard renders in the app.
const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 1000, anchors: mockAnchors })

const twoHopRoute = routes.find((r) => r.hops.length === 2) ?? routes[0]

export default {
  title: 'Components/RouteCard',
  component: RouteCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => <ul className="route-list">{Story()}</ul>,
  ],
  args: {
    route: routes[0],
    rank: 1,
  },
  argTypes: {
    route: { control: false },
    rank: { control: { type: 'number', min: 1 } },
  },
}

export const Default = {}

export const DirectRoute = {
  args: { route: routes[0] },
}

export const TwoHopRoute = {
  name: 'Two-hop route',
  args: { route: twoHopRoute, rank: 2 },
}
