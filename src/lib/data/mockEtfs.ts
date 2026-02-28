export interface Holding {
  ticker: string;
  name: string;
  weight: number;
  sector: string;
}

export interface ETF {
  ticker: string;
  name: string;
  expenseRatio: number;
  holdings: Holding[];
}

export const MOCK_ETFS: Record<string, ETF> = {
  SPY: {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    expenseRatio: 0.0945,
    holdings: [
      { ticker: "AAPL", name: "Apple Inc.", weight: 7.1, sector: "Technology" },
      { ticker: "MSFT", name: "Microsoft Corp.", weight: 6.8, sector: "Technology" },
      { ticker: "NVDA", name: "NVIDIA Corp.", weight: 6.1, sector: "Technology" },
      { ticker: "AMZN", name: "Amazon.com Inc.", weight: 3.8, sector: "Consumer Cyclical" },
      { ticker: "META", name: "Meta Platforms Inc.", weight: 2.5, sector: "Technology" },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weight: 2.1, sector: "Technology" },
      { ticker: "BRK.B", name: "Berkshire Hathaway Inc.", weight: 1.7, sector: "Financials" },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weight: 1.7, sector: "Technology" },
      { ticker: "LLY", name: "Eli Lilly & Co.", weight: 1.5, sector: "Healthcare" },
      { ticker: "AVGO", name: "Broadcom Inc.", weight: 1.5, sector: "Technology" },
    ],
  },
  QQQ: {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    expenseRatio: 0.20,
    holdings: [
      { ticker: "AAPL", name: "Apple Inc.", weight: 8.9, sector: "Technology" },
      { ticker: "MSFT", name: "Microsoft Corp.", weight: 8.1, sector: "Technology" },
      { ticker: "NVDA", name: "NVIDIA Corp.", weight: 7.8, sector: "Technology" },
      { ticker: "AMZN", name: "Amazon.com Inc.", weight: 5.4, sector: "Consumer Cyclical" },
      { ticker: "META", name: "Meta Platforms Inc.", weight: 4.8, sector: "Technology" },
      { ticker: "AVGO", name: "Broadcom Inc.", weight: 4.2, sector: "Technology" },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weight: 2.7, sector: "Technology" },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weight: 2.6, sector: "Technology" },
      { ticker: "COST", name: "Costco Wholesale Corp.", weight: 2.5, sector: "Consumer Defensive" },
      { ticker: "TSLA", name: "Tesla Inc.", weight: 2.4, sector: "Consumer Cyclical" },
    ],
  },
};
