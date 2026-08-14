import RouteList from './RouteList'
import { findRoutes } from '../engine/routingEngine'
import { mockAnchors } from '../data/mockAnchors'

const routes = findRoutes({
  fromCurrency: 'USD',
  toCurrency: 'GBP',
  amount: 1000,
  anchors: mockAnchors
})

export default {
  title: 'Components/RouteList',
  component: RouteList,
  tags: ['autodocs'],
  args: {
    routes,
    searched: true
  },
  argTypes: {
    routes: { control: false },
    searched: { control: { type: 'boolean' } }
  }
}

export const WithRoutes = {}

export const NoResults = {
  name: 'No results (searched)',
  args: { routes: [], searched: true }
}

export const NotSearched = {
  name: 'Not searched yet',
  args: { routes: [], searched: false }
}
