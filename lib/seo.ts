import type { Metadata } from "next";
import { headers } from "next/headers";
import { businessConfig } from "@/lib/business";

const defaultSiteOrigin = "https://www.cnccakes.com";
const socialPreviewImage = "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1800&q=80";

function normalizeOrigin(value?: string | null) {
  if (!value) return null;

  const candidate = value.startsWith("http") ? value : `https://${value}`;

  try {
    return new URL(candidate).origin;
  } catch {
    return null;
  }
}

export function getConfiguredSiteOrigin() {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeOrigin(process.env.NEXTAUTH_URL) ||
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeOrigin(process.env.VERCEL_URL) ||
    defaultSiteOrigin
  );
}

export async function getSiteOrigin() {
  try {
    const headerStore = await headers();
    const forwardedHost = headerStore.get("x-forwarded-host");
    const host = forwardedHost || headerStore.get("host");
    const proto = headerStore.get("x-forwarded-proto") || "https";

    if (host) {
      return normalizeOrigin(`${proto}://${host}`) || getConfiguredSiteOrigin();
    }
  } catch {
    return getConfiguredSiteOrigin();
  }

  return getConfiguredSiteOrigin();
}

export async function getAbsoluteUrl(path = "/") {
  return new URL(path, await getSiteOrigin()).toString();
}

export function getSharedKeywords() {
  return [
    "cakes in Mulund",
    "cakes in Mulund East",
    "cakes n chocolates",
    "cakes and chocolates in Mulund",
    "chocolates in Mulund",
    "birthday cakes in Mulund",
    "custom cakes in Mulund",
    "brownies in Mulund",
    "eggless cakes in Mulund",
    "cake delivery in Mulund"
  ];
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  image = socialPreviewImage,
  origin
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  origin?: string;
}): Metadata {
  const url = new URL(path, origin || getConfiguredSiteOrigin()).toString();
  const keywordSet = [...getSharedKeywords(), ...(keywords || [])];

  return {
    title,
    description,
    keywords: keywordSet,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "en_IN",
      siteName: 'C "N" C Cakes "N" Chocolates',
      images: [{ url: image, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export function getLocalBusinessSchema() {
  const email = businessConfig.supportEmail.includes(".example") ? undefined : businessConfig.supportEmail;

  return {
    "@context": "https://schema.org",
    "@type": ["Bakery", "FoodEstablishment", "LocalBusiness"],
    name: 'C "N" C Cakes "N" Chocolates',
    alternateName: "Cakes N Chocolates",
    url: getConfiguredSiteOrigin(),
    telephone: `+${businessConfig.supportPhone}`,
    ...(email ? { email } : {}),
    areaServed: [
      {
        "@type": "City",
        name: "Mulund East"
      },
      {
        "@type": "City",
        name: "Mumbai"
      }
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mulund East",
      addressRegion: "Maharashtra",
      postalCode: businessConfig.serviceablePincodes[0],
      addressCountry: "IN"
    },
    priceRange: "$$",
    sameAs: [`https://instagram.com/${businessConfig.supportInstagram}`],
    servesCuisine: ["Cakes", "Desserts", "Chocolates", "Brownies", "Cupcakes"],
    image: socialPreviewImage
  };
}

export function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
