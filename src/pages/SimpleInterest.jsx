import { useState } from 'react'

function SimpleInterest() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(5)
  const [time, setTime] = useState(1)

  const interest = (principal * rate * time) / 100
  const totalAmount = parseFloat(principal) + interest

  return (
    <div className="calculator-page">
      <h1>Simple Interest Calculator</h1>
      <p className="description">
        Simple Interest = (Principal × Rate × Time) / 100
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
            Interest Rate (% per year)
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
      </div>

      <div className="results">
        <div className="result-item">
          <span className="label">Principal:</span>
          <span className="amount">${parseFloat(principal).toLocaleString()}</span>
        </div>
        <div className="result-item">
          <span className="label">Interest:</span>
          <span className="amount highlight">${interest.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item total">
          <span className="label">Total Amount:</span>
          <span className="amount">${totalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
      </div>
    </div>
  )
}

export default SimpleInterest
