import { useState } from 'react'

function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(5)
  const [time, setTime] = useState(5)
  const [frequency, setFrequency] = useState(12) // Monthly by default

  // A = P(1 + r/n)^(nt)
  const amount = principal * Math.pow((1 + rate / (100 * frequency)), frequency * time)
  const interest = amount - principal

  const frequencyOptions = {
    1: 'Annually',
    4: 'Quarterly',
    12: 'Monthly',
    365: 'Daily'
  }

  return (
    <div className="calculator-page">
      <h1>Compound Interest Calculator</h1>
      <p className="description">
        A = P(1 + r/n)<sup>nt</sup> where n is compounding frequency
      </p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="principal">
            Principal Amount ($)
            <span className="value">{principal}</span>
          </label>
          <input
            id="principal"
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rate">
            Annual Interest Rate (%)
            <span className="value">{rate}%</span>
          </label>
          <input
            id="rate"
            type="range"
            min="0.1"
            max="30"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">
            Time Period (years)
            <span className="value">{time}</span>
          </label>
          <input
            id="time"
            type="range"
            min="1"
            max="30"
            step="1"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Compounding Frequency</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
          >
            {Object.entries(frequencyOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="results">
        <div className="result-item">
          <span className="label">Principal:</span>
          <span className="amount">${parseFloat(principal).toLocaleString()}</span>
        </div>
        <div className="result-item">
          <span className="label">Interest Earned:</span>
          <span className="amount highlight">${interest.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item total">
          <span className="label">Total Amount:</span>
          <span className="amount">${amount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item info">
          <span className="label">Compounding:</span>
          <span>{frequencyOptions[frequency]}</span>
        </div>
      </div>
    </div>
  )
}

export default CompoundInterest
