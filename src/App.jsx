import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import SimpleInterest from './pages/SimpleInterest'
import CompoundInterest from './pages/CompoundInterest'
import LoanCalculator from './pages/LoanCalculator'
import DividendCalculator from './pages/DividendCalculator'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          💰 FinCalc
        </Link>
        <div className="nav-links">
          <Link to="/simple-interest" className={location.pathname === '/simple-interest' ? 'active' : ''}>
            Simple Interest
          </Link>
          <Link to="/compound-interest" className={location.pathname === '/compound-interest' ? 'active' : ''}>
            Compound Interest
          </Link>
          <Link to="/loan-calculator" className={location.pathname === '/loan-calculator' ? 'active' : ''}>
            Loan Calculator
          </Link>
          <Link to="/dividend-calculator" className={location.pathname === '/dividend-calculator' ? 'active' : ''}>
            Dividend Calculator
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simple-interest" element={<SimpleInterest />} />
          <Route path="/compound-interest" element={<CompoundInterest />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/dividend-calculator" element={<DividendCalculator />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>FinCalc - Your Financial Calculator Companion</p>
        <p className="small">Built with React + Vite, hosted on GitHub Pages</p>
      </footer>
    </div>
  )
}

export default App
