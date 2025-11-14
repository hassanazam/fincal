# Stock Data Update Scripts

This directory contains scripts for maintaining and updating stock data for the FinCal Dividend Calculator.

## Scripts

### `updateStockData.js`

Automated script to scrape and update PSXDIV20 stock dividend data from stockanalysis.com.

#### What It Does

- Scrapes dividend data for all 20 PSXDIV20 stocks
- Extracts:
  - Current stock prices
  - Annual dividend amounts (actual, not calculated)
  - Dividend yields (TTM)
  - Payment frequencies (annual, semi-annual, quarterly)
  - Dividend growth rates
- Updates `src/data/stocks.json` with fresh data
- Preserves sector classifications (from manual research)
- Handles errors gracefully with retry logic
- Rate-limited to avoid overwhelming the source

#### Usage

**Run via npm script (recommended):**
```bash
npm run update-stocks
```

**Run directly:**
```bash
node scripts/updateStockData.js
```

#### Configuration

Edit the `CONFIG` object in `updateStockData.js` to customize:

```javascript
const CONFIG = {
  dataPath: '../src/data/stocks.json',
  delayBetweenRequests: 2000,  // Delay between API calls (ms)
  retryAttempts: 3,             // Number of retry attempts
  retryDelay: 5000              // Delay before retry (ms)
};
```

#### Output

The script provides detailed console output:

```
============================================================
PSXDIV20 Stock Data Updater
============================================================
Starting at: 2025-01-14T15:30:00.000Z
Stocks to update: 20
Delay between requests: 2000ms

Fetching ABL (attempt 1/3)...
✓ Successfully fetched ABL: 9.33% yield, annual
Fetching APL (attempt 1/3)...
✓ Successfully fetched APL: 4.76% yield, annual
...

============================================================
Update Summary
============================================================
Total stocks: 20
Successfully updated: 20
Failed (using existing data): 0

Completed at: 2025-01-14T15:35:00.000Z
============================================================
```

#### Error Handling

- **Network failures:** Retries up to 3 times with 5-second delays
- **Missing data:** Preserves existing data if fetch fails
- **Invalid responses:** Logs errors and continues with next stock

#### Data Sources

**Primary:** [stockanalysis.com/quote/psx/{TICKER}/dividend/](https://stockanalysis.com/quote/psx/)

**Sector data:** Manually researched from PSX official sources (preserved in code)

#### When to Run

**Recommended schedule:**
- **Weekly:** For active dividend tracking
- **Monthly:** For general maintenance
- **After dividend announcements:** When PSX companies declare new dividends
- **Before major updates:** To ensure calculator has fresh data

#### Notes

**HTML Parsing:** The script uses regex-based parsing for simplicity. For more robust parsing, consider using a library like `cheerio`:

```bash
npm install cheerio
```

Then replace the parsing logic with proper DOM traversal.

**Sector Mapping:** Sectors are hardcoded because stockanalysis.com doesn't provide sector classifications for PSX stocks. If you add new stocks, update the `SECTOR_MAP` object.

**Rate Limiting:** The 2-second delay between requests is conservative. Adjust if needed, but be respectful to the data source.

## Adding New Stocks

To add stocks beyond PSXDIV20:

1. Add ticker to `STOCK_TICKERS` array
2. Add sector to `SECTOR_MAP` object
3. Add company name to `COMPANY_NAMES` object
4. Run the update script

Example:

```javascript
const STOCK_TICKERS = [
  'ABL', 'APL', /* existing stocks */
  'NEWSTOCK'  // Add new ticker
];

const SECTOR_MAP = {
  'ABL': 'Commercial Banks',
  // ...
  'NEWSTOCK': 'Technology'  // Add sector
};

const COMPANY_NAMES = {
  'ABL': 'Allied Bank Limited',
  // ...
  'NEWSTOCK': 'New Stock Company Ltd'  // Add name
};
```

## Troubleshooting

### Script fails with "Cannot find module"

Ensure you're running Node.js 18+ (which supports native `fetch` and ES modules):

```bash
node --version  # Should be v18.0.0 or higher
```

### All stocks fail with 403 errors

stockanalysis.com may be blocking automated requests. Solutions:
- Increase delay between requests
- Add more realistic headers
- Use a proxy service
- Manually update data

### Data looks incorrect

1. Check the source page manually: `https://stockanalysis.com/quote/psx/TICKER/dividend/`
2. Verify the HTML structure hasn't changed
3. Update regex patterns in `parseStockAnalysisHTML()` if needed

### Stock added but no data appears

1. Verify ticker symbol is correct for PSX (exact match)
2. Check if stockanalysis.com has data for that stock
3. Review console output for specific errors

## Future Enhancements

Potential improvements for this script:

- [ ] Use `cheerio` for robust HTML parsing
- [ ] Add support for multiple data sources (fallback if primary fails)
- [ ] Scrape historical dividend data (not just current)
- [ ] Add data validation/sanity checks
- [ ] Generate change reports (what changed since last update)
- [ ] Email notifications on significant yield changes
- [ ] Export data to CSV for manual review
- [ ] Add unit tests
- [ ] Support for custom stock lists (beyond PSXDIV20)

## Support

For issues or questions about this script:
1. Check console output for specific error messages
2. Review the stockanalysis.com page structure
3. Open an issue in the project repository

---

**Last Updated:** January 2025
