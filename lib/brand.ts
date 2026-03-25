import { db } from "@/lib/db";
import { withTimeout } from "@/lib/with-timeout";

export async function getBrandAssets() {
  try {
    const assets = await withTimeout(
      db.brandAsset.findMany({ orderBy: { createdAt: "desc" } }),
      1200,
      "brand assets lookup"
    );
    return {
      logo: assets.find((asset) => asset.type === "LOGO"),
      poster: assets.find((asset) => asset.type === "POSTER")
    };
  } catch (error) {
    console.error("brand assets lookup failed", error);
    return {
      logo: null,
      poster: null
    };
  }
}
