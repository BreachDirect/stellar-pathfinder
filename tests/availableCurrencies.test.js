import { describe, it, expect } from 'vitest'
import { mockAnchors, availableCurrencies } from '../src/data/mockAnchors'

describe('availableCurrencies', () => {
  it('returns a deduplicated, sorted list of every currency in mockAnchors', () => {
    const expected = [...new Set(mockAnchors.flatMap((a) => [a.fromCurrency, a.toCurrency]))].sort()
    expect(availableCurrencies()).toEqual(expected)
  })

  it('includes every currency appearing as either fromCurrency or toCurrency', () => {
    const currencies = availableCurrencies()
    mockAnchors.forEach((anchor) => {
      expect(currencies).toContain(anchor.fromCurrency)
      expect(currencies).toContain(anchor.toCurrency)
    })
  })

  it('does not duplicate currencies that appear on both sides', () => {
    const currencies = availableCurrencies()
    expect(new Set(currencies).size).toBe(currencies.length)
  })

  it('returns a sorted list', () => {
    const currencies = availableCurrencies()
    expect(currencies).toEqual([...currencies].sort())
  })

  it('matches the exact expected list for the current dataset', () => {
    expect(availableCurrencies()).toEqual(['EUR', 'GBP', 'NGN', 'USD', 'USDC'])
  })
})
