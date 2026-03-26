import { db } from "@/lib/db";
import { logExpectedFallback, isBuildProcess } from "@/lib/runtime";
import { withTimeout } from "@/lib/with-timeout";

export async function getBrandAssets() {
  if (isBuildProcess()) {
    return {
      logo: null,
      poster: null
    };
  }

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
    logExpectedFallback("brand assets lookup", error);
    return {
      logo: null,
      poster: null
    };
  }
}
