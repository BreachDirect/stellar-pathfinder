import { useState } from 'react'
import RemittanceForm from './components/RemittanceForm'
import RouteList from './components/RouteList'
import { mockAnchors, availableCurrencies } from './data/mockAnchors'
import { createCachedFindRoutes } from './engine/routingEngine'
import './styles.css'

// Session-scoped cache: repeated identical queries skip recomputation.
const findRoutesCached = createCachedFindRoutes()

export default function App() {
  const [routes, setRoutes] = useState([])
  const [searched, setSearched] = useState(false)
  const [lastQuery, setLastQuery] = useState(null)
  const [engineError, setEngineError] = useState(null)
  const [loading, setLoading] = useState(false)

  const currencies = availableCurrencies()

  async function handleSubmit({ fromCurrency, toCurrency, amount }) {
    if (loading) return
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
