import { db } from "@/lib/db";

export async function getBrandAssets() {
  try {
    const assets = await db.brandAsset.findMany({ orderBy: { createdAt: "desc" } });
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
