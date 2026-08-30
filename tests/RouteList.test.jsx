import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import RouteList from '../src/components/RouteList'

const routes = [
  {
    hops: [
      {
        anchorId: 'a',
        anchorName: 'MockAnchor US',
        fromCurrency: 'USD',
        toCurrency: 'USDC',
        feePercent: 0.1,
        estimatedMinutes: 5
      }
    ],
    totalFeePercent: 0.1,
    totalEstimatedMinutes: 5,
    outputAmount: 99.9,
    totalCost: 15
  },
  {
    hops: [
      {
        anchorId: 'b',
        anchorName: 'MockAnchor UK',
        fromCurrency: 'USDC',
        toCurrency: 'GBP',
        feePercent: 0.4,
        estimatedMinutes: 20
      }
    ],
    totalFeePercent: 0.4,
    totalEstimatedMinutes: 20,
    outputAmount: 99.6,
    totalCost: 60
  }
]

function setup({ searched, routes: list }) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(<RouteList searched={searched} routes={list} />)
  })
  return { container, root }
}

function cleanup(root) {
  act(() => {
    root.unmount()
  })
}

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = false
  document.body.innerHTML = ''
})

describe('RouteList', () => {
  it('renders nothing when not searched', () => {
    const { container, root } = setup({ searched: false, routes: [] })
    expect(container.textContent).toBe('')
    cleanup(root)
  })

  it('shows a no-route message when searched with no results', () => {
    const { container, root } = setup({ searched: true, routes: [] })
    expect(container.textContent).toContain('No route found for that currency pair and amount.')
    cleanup(root)
  })

  it('renders a card for each route when populated', () => {
    const { container, root } = setup({ searched: true, routes })
    const cards = container.querySelectorAll('.route-card')
    expect(cards.length).toBe(2)
    expect(container.textContent).toContain('USD → USDC')
    expect(container.textContent).toContain('USDC → GBP')
    cleanup(root)
  })
})
