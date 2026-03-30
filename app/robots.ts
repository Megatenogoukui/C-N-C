import type { MetadataRoute } from "next";
import { getConfiguredSiteOrigin } from "@/lib/seo";

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const origin = getConfiguredSiteOrigin();

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
