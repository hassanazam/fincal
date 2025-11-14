import { useState, useEffect, useMemo } from 'react'
import stocksData from '../data/stocks.json'
import taxRatesData from '../data/taxRates.json'

function DividendCalculator() {
  // State management
  const [investmentAmount, setInvestmentAmount] = useState(100000)
  const [investmentInput, setInvestmentInput] = useState('100000')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [selectedSector, setSelectedSector] = useState('All Sectors')
  const [sortBy, setSortBy] = useState('Highest Dividend Yield')
  const [expandedCards, setExpandedCards] = useState(new Set())
  const [stocks] = useState(stocksData)
  const [taxRates] = useState(taxRatesData)

  // Update slider when input changes
  useEffect(() => {
    const amount = parseFloat(investmentInput)
    if (!isNaN(amount) && amount >= 10000 && amount <= 10000000000) {
      setInvestmentAmount(amount)
    }
  }, [investmentInput])

  // Update input when slider changes
  const handleSliderChange = (e) => {
    const value = e.target.value
    setInvestmentAmount(parseFloat(value))
    setInvestmentInput(value)
  }

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/,/g, '')
    setInvestmentInput(value)
  }

  // Get unique countries and sectors from stocks
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(stocks.map(stock => stock.country))]
    return ['All Countries', ...uniqueCountries.sort()]
  }, [stocks])

  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(stocks.map(stock => stock.sector))]
    return ['All Sectors', ...uniqueSectors.sort()]
  }, [stocks])

  // Calculate dividend values for a stock
  const calculateDividends = (stock) => {
    const sharesOwned = investmentAmount / stock.currentPrice
    const annualBeforeTax = sharesOwned * stock.dividend.annualPayoutTTM
    const monthlyBeforeTax = annualBeforeTax / 12
    const quarterlyBeforeTax = annualBeforeTax / 4

    const taxRate = taxRates[stock.country]?.default || 0
    const taxMultiplier = 1 - (taxRate / 100)

    return {
      sharesOwned,
      monthlyBeforeTax,
      monthlyAfterTax: monthlyBeforeTax * taxMultiplier,
      quarterlyBeforeTax,
      quarterlyAfterTax: quarterlyBeforeTax * taxMultiplier,
      annualBeforeTax,
      annualAfterTax: annualBeforeTax * taxMultiplier,
      taxRate
    }
  }

  // Filter and sort stocks
  const displayedStocks = useMemo(() => {
    let filtered = stocks

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(stock =>
        stock.ticker.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      )
    }

    // Country filter
    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(stock => stock.country === selectedCountry)
    }

    // Sector filter
    if (selectedSector !== 'All Sectors') {
      filtered = filtered.filter(stock => stock.sector === selectedSector)
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Highest Dividend Yield':
          return b.dividend.yieldTTM - a.dividend.yieldTTM
        case 'Highest Monthly Payout': {
          const aMonthly = calculateDividends(a).monthlyBeforeTax
          const bMonthly = calculateDividends(b).monthlyBeforeTax
          return bMonthly - aMonthly
        }
        case 'Highest Annual Payout': {
          const aAnnual = calculateDividends(a).annualBeforeTax
          const bAnnual = calculateDividends(b).annualBeforeTax
          return bAnnual - aAnnual
        }
        case 'Stock Name (A-Z)':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return sorted
  }, [stocks, searchQuery, selectedCountry, selectedSector, sortBy, investmentAmount])

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${Math.round(amount).toLocaleString('en-PK')}`
  }

  // Toggle card expansion
  const toggleCard = (ticker) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ticker)) {
        newSet.delete(ticker)
      } else {
        newSet.add(ticker)
      }
      return newSet
    })
  }

  return (
    <div className="calculator-page dividend-calculator">
      <h1>Dividend Calculator</h1>
      <p className="description">
        Compare dividend payouts across multiple stocks. Enter your investment amount and see potential monthly, quarterly, and annual income.
      </p>

      {/* Investment Amount Input */}
      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="investment">
            Investment Amount
            <span className="value">{formatCurrency(investmentAmount)}</span>
          </label>
          <input
            id="investment"
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={investmentAmount}
            onChange={handleSliderChange}
          />
          <div className="range-labels">
            <span>PKR 10,000</span>
            <span>PKR 1 Crore</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="investment-input">Or enter amount manually:</label>
          <div className="input-with-currency">
            <input
              id="investment-input"
              type="text"
              className="text-input"
              value={investmentInput}
              onChange={handleInputChange}
              placeholder="100000"
            />
            <span className="currency-label">PKR</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by ticker or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Country:</label>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sector:</label>
            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Highest Dividend Yield</option>
              <option>Highest Monthly Payout</option>
              <option>Highest Annual Payout</option>
              <option>Stock Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {displayedStocks.length} stock{displayedStocks.length !== 1 ? 's' : ''}
      </div>

      {/* Stock Cards Grid */}
      <div className="dividend-grid">
        {displayedStocks.length === 0 ? (
          <div className="no-results">
            <p>No stocks found matching your criteria.</p>
            <p className="small">Try adjusting your search or filters.</p>
          </div>
        ) : (
          displayedStocks.map(stock => {
            const dividends = calculateDividends(stock)
            const isExpanded = expandedCards.has(stock.ticker)

            return (
              <div key={stock.ticker} className={`dividend-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Compact View */}
                <div className="card-header">
                  <h3>{stock.name}</h3>
                  <span className="ticker">{stock.ticker}</span>
                </div>

                <div className="card-yield">
                  <span className="yield-label">Dividend Yield:</span>
                  <span className="yield-value">{stock.dividend.yieldTTM.toFixed(2)}%</span>
                </div>

                <div className="card-monthly">
                  <span className="monthly-label">You receive monthly:</span>
                  <span className="monthly-value">{formatCurrency(dividends.monthlyBeforeTax)}</span>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="card-expanded">
                    <div className="card-details">
                      <p className="stock-meta">
                        {stock.sector} • {stock.exchange} • {stock.country}
                      </p>
                      <p className="yield-comparison">
                        Yield TTM: {stock.dividend.yieldTTM.toFixed(2)}% | Last Year: {stock.dividend.yieldLastYear.toFixed(2)}%
                      </p>
                    </div>

                    <div className="dividend-breakdown">
                      <h4>Your Dividend Income:</h4>

                      <div className="breakdown-section">
                        <div className="period-label">Monthly:</div>
                        <div className="amounts">
                          <div className="amount-row">
                            <span>Before Tax:</span>
                            <span className="amount">{formatCurrency(dividends.monthlyBeforeTax)}</span>
                          </div>
                          <div className="amount-row after-tax">
                            <span>After Tax:</span>
                            <span className="amount">{formatCurrency(dividends.monthlyAfterTax)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="breakdown-section">
                        <div className="period-label">Quarterly:</div>
                        <div className="amounts">
                          <div className="amount-row">
                            <span>Before Tax:</span>
                            <span className="amount">{formatCurrency(dividends.quarterlyBeforeTax)}</span>
                          </div>
                          <div className="amount-row after-tax">
                            <span>After Tax:</span>
                            <span className="amount">{formatCurrency(dividends.quarterlyAfterTax)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="breakdown-section">
                        <div className="period-label">Annually:</div>
                        <div className="amounts">
                          <div className="amount-row">
                            <span>Before Tax:</span>
                            <span className="amount">{formatCurrency(dividends.annualBeforeTax)}</span>
                          </div>
                          <div className="amount-row after-tax">
                            <span>After Tax:</span>
                            <span className="amount">{formatCurrency(dividends.annualAfterTax)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="tax-info">
                        Tax Rate: {dividends.taxRate}% ({stock.country})
                      </div>
                    </div>
                  </div>
                )}

                {/* Toggle Button */}
                <button
                  className="toggle-btn"
                  onClick={() => toggleCard(stock.ticker)}
                >
                  {isExpanded ? 'Show Less ▲' : 'See More ▼'}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DividendCalculator
