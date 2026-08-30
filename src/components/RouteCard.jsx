import { useState } from 'react'

function buildRouteDetailsText(route) {
  const path = [route.hops[0].fromCurrency, ...route.hops.map((h) => h.toCurrency)].join(' → ')
  const hopLines = route.hops.map(
    (hop, index) =>
      `${index + 1}. ${hop.fromCurrency} → ${hop.toCurrency} via ${hop.anchorName} — ${hop.feePercent}% fee, ~${hop.estimatedMinutes} min`
  )
  return [
    `Route: ${path}`,
    `You receive: ${route.outputAmount}`,
    `Total fee: ${route.totalFeePercent}%`,
    `Est. time: ${route.totalEstimatedMinutes} min`,
    'Hops:',
    ...hopLines
  ].join('\n')
}

function writeClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export default function RouteCard({ route, rank }) {
  const [copied, setCopied] = useState(false)
  const path = [route.hops[0].fromCurrency, ...route.hops.map((h) => h.toCurrency)].join(' → ')

  async function handleCopy() {
    await writeClipboard(buildRouteDetailsText(route))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <li className="route-card">
      <div className="route-card-header">
        <span className="route-rank">#{rank}</span>
        <span className="route-path">{path}</span>
        <button type="button" className="copy-button" onClick={handleCopy} aria-live="polite">
          {copied ? 'Copied!' : 'Copy details'}
        </button>
      </div>

      <div className="route-card-stats">
        <div>
          <span className="stat-label">You receive</span>
          <span className="stat-value">{route.outputAmount}</span>
        </div>
        <div>
          <span className="stat-label">Total fee</span>
          <span className="stat-value">{route.totalFeePercent}%</span>
        </div>
        <div>
          <span className="stat-label">Est. time</span>
          <span className="stat-value">{route.totalEstimatedMinutes} min</span>
        </div>
      </div>

      <details className="route-card-hops">
        <summary>{route.hops.length === 1 ? '1 hop' : `${route.hops.length} hops`}</summary>
        <ul>
          {route.hops.map((hop) => (
            <li key={hop.anchorId}>
              {hop.fromCurrency} → {hop.toCurrency} via <strong>{hop.anchorName}</strong> —{' '}
              {hop.feePercent}% fee, ~{hop.estimatedMinutes} min
            </li>
          ))}
        </ul>
      </details>
    </li>
  )
}
