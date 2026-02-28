import { ETF, Holding } from "../data/mockEtfs";

export interface SectorBreakdown {
  sector: string;
  weight: number;
}

export interface ConcentrationItem {
  name: string;
  weight: number;
  othersSectorMix?: SectorBreakdown[];
  othersCount?: number;
}

/**
 * Returns Top 10 holdings sorted by weight plus an "Others" bucket
 * that accounts for the remainder up to 100%.
 * The "Others" entry includes a sector breakdown of the remaining holdings.
 */
export function getConcentrationData(holdings: Holding[]): ConcentrationItem[] {
  const sorted = [...holdings].sort((a, b) => b.weight - a.weight);
  const top10 = sorted.slice(0, 10);
  const remaining = sorted.slice(10);
  const top10Weight = top10.reduce((sum, h) => sum + h.weight, 0);
  const othersWeight = Math.round((100 - top10Weight) * 100) / 100;

  const sectorMap: Record<string, number> = {};
  for (const h of remaining) {
    sectorMap[h.sector] = Math.round(((sectorMap[h.sector] || 0) + h.weight) * 100) / 100;
  }

  const knownSectorWeight = Object.values(sectorMap).reduce((s, w) => s + w, 0);
  const unlistedWeight = Math.round((othersWeight - knownSectorWeight) * 100) / 100;
  if (unlistedWeight > 0) {
    sectorMap["Other Sectors"] = unlistedWeight;
  }

  const othersSectorMix = Object.entries(sectorMap)
    .map(([sector, weight]) => ({ sector, weight }))
    .sort((a, b) => b.weight - a.weight);

  return [
    ...top10.map((h) => ({ name: h.name, weight: h.weight })),
    {
      name: "Others",
      weight: othersWeight,
      othersSectorMix,
      othersCount: remaining.length,
    },
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
