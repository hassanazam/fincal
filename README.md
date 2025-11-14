# FinCalc - Financial Calculator SPA

A sophisticated React-based Single Page Application (SPA) for financial calculations, deployed on GitHub Pages.

## Features

- **Simple Interest Calculator** - Calculate simple interest on principal amounts
- **Compound Interest Calculator** - See how money grows with compounding (annually, quarterly, monthly, daily)
- **Loan/EMI Calculator** - Calculate monthly EMI and total interest on loans
- **Responsive Design** - Works beautifully on desktop and mobile
- **Modern UI** - Clean, dark-themed interface with smooth interactions

## Tech Stack

- **React 19** - Latest version of React
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **GitHub Pages** - Free hosting with custom domain support
- **GitHub Actions** - Automated CI/CD deployment

## GitHub Pages SPA Configuration

This project implements the proven `spa-github-pages` solution for handling client-side routing on GitHub Pages:

1. **404.html Redirect** - Custom 404 page converts paths to query strings
2. **Index.html Script** - Restores original URL using `history.replaceState()`
3. **Vite Configuration** - Proper base path for GitHub Pages project sites
4. **React Router** - Configured with correct basename

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages:

1. Push to the `main` branch or designated feature branch
2. GitHub Actions workflow builds the app
3. Adds `.nojekyll` file to prevent Jekyll processing
4. Deploys to GitHub Pages automatically

### Repository Settings

To enable deployment:
1. Go to **Settings → Pages**
2. Source: **GitHub Actions** (not "Deploy from a branch")

## Project Structure

```
fincal/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── 404.html               # SPA routing solution
├── src/
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── SimpleInterest.jsx # Simple interest calculator
│   │   ├── CompoundInterest.jsx # Compound interest calculator
│   │   └── LoanCalculator.jsx # Loan/EMI calculator
│   ├── App.jsx                # Main app with routing
│   ├── App.css                # Application styles
│   ├── index.css              # Global styles & CSS variables
│   └── main.jsx               # React entry point
├── index.html                 # HTML template with redirect script
├── vite.config.js             # Vite configuration with base path
└── package.json               # Dependencies and scripts
```

## Calculators

### Simple Interest
Formula: `I = (P × R × T) / 100`
- Principal amount: $1,000 - $1,000,000
- Interest rate: 0.1% - 30%
- Time period: 1 - 30 years

### Compound Interest
Formula: `A = P(1 + r/n)^(nt)`
- Compounding frequencies: Annually, Quarterly, Monthly, Daily
- Supports same ranges as simple interest

### Loan/EMI Calculator
Formula: `EMI = [P × R × (1+R)^N] / [(1+R)^N-1]`
- Loan amount: $10,000 - $1,000,000
- Interest rate: 1% - 20%
- Tenure: 1 - 30 years

## Contributing

This is an educational project demonstrating SPA deployment on GitHub Pages. Feel free to fork and modify for your own use.

## License

MIT License - Feel free to use this project as a template for your own GitHub Pages SPAs.

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [spa-github-pages](https://github.com/rafgraph/spa-github-pages) - The SPA routing solution used
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
