import { useState } from 'react'

function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(7)
  const [loanTenure, setLoanTenure] = useState(20) // in years

  // Convert annual rate to monthly and tenure to months
  const monthlyRate = interestRate / (12 * 100)
  const numberOfPayments = loanTenure * 12

  // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
              (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalAmount = emi * numberOfPayments
  const totalInterest = totalAmount - loanAmount

  return (
    <div className="calculator-page">
      <h1>Loan/EMI Calculator</h1>
      <p className="description">
        Calculate your monthly EMI and total interest on loans
      </p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="loanAmount">
            Loan Amount ($)
            <span className="value">{loanAmount.toLocaleString()}</span>
          </label>
          <input
            id="loanAmount"
            type="range"
            min="10000"
            max="1000000"
            step="5000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">
            Interest Rate (% per year)
            <span className="value">{interestRate}%</span>
          </label>
          <input
            id="interestRate"
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="loanTenure">
            Loan Tenure (years)
            <span className="value">{loanTenure}</span>
          </label>
          <input
            id="loanTenure"
            type="range"
            min="1"
            max="30"
            step="1"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="results">
        <div className="result-item highlight-box">
          <span className="label">Monthly EMI:</span>
          <span className="amount large">${emi.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item">
          <span className="label">Principal Amount:</span>
          <span className="amount">${loanAmount.toLocaleString()}</span>
        </div>
        <div className="result-item">
          <span className="label">Total Interest:</span>
          <span className="amount highlight">${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item total">
          <span className="label">Total Amount Payable:</span>
          <span className="amount">${totalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
        </div>
        <div className="result-item info">
          <span className="label">Number of Payments:</span>
          <span>{numberOfPayments} months</span>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculator
