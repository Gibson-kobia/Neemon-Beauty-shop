import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "../components/site-shell";

const headingSerif = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodySans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEEMON BEAUTY SHOP & COSMETICS",
  description:
    "Luxury Kenyan beauty ecommerce. Authentic brands, secure M‑Pesa, nationwide delivery.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingSerif.variable} ${bodySans.variable} antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
