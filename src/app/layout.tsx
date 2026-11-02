import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/content/config";

const DESC = "Guides, a full API reference with units explained, quickstart, recipes, webhook events and a clearly labelled simulated sandbox for the Tefo payments API.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Tefo API documentation", template: "%s · Tefo API" },
  description: DESC,
  applicationName: "Tefo API docs",
  authors: [{ name: "Zyra Tech" }],
  keywords: ["Tefo", "payments API", "M-Pesa API", "Kenya payments", "paybill", "till", "payouts", "webhooks", "Daraja", "Airtel Money", "API documentation"],
  alternates: { canonical: "/", types: { "text/markdown": "/llms.txt" } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", siteName: "Tefo API docs", locale: "en_KE", title: "Tefo API documentation", description: DESC, url: "/" },
  twitter: { card: "summary_large_image", title: "Tefo API documentation", description: DESC },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F3EBDD" }, { media: "(prefers-color-scheme: dark)", color: "#0B2B2A" }] };

// Runs before paint so the page never flashes the wrong theme.
const THEME_SCRIPT = `try{var t=new URLSearchParams(location.search).get("theme");if(t!=="light"&&t!=="dark")t=localStorage.getItem("pitisha-docs-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-surface="docs" data-theme="light" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /></head>
      <body>{children}</body>
    </html>
  );
}
