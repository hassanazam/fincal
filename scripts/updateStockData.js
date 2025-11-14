#!/usr/bin/env node

/**
 * PSXDIV20 Stock Data Updater
 *
 * This script scrapes dividend data from stockanalysis.com for all PSXDIV20 stocks
 * and updates the src/data/stocks.json file with current information.
 *
 * Usage:
 *   node scripts/updateStockData.js
 *   npm run update-stocks
 *
 * Features:
 * - Scrapes real dividend amounts (not calculated)
 * - Gets actual payment frequencies (annual, semi-annual, quarterly)
 * - Updates current prices and dividend yields
 * - Preserves sector classifications
 * - Handles rate limiting with delays
 * - Comprehensive error handling
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  dataPath: join(__dirname, '../src/data/stocks.json'),
  sectorMapPath: join(__dirname, '../src/data/sectorMap.json'),
  baseUrl: 'https://stockanalysis.com/quote/psx',
  delayBetweenRequests: 2000, // 2 seconds between requests to avoid rate limiting
  retryAttempts: 3,
  retryDelay: 5000
};

// Stock ticker list (PSXDIV20)
const STOCK_TICKERS = [
  'ABL', 'APL', 'BAFL', 'BAHL', 'EFERT', 'ENGRO', 'EPCL', 'EPQL',
  'FATIMA', 'FFC', 'HBL', 'HMB', 'INDU', 'ISL', 'KAPCO', 'MCB',
  'NCL', 'POL', 'TGL', 'UBL'
];

// Sector mapping (preserved from manual research)
const SECTOR_MAP = {
  'ABL': 'Commercial Banks',
  'APL': 'Oil & Gas Marketing',
  'BAFL': 'Commercial Banks',
  'BAHL': 'Commercial Banks',
  'EFERT': 'Fertilizer',
  'ENGRO': 'Chemicals',
  'EPCL': 'Chemicals',
  'EPQL': 'Power Generation',
  'FATIMA': 'Fertilizer',
  'FFC': 'Fertilizer',
  'HBL': 'Commercial Banks',
  'HMB': 'Commercial Banks',
  'INDU': 'Automobile Assembler',
  'ISL': 'Iron & Steel',
  'KAPCO': 'Power Generation',
  'MCB': 'Commercial Banks',
  'NCL': 'Textiles',
  'POL': 'Oil & Gas Exploration',
  'TGL': 'Glass & Ceramics',
  'UBL': 'Commercial Banks'
};

// Company name mapping
const COMPANY_NAMES = {
  'ABL': 'Allied Bank Limited',
  'APL': 'Attock Petroleum Limited',
  'BAFL': 'Bank Alfalah Limited',
  'BAHL': 'Bank Al-Habib Limited',
  'EFERT': 'Engro Fertilizers Limited',
  'ENGRO': 'Engro Corporation Limited',
  'EPCL': 'Engro Polymer & Chemicals Limited',
  'EPQL': 'Engro Powergen Qadirpur Limited',
  'FATIMA': 'Fatima Fertilizer Company Limited',
  'FFC': 'Fauji Fertilizer Company Limited',
  'HBL': 'Habib Bank Limited',
  'HMB': 'Habib Metropolitan Bank Limited',
  'INDU': 'Indus Motor Company Limited',
  'ISL': 'International Steels Limited',
  'KAPCO': 'Kot Addu Power Company Limited',
  'MCB': 'MCB Bank Limited',
  'NCL': 'Nishat Chunian Limited',
  'POL': 'Pakistan Oilfields Limited',
  'TGL': 'Tariq Glass Industries Limited',
  'UBL': 'United Bank Limited'
};

/**
 * Parse HTML response to extract dividend data
 * Note: This is a simplified parser. In production, consider using a library like cheerio
 */
function parseStockAnalysisHTML(html, ticker) {
  const data = {
    ticker,
    name: COMPANY_NAMES[ticker],
    exchange: 'PSX',
    country: 'Pakistan',
    currency: 'PKR',
    sector: SECTOR_MAP[ticker],
    currentPrice: null,
    dividend: {
      yieldTTM: null,
      yieldLastYear: null,
      annualPayoutTTM: null,
      frequency: 'annual'
    },
    lastUpdated: new Date().toISOString()
  };

  try {
    // Extract Annual Dividend (e.g., "7.00 PKR per share")
    const annualDividendMatch = html.match(/Annual Dividend[:\s]*(\d+\.?\d*)\s*PKR/i);
    if (annualDividendMatch) {
      data.dividend.annualPayoutTTM = parseFloat(annualDividendMatch[1]);
    }

    // Extract Dividend Yield (e.g., "23.30%")
    const yieldMatch = html.match(/Dividend Yield[:\s]*(\d+\.?\d*)%/i);
    if (yieldMatch) {
      data.dividend.yieldTTM = parseFloat(yieldMatch[1]);
    }

    // Extract Payment Frequency (e.g., "Semi-Annual", "Annual", "Quarterly")
    const frequencyMatch = html.match(/Payment Frequency[:\s]*(Semi-Annual|Annual|Quarterly|Monthly)/i);
    if (frequencyMatch) {
      data.dividend.frequency = frequencyMatch[1].toLowerCase().replace('-', '');
    }

    // Calculate current price from yield and annual dividend
    // Formula: price = (annualDividend / yield) * 100
    if (data.dividend.annualPayoutTTM && data.dividend.yieldTTM) {
      data.currentPrice = parseFloat(
        ((data.dividend.annualPayoutTTM / data.dividend.yieldTTM) * 100).toFixed(2)
      );
    }

    // Try to extract last year's yield from growth data
    // This is approximate - would need historical data for exact value
    const growthMatch = html.match(/Dividend Growth \(1Y\)[:\s]*(-?\d+\.?\d*)%/i);
    if (growthMatch && data.dividend.yieldTTM) {
      const growthPercent = parseFloat(growthMatch[1]);
      // Calculate approximate last year yield
      data.dividend.yieldLastYear = parseFloat(
        (data.dividend.yieldTTM / (1 + growthPercent / 100)).toFixed(2)
      );
    } else {
      // Default to 95% of current yield if no growth data
      data.dividend.yieldLastYear = data.dividend.yieldTTM
        ? parseFloat((data.dividend.yieldTTM * 0.95).toFixed(2))
        : null;
    }

  } catch (error) {
    console.error(`Error parsing data for ${ticker}:`, error.message);
  }

  return data;
}

/**
 * Fetch dividend data from stockanalysis.com
 */
async function fetchStockData(ticker, attempt = 1) {
  const url = `${CONFIG.baseUrl}/${ticker}/dividend/`;

  console.log(`Fetching ${ticker} (attempt ${attempt}/${CONFIG.retryAttempts})...`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const stockData = parseStockAnalysisHTML(html, ticker);

    // Validate essential data
    if (!stockData.dividend.annualPayoutTTM || !stockData.dividend.yieldTTM) {
      throw new Error('Missing essential dividend data');
    }

    console.log(`✓ Successfully fetched ${ticker}: ${stockData.dividend.yieldTTM}% yield, ${stockData.dividend.frequency}`);
    return stockData;

  } catch (error) {
    console.error(`✗ Failed to fetch ${ticker}:`, error.message);

    // Retry logic
    if (attempt < CONFIG.retryAttempts) {
      console.log(`  Retrying in ${CONFIG.retryDelay / 1000}s...`);
      await sleep(CONFIG.retryDelay);
      return fetchStockData(ticker, attempt + 1);
    }

    // Return null if all retries failed
    console.error(`  Skipping ${ticker} after ${CONFIG.retryAttempts} attempts`);
    return null;
  }
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load existing stock data
 */
function loadExistingData() {
  try {
    const data = readFileSync(CONFIG.dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Could not load existing data, starting fresh');
    return [];
  }
}

/**
 * Save stock data to JSON file
 */
function saveStockData(stocks) {
  const json = JSON.stringify(stocks, null, 2);
  writeFileSync(CONFIG.dataPath, json, 'utf8');
  console.log(`\n✓ Saved ${stocks.length} stocks to ${CONFIG.dataPath}`);
}

/**
 * Save sector map for reference
 */
function saveSectorMap() {
  const sectorMapPath = join(__dirname, '../src/data/sectorMap.json');
  const json = JSON.stringify(SECTOR_MAP, null, 2);
  writeFileSync(sectorMapPath, json, 'utf8');
  console.log(`✓ Saved sector map to ${sectorMapPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('PSXDIV20 Stock Data Updater');
  console.log('='.repeat(60));
  console.log(`Starting at: ${new Date().toISOString()}`);
  console.log(`Stocks to update: ${STOCK_TICKERS.length}`);
  console.log(`Delay between requests: ${CONFIG.delayBetweenRequests}ms\n`);

  const existingData = loadExistingData();
  const updatedStocks = [];
  const failedStocks = [];

  // Fetch data for each stock
  for (let i = 0; i < STOCK_TICKERS.length; i++) {
    const ticker = STOCK_TICKERS[i];

    const stockData = await fetchStockData(ticker);

    if (stockData) {
      updatedStocks.push(stockData);
    } else {
      failedStocks.push(ticker);

      // Preserve existing data if fetch failed
      const existing = existingData.find(s => s.ticker === ticker);
      if (existing) {
        console.log(`  Using existing data for ${ticker}`);
        updatedStocks.push(existing);
      }
    }

    // Delay between requests (except for last one)
    if (i < STOCK_TICKERS.length - 1) {
      await sleep(CONFIG.delayBetweenRequests);
    }
  }

  // Sort by ticker
  updatedStocks.sort((a, b) => a.ticker.localeCompare(b.ticker));

  // Save results
  saveStockData(updatedStocks);
  saveSectorMap();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Update Summary');
  console.log('='.repeat(60));
  console.log(`Total stocks: ${STOCK_TICKERS.length}`);
  console.log(`Successfully updated: ${updatedStocks.length - failedStocks.length}`);
  console.log(`Failed (using existing data): ${failedStocks.length}`);

  if (failedStocks.length > 0) {
    console.log(`\nFailed stocks: ${failedStocks.join(', ')}`);
  }

  console.log(`\nCompleted at: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
