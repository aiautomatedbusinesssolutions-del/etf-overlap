import { ETF, Holding } from "../data/mockEtfs";

interface AlphaHolding {
  symbol?: string;
  description?: string;
  weight?: string;
}

interface AlphaSector {
  sector?: string;
  weight?: string;
}

export interface FetchResult {
  etf: ETF;
  isLive: boolean;
}

export type FetchError = "rate_limited" | "not_found" | "error";

export async function getEtfHoldings(
  ticker: string
): Promise<{ data: FetchResult; error?: never } | { data?: never; error: FetchError }> {
  try {
    const res = await fetch(`/api/etf?ticker=${encodeURIComponent(ticker)}`);
    if (!res.ok) {
      if (res.status === 429) return { error: "rate_limited" };
      if (res.status === 404) return { error: "not_found" };
      return { error: "error" };
    }

    const data: {
      name: string;
      expenseRatio: number | null;
      holdings: AlphaHolding[] | null;
      sectors: AlphaSector[] | null;
    } = await res.json();

    const etfName = data.name || ticker.toUpperCase();
    const expenseRatio = data.expenseRatio ?? 0.1;

    // Parse ETF-level sector breakdown
    const sectors = (data.sectors || [])
      .filter((s) => s.sector && parseFloat(s.weight || "0") > 0)
      .map((s) => ({
        sector: s.sector!,
        weight: Math.round(parseFloat(s.weight || "0") * 10000) / 100,
      }))
      .sort((a, b) => b.weight - a.weight);

    // If we have live holdings data, map it
    if (data.holdings && data.holdings.length > 0) {
      const totalHoldingsCount = data.holdings.filter(
        (h) => h.symbol && parseFloat(h.weight || "0") > 0
      ).length;

      const holdings: Holding[] = data.holdings
        .filter((h) => h.symbol && parseFloat(h.weight || "0") > 0)
        .map((h) => ({
          ticker: h.symbol || "",
          name: h.description || h.symbol || "",
          weight: Math.round(parseFloat(h.weight || "0") * 10000) / 100,
          sector: "Uncategorized",
        }))
        .sort((a, b) => b.weight - a.weight);

      if (holdings.length > 0) {
        return {
          data: {
            etf: {
              ticker: ticker.toUpperCase(),
              name: etfName,
              expenseRatio,
              holdings,
              totalHoldingsCount,
              sectors: sectors.length > 0 ? sectors : undefined,
            },
            isLive: true,
          },
        };
      }
    }

    // API returned 200 but no holdings (common for bond ETFs) —
    // still return a valid ETF with empty holdings so the UI can show info
    if (sectors.length > 0) {
      return {
        data: {
          etf: {
            ticker: ticker.toUpperCase(),
            name: etfName,
            expenseRatio,
            holdings: [],
            totalHoldingsCount: 0,
            sectors,
          },
          isLive: true,
        },
      };
    }

    return { error: "not_found" };
  } catch {
    return { error: "error" };
  }
}
