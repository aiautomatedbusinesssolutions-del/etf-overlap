# ETF Overlap

An X-Ray tool for ETF overlap and fee transparency. Compare funds side-by-side, spot hidden overlap in your portfolio, and understand the real cost of management fees.

**Live Demo:** [etf-overlap.vercel.app](https://etf-overlap.vercel.app)

## Key Features

- **Whale Chart** — Interactive donut charts showing the top 10 "Whale" holdings of each ETF. Hover or tap the "Others" slice to see remaining fund composition, total holdings count, concentration insights, and sector breakdown.

- **Live API Search** — Type any ticker (VTI, VXUS, ARKK, etc.) and search against Alpha Vantage in real time. Falls back gracefully to mock data on rate limits or timeouts.

- **Bond ETF Detection** — Bond funds like BND, AGG, and TLT that return no equity holdings are handled gracefully with a dedicated notice showing total holdings count (e.g., BND: 17,478) and fund-level sector data instead of an error.

- **ETF Reference Table** — Built-in truth table for 30+ common ETFs ensures accurate holdings counts (e.g., QQQ: 103, VTI: 3,531, VXUS: 8,632) even when the free API tier only returns partial data.

- **Overlap Scoreboard** — Instantly see how much two ETFs share in common. A color-coded overlap percentage (low/moderate/high) with a detailed "Shared DNA" table listing every overlapping stock, sorted by shared weight. Includes a sector concentration warning when overlap is dominated by a single sector.

- **$10,000 Fee Battle** — Drag a slider from 1 to 30 years and watch the fee impact unfold in real time. Side-by-side fee cards with visual bars show the cost difference, plus a Pro Tip telling you exactly how much you could save by choosing the lower-cost fund.

- **Education Card** — A beginner-friendly explainer on the "Overlap Trap" that helps new investors understand why holding multiple ETFs doesn't always mean diversification.

## How to Use

1. **Select or search** two ETFs using the dual search bar at the top.
2. **Explore the Whale Charts** — hover over slices to see individual weights; tap "Others" for the full remaining fund breakdown.
3. **Check the Overlap Scoreboard** to see shared holdings and overlap percentage.
4. **Compare fees** with the Fee Battle slider.
5. **Try bond ETFs** (BND, AGG, TLT) — the app detects them and shows holdings count and sector data instead of erroring out.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Vercel Analytics
- Alpha Vantage API (free tier)

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # Add your Alpha Vantage API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
