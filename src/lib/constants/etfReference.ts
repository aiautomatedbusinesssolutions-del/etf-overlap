/**
 * Known total holdings counts for common ETFs.
 * Used as a truth source when the free-tier API only returns a partial list.
 */
export const ETF_HOLDINGS_COUNT: Record<string, number> = {
  SPY: 503,
  VOO: 503,
  IVV: 503,
  VTI: 3531,
  ITOT: 3531,
  VXUS: 8632,
  QQQ: 103,
  QQQM: 103,
  SCHD: 101,
  VIG: 315,
  VUG: 188,
  VTV: 335,
  ARKK: 35,
  DIA: 30,
  IWM: 1942,
  VEA: 3997,
  VWO: 4653,
  // Bond ETFs
  BND: 17478,
  AGG: 12089,
  TLT: 41,
  BNDX: 6781,
  VCIT: 2112,
  VCSH: 2319,
  LQD: 2694,
  SHY: 79,
  IEF: 14,
  VGSH: 121,
  MUB: 5538,
  HYG: 1211,
  TIP: 50,
  BSV: 2807,
  BIV: 2866,
  BLV: 3179,
};

/**
 * Bond/fixed-income ETFs that typically return 0 equity holdings from APIs.
 */
export const BOND_ETFS = new Set([
  "BND", "AGG", "TLT", "BNDX", "VCIT", "VCSH", "LQD",
  "SHY", "IEF", "VGSH", "MUB", "HYG", "TIP", "BSV", "BIV", "BLV",
]);
