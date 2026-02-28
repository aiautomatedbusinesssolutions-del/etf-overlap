import { ETF, Holding } from "../data/mockEtfs";

export interface ConcentrationItem {
  name: string;
  weight: number;
}

/**
 * Returns Top 10 holdings sorted by weight plus an "Others" bucket
 * that accounts for the remainder up to 100%.
 */
export function getConcentrationData(holdings: Holding[]): ConcentrationItem[] {
  const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
  const top10 = sorted.slice(0, 10);
  const top10Weight = top10.reduce((sum, h) => sum + h.weight, 0);
  const othersWeight = Math.round((100 - top10Weight) * 100) / 100;

  return [
    ...top10.map((h) => ({ name: h.name, weight: h.weight })),
    { name: "Others", weight: othersWeight },
  ];
}

export interface SharedHolding {
  ticker: string;
  name: string;
  sector: string;
  weightA: number;
  weightB: number;
  sharedWeight: number;
}

export interface OverlapResult {
  sharedHoldings: SharedHolding[];
  overlapPercentage: number;
}

/**
 * Compares two ETFs and returns the overlapping holdings
 * with total shared weight percentage.
 */
export function calculateOverlap(etfA: ETF, etfB: ETF): OverlapResult {
  const holdingsMapB = new Map(
    etfB.holdings.map((h) => [h.ticker, h])
  );

  const sharedHoldings = etfA.holdings
    .filter((holdingA) => holdingsMapB.has(holdingA.ticker))
    .map((holdingA) => {
      const holdingB = holdingsMapB.get(holdingA.ticker)!;
      const sharedWeight = Math.round(Math.min(holdingA.weight, holdingB.weight) * 100) / 100;
      return {
        ticker: holdingA.ticker,
        name: holdingA.name,
        sector: holdingA.sector,
        weightA: holdingA.weight,
        weightB: holdingB.weight,
        sharedWeight,
      };
    })
    .sort((a, b) => b.sharedWeight - a.sharedWeight);

  const overlapPercentage = sharedHoldings.reduce(
    (sum, h) => sum + h.sharedWeight,
    0
  );

  return {
    sharedHoldings,
    overlapPercentage: Math.round(overlapPercentage * 100) / 100,
  };
}

/**
 * Calculates total fees lost to an expense ratio over time using
 * compound decay: Principal * (1 - (1 - ratio)^years).
 */
export function calculateFees(
  principal: number,
  expenseRatio: number,
  years: number
): number {
  const ratioDecimal = expenseRatio / 100;
  const totalFees = principal * (1 - Math.pow(1 - ratioDecimal, years));
  return Math.round(totalFees * 100) / 100;
}
