import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://www.alphavantage.co/query";

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker");
  if (!ticker) {
    return NextResponse.json({ error: "Missing ticker parameter" }, { status: 400 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let res: Response;
    try {
      res = await fetch(
        `${BASE_URL}?function=ETF_PROFILE&symbol=${ticker}&apikey=${apiKey}`,
        { signal: controller.signal }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from data provider" }, { status: 500 });
    }

    const data = await res.json();

    // Alpha Vantage returns { Information: "..." } for rate limit or invalid key
    if (data.Information || data["Error Message"]) {
      console.log(`ETF search for ${ticker} failed:`, data.Information || data["Error Message"]);
      return NextResponse.json({ error: "Rate limited or invalid key" }, { status: 429 });
    }

    const holdings = data.holdings || [];
    const sectors = data.sectors || [];
    const expenseRatio = data.net_expense_ratio
      ? parseFloat(data.net_expense_ratio) * 100
      : null;

    if (holdings.length === 0 && sectors.length === 0) {
      return NextResponse.json({ error: "Ticker not found" }, { status: 404 });
    }

    console.log(`Finnhub Search for ${ticker.toUpperCase()} successful`);

    return NextResponse.json({
      name: ticker.toUpperCase(),
      expenseRatio,
      holdings,
      sectors,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch from data provider" }, { status: 500 });
  }
}
