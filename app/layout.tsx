import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: 'C "N" C | Cakes "N" Chocolates',
    template: '%s | C "N" C'
  },
  ...buildPageMetadata({
    title: 'C "N" C Cakes "N" Chocolates',
    description:
      'Order cakes, brownies, cupcakes, and chocolates in Mulund East, Mumbai from C "N" C. Discover birthday cakes, custom cakes, and local cake delivery with a premium homemade bakery feel.',
    path: "/",
    keywords: ["Mulund bakery", "Mulund East cake shop", "homemade cakes Mumbai"]
  }),
  category: "food",
  applicationName: 'C "N" C Cakes "N" Chocolates',
  authors: [{ name: 'C "N" C Cakes "N" Chocolates' }],
  creator: 'C "N" C Cakes "N" Chocolates',
  publisher: 'C "N" C Cakes "N" Chocolates',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
