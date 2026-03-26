import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/content";
import { getProducts } from "@/lib/catalog";
import { getAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, posts] = await Promise.all([getProducts(), getJournalEntries()]);
  const [
    homeUrl,
    shopUrl,
    customUrl,
    aboutUrl,
    faqUrl,
    blogUrl,
    trackUrl
  ] = await Promise.all([
    getAbsoluteUrl("/"),
    getAbsoluteUrl("/shop"),
    getAbsoluteUrl("/custom-cakes"),
    getAbsoluteUrl("/about"),
    getAbsoluteUrl("/faq"),
    getAbsoluteUrl("/blog"),
    getAbsoluteUrl("/track-order")
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: homeUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: shopUrl, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: customUrl, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: aboutUrl, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: faqUrl, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: blogUrl, lastModified: now, changeFrequency: "weekly", priority: 0.65 },
    { url: trackUrl, lastModified: now, changeFrequency: "weekly", priority: 0.6 }
  ];

  const productUrls = await Promise.all(products.map((product) => getAbsoluteUrl(`/product/${product.slug}`)));
  const productRoutes: MetadataRoute.Sitemap = products.map((product, index) => ({
    url: productUrls[index],
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  const postUrls = await Promise.all(posts.map((post) => getAbsoluteUrl(`/blog/${post.slug}`)));
  const postRoutes: MetadataRoute.Sitemap = posts.map((post, index) => ({
    url: postUrls[index],
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.55
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
