import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h1>FinCalc - Financial Calculator</h1>
      <p className="subtitle">Your comprehensive financial calculation toolkit</p>

      <div className="calculator-grid">
        <Link to="/simple-interest" className="calculator-card">
          <h2>💰 Simple Interest</h2>
          <p>Calculate simple interest on your principal amount</p>
        </Link>

        <Link to="/compound-interest" className="calculator-card">
          <h2>📈 Compound Interest</h2>
          <p>See how your money grows with compounding</p>
        </Link>

        <Link to="/loan-calculator" className="calculator-card">
          <h2>🏠 Loan Calculator</h2>
          <p>Calculate EMI and total interest on loans</p>
        </Link>
      </div>

      <div className="features">
        <h3>Features</h3>
        <ul>
          <li>Easy-to-use interface</li>
          <li>Real-time calculations</li>
          <li>Multiple financial calculators</li>
          <li>Mobile-friendly design</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
