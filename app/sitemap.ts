import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/content";
import { getProducts } from "@/lib/catalog";
import { getAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, posts] = await Promise.all([getProducts(), getJournalEntries()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: getAbsoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: getAbsoluteUrl("/custom-cakes"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: getAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: getAbsoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: getAbsoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: getAbsoluteUrl("/track-order"), lastModified: now, changeFrequency: "weekly", priority: 0.6 }
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: getAbsoluteUrl(`/product/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: getAbsoluteUrl("/blog"),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.55
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
