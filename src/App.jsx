import { useState } from 'react'
import RemittanceForm from './components/RemittanceForm'
import RouteList from './components/RouteList'
import { mockAnchors, availableCurrencies } from './data/mockAnchors'
import { createCachedFindRoutes } from './engine/routingEngine'
import './styles.css'

// Session-scoped cache: repeated identical queries skip recomputation.
const findRoutesCached = createCachedFindRoutes()

/**
 * Root component. Owns all query/results state and wires the form to the
 * routing engine to the results list — the routing engine itself has no
 * React dependency (see routingEngine.js), so all state management lives
 * here rather than in a hook.
 *
 * Phase 1 passes the mocked `mockAnchors` dataset into the engine on every
 * search; Phase 2 replaces that with live-fetched anchor data at this same
 * call site, without needing to change the engine.
 */
export default function App() {
  const [routes, setRoutes] = useState([])
  const [searched, setSearched] = useState(false)
  const [lastQuery, setLastQuery] = useState(null)
  const [engineError, setEngineError] = useState(null)
  const [loading, setLoading] = useState(false)

  const currencies = availableCurrencies()

  /**
   * Runs the routing engine for the submitted query and updates all
   * derived state. Routing-engine errors (e.g. an invalid `anchors`
   * argument) are caught here and surfaced as a form-level error rather
   * than crashing the app.
   *
   * @param {Object} query
   * @param {string} query.fromCurrency
   * @param {string} query.toCurrency
   * @param {number} query.amount
   */
  function handleSubmit({ fromCurrency, toCurrency, amount }) {
    setEngineError(null)
    setSearched(false)
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const found = findRoutesCached({ fromCurrency, toCurrency, amount, anchors: mockAnchors })
      setRoutes(found)
      setLastQuery({ fromCurrency, toCurrency, amount })
      setSearched(true)
    } catch (err) {
      setEngineError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Stellar Pathfinder</h1>
        <p className="tagline">Compare cross-border routes across Stellar anchors.</p>
      </header>

      <main>
        <RemittanceForm currencies={currencies} onSubmit={handleSubmit} />

        {engineError && (
          <p className="form-error" role="alert">
            {engineError}
          </p>
        )}

        {searched && lastQuery && (
          <p className="query-summary">
            Routes for {lastQuery.amount} {lastQuery.fromCurrency} → {lastQuery.toCurrency}
          </p>
        )}

        {loading ? (
          <div className="loading" role="status">
            <span className="spinner" aria-hidden="true" />
            Finding routes…
          </div>
        ) : (
          <RouteList routes={routes} searched={searched} />
        )}
      </main>

      <footer>
        <p>Phase 1 — mocked anchor data. Live Horizon/Anchor integration lands in Phase 2.</p>
      </footer>
    </div>
  )
}
