import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/api/auth/"]
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin
  };
}
