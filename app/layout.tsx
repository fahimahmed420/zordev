import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Interactions } from "@/components/layout/Interactions";
import { UtmCapture } from "@/components/layout/UtmCapture";
import { site } from "@/content/site";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Zordev, web development studio", template: "%s | Zordev, web development studio" },
  description: site.description,
  applicationName: "Zordev",
  openGraph: { siteName: "Zordev", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0c0c0c" };

const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Interactions />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <UtmCapture />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        {umamiId && (
          <Script src="https://cloud.umami.is/script.js" data-website-id={umamiId} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
