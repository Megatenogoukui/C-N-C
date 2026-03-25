import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: {
    default: 'C "N" C | Cakes "N" Chocolates',
    template: '%s | C "N" C'
  },
  description:
    'Homemade cakes, brownies, cupcakes, chocolates, and custom treats from C "N" C (Cakes "N" Chocolates), crafted for one-city delivery and celebration orders.'
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
