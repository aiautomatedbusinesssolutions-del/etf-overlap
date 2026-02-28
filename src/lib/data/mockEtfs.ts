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
  totalHoldingsCount?: number;
  sectors?: { sector: string; weight: number }[];
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
      { ticker: "JPM", name: "JPMorgan Chase & Co.", weight: 1.4, sector: "Financials" },
      { ticker: "UNH", name: "UnitedHealth Group Inc.", weight: 1.3, sector: "Healthcare" },
      { ticker: "XOM", name: "Exxon Mobil Corp.", weight: 1.2, sector: "Energy" },
      { ticker: "V", name: "Visa Inc.", weight: 1.1, sector: "Financials" },
      { ticker: "MA", name: "Mastercard Inc.", weight: 1.0, sector: "Financials" },
      { ticker: "PG", name: "Procter & Gamble Co.", weight: 0.9, sector: "Consumer Defensive" },
      { ticker: "JNJ", name: "Johnson & Johnson", weight: 0.9, sector: "Healthcare" },
      { ticker: "HD", name: "Home Depot Inc.", weight: 0.8, sector: "Consumer Cyclical" },
      { ticker: "ABBV", name: "AbbVie Inc.", weight: 0.8, sector: "Healthcare" },
      { ticker: "CVX", name: "Chevron Corp.", weight: 0.7, sector: "Energy" },
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
      { ticker: "NFLX", name: "Netflix Inc.", weight: 2.1, sector: "Technology" },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 1.8, sector: "Technology" },
      { ticker: "ADBE", name: "Adobe Inc.", weight: 1.6, sector: "Technology" },
      { ticker: "PEP", name: "PepsiCo Inc.", weight: 1.5, sector: "Consumer Defensive" },
      { ticker: "LIN", name: "Linde PLC", weight: 1.3, sector: "Basic Materials" },
      { ticker: "CSCO", name: "Cisco Systems Inc.", weight: 1.2, sector: "Technology" },
      { ticker: "INTC", name: "Intel Corp.", weight: 1.0, sector: "Technology" },
      { ticker: "INTU", name: "Intuit Inc.", weight: 0.9, sector: "Technology" },
      { ticker: "CMCSA", name: "Comcast Corp.", weight: 0.9, sector: "Communication" },
      { ticker: "TMUS", name: "T-Mobile US Inc.", weight: 0.8, sector: "Communication" },
    ],
  },
};
