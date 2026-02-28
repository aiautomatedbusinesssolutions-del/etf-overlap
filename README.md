# ETF Overlap

An X-Ray tool for ETF overlap and fee transparency. Compare funds side-by-side, spot hidden overlap in your portfolio, and understand the real cost of management fees.

## Key Features

- **Concentration Donuts** — Interactive donut charts showing the top 10 holdings of each ETF, with an "Others" bucket for the remaining allocation. Hover to explore individual weights.

- **Overlap Scoreboard** — Instantly see how much two ETFs share in common. A color-coded overlap percentage (low/moderate/high) with a detailed "Shared DNA" table listing every overlapping stock, sorted by shared weight. Includes a sector concentration warning when overlap is dominated by a single sector.

- **$10,000 Fee Battle** — Drag a slider from 1 to 30 years and watch the fee impact unfold in real time. Side-by-side fee cards with visual bars show the cost difference, plus a Pro Tip telling you exactly how much you could save by choosing the lower-cost fund.

- **Education Card** — A beginner-friendly explainer on the "Overlap Trap" that helps new investors understand why holding multiple ETFs doesn't always mean diversification.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
