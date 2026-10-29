import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/latin-300.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitisha-api-docs.vercel.app";
const DESC = "One integration for every way Kenyans pay, and one record of every shilling, in and out. Guides, API reference and a sandbox you can try in the browser.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Pitisha API documentation", template: "%s · Pitisha API" },
  description: DESC,
  applicationName: "Pitisha API",
  authors: [{ name: "Zyra Tech" }],
  keywords: ["Pitisha", "payments API", "M-Pesa API", "Kenya payments", "paybill", "till", "payouts", "webhooks", "Daraja", "Airtel Money", "API documentation"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", siteName: "Pitisha API", locale: "en_KE", title: "Pitisha API documentation", description: DESC, url: "/" },
  twitter: { card: "summary_large_image", title: "Pitisha API documentation", description: DESC },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F4F6FA" }, { media: "(prefers-color-scheme: dark)", color: "#060E1B" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
