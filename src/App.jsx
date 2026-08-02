import { useState } from 'react'
import RemittanceForm from './components/RemittanceForm'
import RouteList from './components/RouteList'
import { mockAnchors, availableCurrencies } from './data/mockAnchors'
import { findRoutes } from './engine/routingEngine'
import './styles.css'

export default function App() {
  const [routes, setRoutes] = useState([])
  const [searched, setSearched] = useState(false)
  const [lastQuery, setLastQuery] = useState(null)
  const [engineError, setEngineError] = useState(null)

  const currencies = availableCurrencies()

  function handleSubmit({ fromCurrency, toCurrency, amount }) {
    setEngineError(null)
    try {
      const found = findRoutes({ fromCurrency, toCurrency, amount, anchors: mockAnchors })
      setRoutes(found)
      setLastQuery({ fromCurrency, toCurrency, amount })
      setSearched(true)
    } catch (err) {
      setEngineError(err.message)
      setSearched(false)
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

        <RouteList routes={routes} searched={searched} />
      </main>

      <footer>
        <p>Phase 1 — mocked anchor data. Live Horizon/Anchor integration lands in Phase 2.</p>
      </footer>
    </div>
  )
}
