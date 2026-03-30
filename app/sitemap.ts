import type { MetadataRoute } from "next";
import { getConfiguredSiteOrigin } from "@/lib/seo";
import { products as fallbackProducts } from "@/lib/storefront-data";
import { fallbackJournalEntries } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getConfiguredSiteOrigin();
  const now = new Date();
  const url = (path: string) => new URL(path, origin).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: url("/custom-cakes"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: url("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: url("/track-order"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.72 },
    { url: url("/cakes-in-mumbai"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/birthday-cakes-in-mumbai"), lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: url("/chocolates-in-mumbai"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/custom-cakes-in-mumbai"), lastModified: now, changeFrequency: "weekly", priority: 0.89 },
    { url: url("/delivery-policy"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/privacy-policy"), lastModified: now, changeFrequency: "monthly", priority: 0.35 },
    { url: url("/terms"), lastModified: now, changeFrequency: "monthly", priority: 0.35 }
  ];

  const productRoutes: MetadataRoute.Sitemap = fallbackProducts.map((product) => ({
    url: url(`/product/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  const postRoutes: MetadataRoute.Sitemap = fallbackJournalEntries.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.55
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
