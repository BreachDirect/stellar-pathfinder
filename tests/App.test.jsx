import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'

function setup() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  act(() => {
    root.render(<App />)
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
  document.body.innerHTML = ''
})

describe('App loading state', () => {
  it('shows a loading indicator while routes are being calculated, then results', async () => {
    const { container, root } = setup()
    const form = container.querySelector('.remittance-form')

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      await Promise.resolve()
    })

    expect(container.querySelector('.loading')).toBeTruthy()
    expect(container.querySelector('.loading').textContent).toContain('Finding routes')

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(container.querySelector('.loading')).toBeFalsy()
    cleanup(root)
  })
})
