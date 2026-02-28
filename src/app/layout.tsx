import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETF Overlap — Compare Funds & Spot Hidden Overlap",
  description: "X-Ray your portfolio: compare ETF holdings side-by-side, spot hidden overlap, and understand the real cost of management fees.",
  openGraph: {
    title: "ETF Overlap — Compare Funds & Spot Hidden Overlap",
    description: "X-Ray your portfolio: compare ETF holdings side-by-side, spot hidden overlap, and understand the real cost of management fees.",
    type: "website",
    siteName: "ETF Overlap",
  },
  twitter: {
    card: "summary_large_image",
    title: "ETF Overlap — Compare Funds & Spot Hidden Overlap",
    description: "X-Ray your portfolio: compare ETF holdings side-by-side, spot hidden overlap, and understand the real cost of management fees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
