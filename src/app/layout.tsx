import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gopheracademy.biz"),
  title: "Gopher Academy - Vineyard & Estate Gopher Control",
  description:
    "Discreet, thorough gopher control for vineyards and estates. We protect the roots your vintage depends on.",
  openGraph: {
    title: "Gopher Academy",
    description: "We teach gophers a lesson. Vineyard and estate gopher control.",
    images: ["/logo-wide.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
