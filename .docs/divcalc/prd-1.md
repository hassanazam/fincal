# Dividend Calculator - Product Requirements Document (PRD v1)

**Project:** FinCal - Financial Utilities
**Feature:** Dividend Calculator (Grid-Based Comparison Tool)
**Version:** 1.0
**Date:** 2025-01-14
**Status:** Requirements Finalized

---

## Table of Contents
1. [Overview](#overview)
2. [Goals & Objectives](#goals--objectives)
3. [User Personas](#user-personas)
4. [Core Functionality](#core-functionality)
5. [User Flow](#user-flow)
6. [Data Structure](#data-structure)
7. [UI/UX Specifications](#uiux-specifications)
8. [Technical Requirements](#technical-requirements)
9. [Implementation Phases](#implementation-phases)
10. [Future Enhancements](#future-enhancements)

---

## Overview

The Dividend Calculator is a **grid-based comparison tool** that allows users to compare dividend payouts across multiple stocks based on their investment amount. Unlike traditional single-stock calculators, this tool displays all available dividend stocks in a card grid, enabling users to make informed investment decisions by comparing potential monthly, quarterly, and annual dividend income.

### Key Differentiator
Instead of calculating dividends for one stock at a time, users enter their investment amount once and see potential dividend income across **all 20 PSXDIV20 stocks simultaneously** in an easy-to-compare grid format.

---

## Goals & Objectives

### Primary Goals
1. **Simplify dividend comparison** - Enable users to compare dividend yields and payouts across multiple stocks at a glance
2. **User-centric calculations** - Focus on "what you receive" rather than technical financial jargon
3. **Accurate tax calculations** - Show realistic after-tax dividend income using country-specific tax rates
4. **Mobile-first design** - Ensure excellent UX on mobile devices using card-based layouts

### Success Metrics
- Users can compare 20+ stocks within 30 seconds
- Clear understanding of monthly, quarterly, and annual dividend income
- Easy discovery of high-yield dividend stocks through sorting/filtering

---

## User Personas

### Primary Persona: Pakistani Retail Investor
- **Age:** 25-45
- **Location:** Pakistan
- **Investment Knowledge:** Beginner to Intermediate
- **Goal:** Build passive income through dividend stocks
- **Pain Point:** Difficulty comparing dividend yields across PSX stocks
- **Currency:** Pakistani Rupees (PKR)

### Secondary Persona: International Investor
- **Future consideration** - Multi-currency support for USD, CAD, GBP stocks
- **Phase 1:** Focus exclusively on PSX stocks in PKR

---

## Core Functionality

### Input Controls
1. **Investment Amount**
   - Default: **100,000 PKR**
   - Range: **10,000 PKR to 10,000,000,000 PKR** (Rs 10k to Rs 100 crore)
   - Input Methods: Both range slider AND text input
   - Real-time updates to all calculations when amount changes

2. **Search Bar**
   - Search stocks by **ticker** (e.g., "OGDC") OR **company name** (e.g., "Oil & Gas")
   - Instant filtering of card grid as user types
   - Display format: "Oil & Gas Development Company Limited (OGDC)"

3. **Filters** (Single-select dropdowns)
   - **Country Filter:** "All Countries", "Pakistan", "USA", etc.
   - **Sector Filter:** "All Sectors", "Oil & Gas", "Banking", "Cement", etc.

4. **Sort By** (Single-select dropdown)
   - Highest Dividend Yield (TTM) - **Default**
   - Highest Monthly Payout
   - Highest Annual Payout
   - Stock Name (A-Z)

### Output Display
Each stock shown as a **card** with two states:

#### Compact View (Default)
- Stock name and ticker
- Dividend yield (TTM)
- **Monthly payout (before tax)** - primary focus
- "See More" button to expand

#### Expanded View (On Click)
- Full company details (sector, exchange, country)
- Dividend yield TTM and last year (for comparison)
- **Monthly, Quarterly, and Annual payouts** with:
  - Before-tax amount
  - After-tax amount
- Tax rate used (country-specific default)
- "Show Less" button to collapse

---

## User Flow

### Step-by-Step Interaction

```
1. User lands on Dividend Calculator page
   ↓
2. Page displays default state:
   - Investment Amount: 100,000 PKR
   - All 20 PSXDIV20 stocks shown in grid
   - Sorted by Highest Dividend Yield
   ↓
3. User adjusts investment amount (slider or input)
   → All cards update calculations in real-time
   ↓
4. User applies filters/search (optional)
   - Filter by sector: "Banking"
   - Search: "MCB"
   → Grid shows only matching stocks
   ↓
5. User browses compact cards
   - Sees monthly payout at a glance
   - Compares yields across stocks
   ↓
6. User clicks "See More" on interested stock
   → Card expands to show full breakdown
   → Monthly/Quarterly/Annual + tax details
   ↓
7. User makes investment decision
   → Identified high-yield stocks for their investment amount
```

---

## Data Structure

### 1. Stocks Data (`src/data/stocks.json`)

**Structure:**
```json
[
  {
    "ticker": "OGDC",
    "name": "Oil & Gas Development Company Limited",
    "exchange": "PSX",
    "country": "Pakistan",
    "currency": "PKR",
    "sector": "Oil & Gas",
    "currentPrice": 85.50,
    "dividend": {
      "yieldTTM": 12.50,
      "yieldLastYear": 11.80,
      "annualPayoutTTM": 10.70,
      "frequency": "annual"
    },
    "lastUpdated": "2025-01-15T14:30:00Z"
  }
]
```

**Field Definitions:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ticker` | String | Stock ticker symbol | "OGDC" |
| `name` | String | Full company name | "Oil & Gas Development Company Limited" |
| `exchange` | String | Stock exchange code | "PSX", "NASDAQ", "NYSE" |
| `country` | String | Country of incorporation | "Pakistan", "USA", "Canada" |
| `currency` | String | Stock's trading currency | "PKR", "USD", "CAD" |
| `sector` | String | Industry sector | "Oil & Gas", "Banking", "Technology" |
| `currentPrice` | Number | Current stock price per share | 85.50 |
| `dividend.yieldTTM` | Number | Dividend yield % (Trailing Twelve Months) | 12.50 (represents 12.50%) |
| `dividend.yieldLastYear` | Number | Previous year's dividend yield % | 11.80 |
| `dividend.annualPayoutTTM` | Number | Annual dividend per share (currency units) | 10.70 (PKR per share) |
| `dividend.frequency` | String | Dividend payment frequency | "annual", "quarterly", "semi-annual", "monthly" |
| `lastUpdated` | String (ISO 8601) | Data timestamp | "2025-01-15T14:30:00Z" |

**Data Requirements for Phase 1:**
- **20 PSXDIV20 stocks** (Pakistan Stock Exchange Dividend Index)
- Data must be scraped from accurate, reliable sources
- All stocks in PKR currency
- Must include current market data (price, yield TTM, last year yield)

---

### 2. Tax Rates Data (`src/data/taxRates.json`)

**Structure:**
```json
{
  "Pakistan": {
    "default": 15,
    "description": "Standard dividend tax rate"
  },
  "USA": {
    "default": 15,
    "description": "Qualified dividends federal tax"
  },
  "Canada": {
    "default": 25,
    "description": "Average marginal tax rate on dividends"
  },
  "UK": {
    "default": 8.75,
    "description": "Basic rate dividend tax"
  }
}
```

**Field Definitions:**

| Field | Type | Description |
|-------|------|-------------|
| Country Key | String | Country name matching `stocks.json` country field |
| `default` | Number | Default tax rate percentage (e.g., 15 = 15%) |
| `description` | String | Human-readable description of tax rate |

**Behavior:**
- Tax rate is **automatically selected** based on stock's country
- User can **override** tax rate manually (future enhancement)
- Applied to calculate "After Tax" dividend amounts

---

### 3. Exchange Rates Data (`src/data/exchangeRates.json`)

**Structure:**
```json
{
  "baseCurrency": "USD",
  "rates": {
    "PKR": 278.50,
    "USD": 1.00,
    "CAD": 1.35,
    "GBP": 0.79,
    "EUR": 0.92,
    "INR": 83.20
  },
  "lastUpdated": "2025-01-15T14:30:00Z"
}
```

**Field Definitions:**

| Field | Type | Description |
|-------|------|-------------|
| `baseCurrency` | String | Reference currency for rates | "USD" |
| `rates` | Object | Currency code → exchange rate mapping |
| `rates.PKR` | Number | PKR per 1 USD | 278.50 |
| `lastUpdated` | String (ISO 8601) | Exchange rate timestamp |

**Phase 1 Usage:**
- **NOT actively used** in Phase 1 (PKR only)
- Structure defined for **future multi-currency support**
- Will enable users to select investment currency (USD, CAD, etc.)

---

## UI/UX Specifications

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  DIVIDEND CALCULATOR                                    │
│  ───────────────────────────────────────────────────── │
│                                                         │
│  💵 Investment Amount                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │ [============●══════════] 100,000               │    │
│  │ PKR 10,000 ←──────────────────────→ 100 Crore  │    │
│  └────────────────────────────────────────────────┘    │
│  ┌─────────────┐                                       │
│  │  100,000    │ PKR                                    │
│  └─────────────┘                                       │
│                                                         │
│  🔍 Search stocks                                       │
│  ┌────────────────────────────────────────────────┐    │
│  │ Search by name or ticker...                    │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Filters:                                               │
│  ┌─────────────────┐  ┌─────────────────┐             │
│  │ All Countries ▼ │  │ All Sectors   ▼ │             │
│  └─────────────────┘  └─────────────────┘             │
│                                                         │
│  Sort by:                                               │
│  ┌──────────────────────────┐                          │
│  │ Highest Dividend Yield ▼ │                          │
│  └──────────────────────────┘                          │
│                                                         │
│  ═══════════════════════════════════════════════════  │
│                                                         │
│  📊 Showing 20 stocks                                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Card 1  │  │  Card 2  │  │  Card 3  │             │
│  │          │  │          │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Card 4  │  │  Card 5  │  │  Card 6  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Card Design Specifications

#### Compact Card (Default State)

```
┌────────────────────────────────────────┐
│ 🏢 Oil & Gas Development Co. (OGDC)   │
│ 📈 Div Yield: 12.50%                   │
│                                        │
│ 💰 You receive monthly:                │
│    PKR 10,625                          │
│                                        │
│          [See More ▼]                  │
└────────────────────────────────────────┘
```

**Design Details:**
- **Background:** Card with subtle shadow (consistent with existing calculators)
- **Emoji:** Use sparingly - only for key sections (🏢 company, 📈 yield, 💰 payout)
- **Font Size:**
  - Company Name: Large, bold
  - Div Yield: Medium
  - Monthly Amount: Large, prominent (primary CTA)
- **Spacing:** Generous padding, clean modern look
- **Button:** Subtle, centered "See More ▼" text link

**Calculation for Monthly (Before Tax):**
```
Investment Amount = 100,000 PKR
Current Price = 85.50 PKR/share
Shares Owned = 100,000 / 85.50 = 1,169.59 shares

Annual Dividend/Share = 10.70 PKR
Annual Dividend Total = 1,169.59 × 10.70 = 12,514.62 PKR
Monthly Dividend = 12,514.62 / 12 = 1,042.88 PKR (displayed as PKR 1,043)
```

---

#### Expanded Card (After Click)

```
┌────────────────────────────────────────────────────┐
│ 🏢 Oil & Gas Development Company Limited (OGDC)   │
│ Oil & Gas • PSX • Pakistan                         │
│ 📈 Div Yield: 12.50% (TTM) | Last Year: 11.80%     │
│                                                    │
│ 💰 Your Dividend Income:                           │
│                                                    │
│ 📅 Monthly:                                        │
│    Before Tax:  PKR 10,625                         │
│    After Tax:   PKR 9,031                          │
│                                                    │
│ 📊 Quarterly:                                      │
│    Before Tax:  PKR 31,875                         │
│    After Tax:   PKR 27,094                         │
│                                                    │
│ 📆 Annually:                                       │
│    Before Tax:  PKR 127,500                        │
│    After Tax:   PKR 108,375                        │
│                                                    │
│ 🏛️ Tax Rate: 15% (Pakistan)                        │
│                                                    │
│          [Show Less ▲]                             │
└────────────────────────────────────────────────────┘
```

**Design Details:**
- **Header:** Company name + ticker, sector, exchange, country
- **Yield Comparison:** Show TTM vs Last Year for trend analysis
- **Payout Breakdown:**
  - Three time periods: Monthly, Quarterly, Annual
  - Two amounts per period: Before Tax, After Tax
  - After Tax in slightly bolder/different color to emphasize
- **Tax Info:** Clear display of tax rate used + country
- **Collapse Button:** "Show Less ▲" to return to compact view

**Calculation Example (After Tax):**
```
Before Tax Monthly = 10,625 PKR
Tax Rate = 15%
After Tax Monthly = 10,625 × (1 - 0.15) = 10,625 × 0.85 = 9,031.25 PKR
```

---

### Responsive Design

**Desktop (> 1024px):**
- 3-4 cards per row
- Wide search and filter controls
- Comfortable spacing

**Tablet (768px - 1024px):**
- 2-3 cards per row
- Compact filter controls

**Mobile (< 768px):**
- 1 card per row (full width)
- Stacked filters/sort controls
- Sticky investment amount input at top
- Larger tap targets for expandable cards

---

### Sorting & Filtering UX

**Sort Dropdown Options:**
1. ✅ **Highest Dividend Yield** (default) - Descending by `dividend.yieldTTM`
2. Highest Monthly Payout - Descending by calculated monthly amount
3. Highest Annual Payout - Descending by calculated annual amount
4. Stock Name (A-Z) - Alphabetical by `name`

**Country Filter Options:**
- All Countries (default - shows all stocks)
- Pakistan
- USA (future)
- Canada (future)
- UK (future)

**Sector Filter Options:**
(Dynamically populated from stocks data)
- All Sectors (default)
- Oil & Gas
- Banking
- Cement
- Fertilizer
- Power
- Textiles
- Chemicals
- etc.

**Filter Behavior:**
- Single-select dropdowns (not multi-select)
- Filters combine with AND logic (Country AND Sector)
- Search combines with filters (Search AND Country AND Sector)
- Real-time filtering - no "Apply" button needed

---

## Technical Requirements

### Technology Stack

**Frontend Framework:**
- React 19.2.0 (existing)
- React Router DOM 7.9.6
- Pure JavaScript (JSX) - **No TypeScript**

**Styling:**
- Pure CSS with CSS Variables
- Follow existing patterns in `src/index.css` and `src/App.css`
- No CSS-in-JS libraries
- Responsive design with media queries

**State Management:**
- React `useState` hooks (local component state)
- No global state management needed
- Pattern: Follow existing calculator components

**Build Tools:**
- Vite 7.2.2
- ESLint 9.39.1

---

### Component Structure

**Recommended File Organization:**

```
src/
├── data/
│   ├── stocks.json              (20 PSXDIV20 stocks)
│   ├── taxRates.json            (country tax rates)
│   └── exchangeRates.json       (currency rates - future use)
├── pages/
│   └── DividendCalculator.jsx   (main page component)
├── components/                   (optional - if needed)
│   ├── DividendCard.jsx         (reusable card component)
│   ├── InvestmentInput.jsx      (amount input + slider)
│   └── StockFilters.jsx         (search, filter, sort controls)
├── App.jsx                       (add route)
└── index.css / App.css          (styling)
```

**Note:** Component breakdown is optional. Can be implemented as a single page component if preferred (like existing calculators).

---

### State Variables (DividendCalculator.jsx)

```javascript
const [investmentAmount, setInvestmentAmount] = useState(100000)
const [searchQuery, setSearchQuery] = useState('')
const [selectedCountry, setSelectedCountry] = useState('All Countries')
const [selectedSector, setSelectedSector] = useState('All Sectors')
const [sortBy, setSortBy] = useState('Highest Dividend Yield')
const [expandedCards, setExpandedCards] = useState(new Set())
const [stocks, setStocks] = useState([]) // loaded from JSON
const [taxRates, setTaxRates] = useState({}) // loaded from JSON
```

---

### Key Calculations

#### 1. Calculate Shares Owned
```javascript
const sharesOwned = investmentAmount / stock.currentPrice
```

#### 2. Calculate Annual Dividend (Before Tax)
```javascript
const annualDividendBeforeTax = sharesOwned * stock.dividend.annualPayoutTTM
```

#### 3. Calculate Periodic Dividends (Before Tax)
```javascript
const monthlyBeforeTax = annualDividendBeforeTax / 12
const quarterlyBeforeTax = annualDividendBeforeTax / 4
const annualBeforeTax = annualDividendBeforeTax
```

#### 4. Apply Tax Rate
```javascript
const taxRate = taxRates[stock.country].default / 100
const monthlyAfterTax = monthlyBeforeTax * (1 - taxRate)
const quarterlyAfterTax = quarterlyBeforeTax * (1 - taxRate)
const annualAfterTax = annualBeforeTax * (1 - taxRate)
```

#### 5. Format Currency
```javascript
const formatCurrency = (amount) => {
  return `PKR ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}
```

---

### Filtering & Sorting Logic

#### Search Filter
```javascript
const filteredBySearch = stocks.filter(stock => {
  const query = searchQuery.toLowerCase()
  return (
    stock.ticker.toLowerCase().includes(query) ||
    stock.name.toLowerCase().includes(query)
  )
})
```

#### Country/Sector Filters
```javascript
const filteredByCountry = selectedCountry === 'All Countries'
  ? filteredBySearch
  : filteredBySearch.filter(stock => stock.country === selectedCountry)

const filteredBySector = selectedSector === 'All Sectors'
  ? filteredByCountry
  : filteredByCountry.filter(stock => stock.sector === selectedSector)
```

#### Sorting
```javascript
const sortedStocks = [...filteredBySector].sort((a, b) => {
  switch (sortBy) {
    case 'Highest Dividend Yield':
      return b.dividend.yieldTTM - a.dividend.yieldTTM
    case 'Highest Monthly Payout':
      return calculateMonthly(b) - calculateMonthly(a)
    case 'Highest Annual Payout':
      return calculateAnnual(b) - calculateAnnual(a)
    case 'Stock Name (A-Z)':
      return a.name.localeCompare(b.name)
    default:
      return 0
  }
})
```

---

### Performance Considerations

**Optimization Strategies:**

1. **Memoization:** Use `useMemo` for expensive calculations
   ```javascript
   const calculatedStocks = useMemo(() => {
     return stocks.map(stock => ({
       ...stock,
       monthlyBeforeTax: calculateMonthly(stock, investmentAmount),
       monthlyAfterTax: calculateMonthlyAfterTax(stock, investmentAmount),
       // ... other calculations
     }))
   }, [stocks, investmentAmount, taxRates])
   ```

2. **Debouncing:** Debounce search input to reduce re-renders
   ```javascript
   const [debouncedSearch] = useDebounce(searchQuery, 300)
   ```

3. **Virtual Scrolling:** If stock list grows beyond 50 items, consider react-window or similar

4. **Lazy Loading:** Cards can be lazy-loaded as user scrolls (optional for 20 stocks)

---

### Data Loading

**Load JSON files in component:**

```javascript
useEffect(() => {
  // Load stocks data
  import('../data/stocks.json')
    .then(module => setStocks(module.default))
    .catch(err => console.error('Failed to load stocks:', err))

  // Load tax rates
  import('../data/taxRates.json')
    .then(module => setTaxRates(module.default))
    .catch(err => console.error('Failed to load tax rates:', err))
}, [])
```

**Alternative:** Use fetch if JSON in public folder
```javascript
fetch('/data/stocks.json')
  .then(res => res.json())
  .then(data => setStocks(data))
```

---

### Routing

**Add route in `src/App.jsx`:**

```javascript
<Route path="/dividend-calculator" element={<DividendCalculator />} />
```

**Update navigation:**
- Add link in navigation bar
- Add card on home page with description
- Route: `/fincal/dividend-calculator`

---

## Implementation Phases

### Phase 1: Core Functionality (MVP)
**Priority: HIGH | Timeline: Week 1**

✅ **Data Layer:**
- Scrape PSXDIV20 stock data (accurate, current)
- Create `stocks.json` with 20 PSX stocks
- Create `taxRates.json` with Pakistan default (15%)
- Create `exchangeRates.json` (structure only, not used yet)

✅ **UI Components:**
- Investment amount input (slider + text)
- Stock card grid (compact view only)
- Basic styling following existing design system

✅ **Core Calculations:**
- Monthly dividend (before tax) display
- Shares owned calculation
- Number formatting (PKR locale)

✅ **Routing:**
- Add page to React Router
- Add navigation link
- Update home page

**Success Criteria:**
- User can enter investment amount
- See 20 PSX stocks with monthly dividend payouts
- Basic responsive design works

---

### Phase 2: Advanced Features
**Priority: MEDIUM | Timeline: Week 2**

✅ **Expand/Collapse Cards:**
- Implement expanded view with quarterly/annual
- Show before/after tax amounts
- Toggle animation

✅ **Filtering & Sorting:**
- Search bar (ticker + name)
- Sector filter dropdown
- Sort dropdown (4 options)
- Real-time filtering

✅ **Tax Calculations:**
- After-tax dividend calculations
- Display tax rate used
- Tax info in expanded view

**Success Criteria:**
- Users can filter/sort stocks easily
- Expanded cards show full breakdown
- Tax calculations are accurate

---

### Phase 3: Polish & Optimization
**Priority: LOW | Timeline: Week 3**

✅ **UX Enhancements:**
- Smooth animations for expand/collapse
- Loading states while data loads
- Empty states (no results from search)
- Tooltips for dividend yield explanation

✅ **Performance:**
- Memoize calculations
- Optimize re-renders
- Mobile performance testing

✅ **Accessibility:**
- Keyboard navigation for cards
- Screen reader support
- ARIA labels for controls

**Success Criteria:**
- Smooth, polished user experience
- Works perfectly on mobile
- No performance issues with 20+ stocks

---

## Future Enhancements

### Phase 4: Multi-Currency Support
**Priority: Future**

- Allow user to select investment currency (USD, CAD, GBP)
- Activate `exchangeRates.json`
- Convert all calculations to selected currency
- Add USA high-dividend stocks to dataset

### Phase 5: Advanced Filtering
**Priority: Future**

- Multi-select filters (select multiple sectors)
- Yield range slider (only show stocks with yield > X%)
- Price range filter
- Dividend frequency filter (quarterly vs annual)

### Phase 6: Comparison Tools
**Priority: Future**

- "Compare" checkbox on cards
- Side-by-side comparison view (2-3 stocks)
- Yield trend charts (TTM vs Last Year visualized)
- Historical dividend data

### Phase 7: User Preferences
**Priority: Future**

- Manual tax rate override
- Save favorite stocks (localStorage)
- Custom stock lists
- Export comparison to PDF/CSV

### Phase 8: Real-time Data
**Priority: Future**

- API integration for live stock prices
- Auto-refresh dividend data
- Last updated timestamp display
- Data staleness warnings

---

## Design Specifications

### Color Palette (from existing system)

```css
/* Primary Colors */
--primary-color: #4f46e5;
--primary-hover: #4338ca;

/* Background Colors */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--bg-card: #1e293b;

/* Text Colors */
--text-primary: #f1f5f9;
--text-secondary: #cbd5e1;
--text-muted: #94a3b8;

/* Accent Colors */
--success-color: #10b981;
--warning-color: #f59e0b;
--error-color: #ef4444;

/* Borders & Shadows */
--border-radius: 12px;
--card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Typography

```css
/* Headings */
h1: 2.5rem, bold, --text-primary
h2: 2rem, bold, --text-primary
h3: 1.5rem, semi-bold, --text-primary

/* Body */
body: 1rem, normal, --text-primary
small: 0.875rem, normal, --text-secondary

/* Amounts (Key Numbers) */
.amount-large: 2rem, bold, --primary-color
.amount-medium: 1.5rem, semi-bold, --text-primary
.amount-small: 1rem, normal, --text-secondary
```

### Spacing Scale

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

---

## Acceptance Criteria

### Functional Requirements

- [ ] User can input investment amount (10k - 100 crore PKR)
- [ ] Both slider and text input work and stay synchronized
- [ ] All 20 PSXDIV20 stocks display in grid format
- [ ] Compact cards show: name, ticker, yield, monthly payout
- [ ] Expanded cards show: monthly/quarterly/annual, before/after tax
- [ ] Search filters stocks by ticker or company name
- [ ] Sector filter works correctly
- [ ] Sort by yield/payouts/name works correctly
- [ ] Tax calculations are accurate (15% for Pakistan)
- [ ] Currency formatting follows PKR locale standards
- [ ] Calculations update in real-time when amount changes

### Non-Functional Requirements

- [ ] Page loads in < 2 seconds
- [ ] Responsive design works on mobile (320px+), tablet, desktop
- [ ] Cards expand/collapse smoothly (< 300ms animation)
- [ ] No console errors or warnings
- [ ] Follows existing code style and patterns
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Works in modern browsers (Chrome, Firefox, Safari, Edge)

---

## Data Accuracy Requirements

### PSXDIV20 Stock Data

**Sources (for scraping):**
- Pakistan Stock Exchange official website (https://www.psx.com.pk/)
- PSX dividend data portal
- Financial news sites with PSX data
- Bloomberg/Reuters Pakistan data

**Data Points to Verify:**
1. **Ticker Symbols:** Must match PSX official tickers
2. **Company Names:** Full legal names
3. **Current Prices:** Within 1-2 days of data collection
4. **Dividend Yield TTM:** Calculated from last 12 months of dividends
5. **Annual Payout:** Per-share dividend in PKR
6. **Dividend Frequency:** Verify from company announcements

**Data Freshness:**
- Initial data: Accurate as of implementation date
- Include `lastUpdated` timestamp
- Future: Plan for periodic manual/automated updates

**Validation:**
- Cross-reference multiple sources
- Verify dividend yield calculation: `(Annual Dividend / Current Price) × 100`
- Check for stock splits, bonus shares that affect calculations

---

## Success Metrics & KPIs

### User Engagement
- Time spent on page (target: > 2 minutes)
- Number of stock cards expanded (target: avg 3-5 per session)
- Search/filter usage rate (target: > 60% of users)

### Calculation Accuracy
- Zero calculation errors reported
- Tax calculations match manual verification
- Currency formatting correct for all amounts

### Performance
- Page load time < 2 seconds
- Time to interactive < 3 seconds
- No janky animations (60fps)

### Adoption
- Add to site navigation successfully
- User finds it from home page
- Low bounce rate (< 40%)

---

## Risks & Mitigations

### Risk 1: Data Accuracy
**Risk:** Scraped dividend data may be outdated or inaccurate
**Impact:** HIGH - Users make wrong investment decisions
**Mitigation:**
- Scrape from multiple reliable sources
- Cross-verify all data points
- Display "Last Updated" timestamp prominently
- Plan for regular updates (monthly/quarterly)

### Risk 2: Performance with Large Dataset
**Risk:** Slow performance if stock list grows beyond 50-100 items
**Impact:** MEDIUM - Poor UX, users leave
**Mitigation:**
- Use `useMemo` for calculations
- Implement virtual scrolling if needed
- Lazy load card expansions
- Test with 100+ stocks before scaling

### Risk 3: Mobile UX
**Risk:** Card grid may not work well on small screens
**Impact:** MEDIUM - Mobile users frustrated
**Mitigation:**
- Mobile-first design approach
- Test on multiple device sizes
- Single column on mobile
- Larger tap targets for expand/collapse

### Risk 4: Tax Rate Accuracy
**Risk:** Pakistan tax rates may change or vary by investor type
**Impact:** MEDIUM - After-tax calculations incorrect
**Mitigation:**
- Research current Pakistan dividend tax laws
- Add disclaimer: "Tax rates are estimates"
- Plan for manual tax rate override feature
- Update tax rates annually

---

## Glossary

**TTM (Trailing Twelve Months):** Last 12 months of financial data
**Dividend Yield:** Annual dividend per share / Current stock price × 100
**PSXDIV20:** Pakistan Stock Exchange Dividend Index (top 20 dividend-paying stocks)
**PKR:** Pakistani Rupee currency
**Compact View:** Default collapsed state of stock card
**Expanded View:** Full details view when card is clicked
**Before Tax:** Gross dividend amount before tax deduction
**After Tax:** Net dividend amount after applying tax rate

---

## Appendix A: Sample Calculations

### Example: Oil & Gas Development Company (OGDC)

**Given Data:**
- Investment Amount: 100,000 PKR
- Current Price: 85.50 PKR/share
- Annual Dividend/Share: 10.70 PKR
- Dividend Yield TTM: 12.50%
- Tax Rate (Pakistan): 15%

**Step-by-Step Calculation:**

1. **Shares Owned:**
   ```
   Shares = Investment Amount / Current Price
   Shares = 100,000 / 85.50
   Shares = 1,169.59 shares
   ```

2. **Annual Dividend (Before Tax):**
   ```
   Annual = Shares × Annual Dividend Per Share
   Annual = 1,169.59 × 10.70
   Annual = 12,514.62 PKR
   ```

3. **Periodic Dividends (Before Tax):**
   ```
   Monthly = Annual / 12 = 12,514.62 / 12 = 1,042.88 PKR
   Quarterly = Annual / 4 = 12,514.62 / 4 = 3,128.66 PKR
   Annual = 12,514.62 PKR
   ```

4. **After-Tax Dividends:**
   ```
   Tax Rate = 15% = 0.15

   Monthly After Tax = 1,042.88 × (1 - 0.15) = 886.45 PKR
   Quarterly After Tax = 3,128.66 × (1 - 0.15) = 2,659.36 PKR
   Annual After Tax = 12,514.62 × (1 - 0.15) = 10,637.43 PKR
   ```

5. **Formatted Display:**
   ```
   Monthly Before Tax: PKR 1,043
   Monthly After Tax: PKR 886

   Quarterly Before Tax: PKR 3,129
   Quarterly After Tax: PKR 2,659

   Annual Before Tax: PKR 12,515
   Annual After Tax: PKR 10,637
   ```

**Verification:**
```
Dividend Yield Check:
(10.70 / 85.50) × 100 = 12.51% ✓ (matches 12.50% TTM)
```

---

## Appendix B: PSXDIV20 Stock List (To Be Populated)

**Target Stocks (20):**
1. Oil & Gas Development Company (OGDC)
2. Pakistan Petroleum Limited (PPL)
3. Pakistan State Oil (PSO)
4. Mari Petroleum (MARI)
5. MCB Bank Limited (MCB)
6. Habib Bank Limited (HBL)
7. United Bank Limited (UBL)
8. Lucky Cement (LUCK)
9. DG Khan Cement (DGKC)
10. Cherat Cement (CHCC)
11. Engro Corporation (ENGRO)
12. Engro Fertilizers (EFERT)
13. Fauji Fertilizer Company (FFC)
14. Fauji Fertilizer Bin Qasim (FFBL)
15. Hub Power Company (HUBC)
16. K-Electric (KEL)
17. Nishat Mills (NML)
18. Interloop Limited (ILP)
19. Pakistan Tobacco Company (PTC)
20. Unilever Pakistan (ULEVER)

**Note:** This list is illustrative. Actual PSXDIV20 composition must be verified from official PSX sources during implementation.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-14 | Product Team | Initial PRD based on requirements discussion |

---

## Approval & Sign-off

**Product Owner:** _________________  Date: __________
**Engineering Lead:** _________________  Date: __________
**Design Lead:** _________________  Date: __________

---

*End of Document*
