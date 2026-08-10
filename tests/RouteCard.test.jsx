import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import RouteCard from '../src/components/RouteCard'

const route = {
  hops: [
    { anchorId: 'a', anchorName: 'MockAnchor US', fromCurrency: 'USD', toCurrency: 'USDC', feePercent: 0.1, estimatedMinutes: 5 },
    { anchorId: 'b', anchorName: 'MockAnchor UK', fromCurrency: 'USDC', toCurrency: 'GBP', feePercent: 0.4, estimatedMinutes: 20 },
  ],
  totalFeePercent: 0.5,
  totalEstimatedMinutes: 25,
  outputAmount: 99.5,
  totalCost: 75,
}

const expectedText = [
  'Route: USD → USDC → GBP',
  'You receive: 99.5',
  'Total fee: 0.5%',
  'Est. time: 25 min',
  'Hops:',
  '1. USD → USDC via MockAnchor US — 0.1% fee, ~5 min',
  '2. USDC → GBP via MockAnchor UK — 0.4% fee, ~20 min',
].join('\n')

function setup() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(<RouteCard route={route} rank={1} />)
  })
  return { container, root }
}

function cleanup(root) {
  act(() => {
    root.unmount()
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  vi.useRealTimers()
  globalThis.IS_REACT_ACT_ENVIRONMENT = false
  delete navigator.clipboard
  document.body.innerHTML = ''
})

describe('RouteCard', () => {
  it('renders the route path, fee, and time', () => {
    const { container, root } = setup()
    expect(container.textContent).toContain('USD → USDC → GBP')
    expect(container.textContent).toContain('0.5%')
    expect(container.textContent).toContain('25 min')
    cleanup(root)
  })

  it('copies route details as plain text and shows a confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const { container, root } = setup()
    const button = container.querySelector('.copy-button')

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText.mock.calls[0][0]).toBe(expectedText)
    expect(button.textContent).toBe('Copied!')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(button.textContent).toBe('Copy details')
    cleanup(root)
  })

  it('falls back to execCommand when the Clipboard API is unavailable', async () => {
    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand
    const { container, root } = setup()
    const button = container.querySelector('.copy-button')

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(button.textContent).toBe('Copied!')
    cleanup(root)
  })
})
