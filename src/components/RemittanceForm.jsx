import { useState } from 'react'

/**
 * Currency-pair + amount input. Currencies are populated from whatever
 * data source is passed in (mock in Phase 1, live in Phase 2) — this
 * component never hardcodes a currency list.
 *
 * @param {Object} props
 * @param {string[]} props.currencies - Available currency codes to populate both selects.
 * @param {(query: { fromCurrency: string, toCurrency: string, amount: number }) => void} props.onSubmit
 *   Called with a validated query once the form passes its own client-side
 *   checks (both currencies selected, currencies differ, amount > 0).
 */
export default function RemittanceForm({ currencies, onSubmit }) {
  const [fromCurrency, setFromCurrency] = useState(currencies[0] ?? '')
  const [toCurrency, setToCurrency] = useState(currencies[1] ?? '')
  const [amount, setAmount] = useState('100')
  const [error, setError] = useState(null)

  // Swaps the two selected currencies in place, so a user correcting a
  // reversed pair doesn't have to re-select both dropdowns.
  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const numericAmount = Number(amount)
    if (!fromCurrency || !toCurrency) {
      setError('Please select both currencies.')
      return
    }
    if (fromCurrency === toCurrency) {
      setError('Source and destination currencies must be different.')
      return
    }
    if (!(numericAmount > 0)) {
      setError('Enter an amount greater than 0.')
      return
    }

    onSubmit({ fromCurrency, toCurrency, amount: numericAmount })
  }

  return (
    <form className="remittance-form" onSubmit={handleSubmit}>
      <div className="currency-fields">
        <div className="field">
          <label htmlFor="fromCurrency">From</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="swap-button"
          onClick={handleSwap}
          aria-label="Swap source and destination currency"
          title="Swap source and destination"
        >
          ⇄
        </button>

        <div className="field">
          <label htmlFor="toCurrency">To</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit">Find routes</button>
    </form>
  )
}
