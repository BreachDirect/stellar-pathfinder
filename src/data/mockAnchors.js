// Mock Stellar Anchor dataset. Shape mirrors the fields a real SEP-24/SEP-31
// info endpoint provides (fee_percent, min/max amount) so Phase 2 can swap
// this module out for a live-fetched array without changing routingEngine.js
// or any component.

export const mockAnchors = [
  // Direct routes
  {
    id: 'anchor-usd-usdc',
    name: 'MockAnchor US',
    fromCurrency: 'USD',
    toCurrency: 'USDC',
    feePercent: 0.1,
    estimatedMinutes: 5,
    minAmount: 1,
    maxAmount: 100000,
  },
  {
    id: 'anchor-usd-gbp-direct',
    name: 'MockAnchor Direct FX',
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    feePercent: 1.8,
    estimatedMinutes: 45,
    minAmount: 10,
    maxAmount: 20000,
  },
  // Second hops (used to build 2-hop routes)
  {
    id: 'anchor-usdc-eur',
    name: 'MockAnchor EU',
    fromCurrency: 'USDC',
    toCurrency: 'EUR',
    feePercent: 0.5,
    estimatedMinutes: 15,
    minAmount: 1,
    maxAmount: 50000,
  },
  {
    id: 'anchor-usdc-gbp',
    name: 'MockAnchor UK',
    fromCurrency: 'USDC',
    toCurrency: 'GBP',
    feePercent: 0.4,
    estimatedMinutes: 20,
    minAmount: 1,
    maxAmount: 50000,
  },
  {
    id: 'anchor-usdc-ngn',
    name: 'MockAnchor Naija',
    fromCurrency: 'USDC',
    toCurrency: 'NGN',
    feePercent: 0.8,
    estimatedMinutes: 10,
    minAmount: 1,
    maxAmount: 30000,
  },
  {
    id: 'anchor-eur-ngn',
    name: 'MockAnchor EU-NG Bridge',
    fromCurrency: 'EUR',
    toCurrency: 'NGN',
    feePercent: 1.2,
    estimatedMinutes: 30,
    minAmount: 5,
    maxAmount: 25000,
  },
]

export const availableCurrencies = () => {
  const set = new Set()
  mockAnchors.forEach((a) => {
    set.add(a.fromCurrency)
    set.add(a.toCurrency)
  })
  return Array.from(set).sort()
}
