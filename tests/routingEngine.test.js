import { describe, it, expect } from 'vitest'
import { findRoutes, createCachedFindRoutes } from '../src/engine/routingEngine'

const anchors = [
  {
    id: 'a-usd-usdc',
    name: 'A',
    fromCurrency: 'USD',
    toCurrency: 'USDC',
    feePercent: 0.1,
    estimatedMinutes: 5,
    minAmount: 1,
    maxAmount: 100000
  },
  {
    id: 'a-usd-gbp',
    name: 'B',
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    feePercent: 1.8,
    estimatedMinutes: 45,
    minAmount: 10,
    maxAmount: 20000
  },
  {
    id: 'a-usdc-gbp',
    name: 'C',
    fromCurrency: 'USDC',
    toCurrency: 'GBP',
    feePercent: 0.4,
    estimatedMinutes: 20,
    minAmount: 1,
    maxAmount: 50000
  },
  {
    id: 'a-usdc-eur',
    name: 'D',
    fromCurrency: 'USDC',
    toCurrency: 'EUR',
    feePercent: 0.5,
    estimatedMinutes: 15,
    minAmount: 1,
    maxAmount: 50000
  },
  {
    id: 'a-small-only',
    name: 'E',
    fromCurrency: 'USD',
    toCurrency: 'NGN',
    feePercent: 2.0,
    estimatedMinutes: 10,
    minAmount: 1,
    maxAmount: 50
  }
]

describe('findRoutes', () => {
  it('finds a direct 1-hop route', () => {
    const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'USDC', amount: 100, anchors })
    expect(routes.length).toBe(1)
    expect(routes[0].hops.length).toBe(1)
    expect(routes[0].hops[0].anchorId).toBe('a-usd-usdc')
  })

  it('finds a 2-hop route through an intermediate currency', () => {
    const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'EUR', amount: 100, anchors })
    // USD -> USDC -> EUR is the only path (no direct USD->EUR anchor in fixture)
    expect(routes.length).toBe(1)
    expect(routes[0].hops.length).toBe(2)
    expect(routes[0].hops[0].toCurrency).toBe('USDC')
    expect(routes[0].hops[1].toCurrency).toBe('EUR')
  })

  it('ranks a cheaper 2-hop route above a pricier direct route', () => {
    // USD->GBP direct is 1.8% / 45min. USD->USDC->GBP is compounded ~0.5% / 25min.
    // The 2-hop should rank first despite having more hops.
    const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors })
    expect(routes.length).toBe(2)
    expect(routes[0].hops.length).toBe(2) // cheaper 2-hop route ranks #1
    expect(routes[1].hops.length).toBe(1) // pricier direct route ranks #2
    expect(routes[0].totalCost).toBeLessThan(routes[1].totalCost)
  })

  it('returns an empty array (not an error) when no route exists', () => {
    const routes = findRoutes({ fromCurrency: 'GBP', toCurrency: 'NGN', amount: 100, anchors })
    expect(routes).toEqual([])
  })

  it('excludes anchors where the amount falls outside min/max bounds', () => {
    // USD->NGN anchor caps at maxAmount: 50, so a 100-unit request should find nothing
    const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'NGN', amount: 100, anchors })
    expect(routes).toEqual([])

    const withinBounds = findRoutes({ fromCurrency: 'USD', toCurrency: 'NGN', amount: 20, anchors })
    expect(withinBounds.length).toBe(1)
  })

  it('compounds fees across hops rather than summing them', () => {
    const routes = findRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors })
    const twoHop = routes.find((r) => r.hops.length === 2)
    // 0.1% then 0.4% compounded is slightly less than 0.5% flat sum
    expect(twoHop.totalFeePercent).toBeLessThan(0.5)
    expect(twoHop.totalFeePercent).toBeGreaterThan(0.49)
  })

  it('throws a clear error when fromCurrency equals toCurrency', () => {
    expect(() =>
      findRoutes({ fromCurrency: 'USD', toCurrency: 'USD', amount: 100, anchors })
    ).toThrow(/must differ/)
  })

  it('throws a clear error for non-positive amounts', () => {
    expect(() =>
      findRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 0, anchors })
    ).toThrow(/positive/)
  })

  it('throws a clear error when anchors is not an array (e.g. a failed Phase 2 fetch)', () => {
    expect(() =>
      findRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors: undefined })
    ).toThrow(/anchors must be an array/)
  })
})

describe('createCachedFindRoutes', () => {
  it('returns identical results for repeated identical queries', () => {
    const cachedFindRoutes = createCachedFindRoutes()
    const first = cachedFindRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors })
    const second = cachedFindRoutes({
      fromCurrency: 'USD',
      toCurrency: 'GBP',
      amount: 100,
      anchors
    })
    expect(second).toEqual(first)
  })

  it('reuses the cached result instead of recomputing', () => {
    const cachedFindRoutes = createCachedFindRoutes()
    const params = { fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors }
    const first = cachedFindRoutes(params)
    const second = cachedFindRoutes(params)
    // findRoutes returns a fresh array each call, so the same reference
    // proves the second call was served from the cache.
    expect(second).toBe(first)
  })

  it('computes a fresh result for a different query', () => {
    const cachedFindRoutes = createCachedFindRoutes()
    const first = cachedFindRoutes({ fromCurrency: 'USD', toCurrency: 'GBP', amount: 100, anchors })
    const second = cachedFindRoutes({
      fromCurrency: 'USD',
      toCurrency: 'GBP',
      amount: 200,
      anchors
    })
    expect(second).not.toBe(first)
  })
})
