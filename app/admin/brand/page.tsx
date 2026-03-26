import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { uploadBrandAssetAction } from "@/lib/admin";
import { db } from "@/lib/db";
import { BRAND_ASSET_TYPES } from "@/lib/db-types";

type BrandPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Brand Assets",
  description: "Upload logos and posters for the storefront."
};

export default async function BrandPage({ searchParams }: BrandPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/brand");
  if (session.user.role !== "ADMIN") redirect("/account");
  const params = await searchParams;
  let assets: Awaited<ReturnType<typeof db.brandAsset.findMany>> = [];
  let dataWarning: string | null = null;

  try {
    assets = await db.brandAsset.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("admin brand assets lookup failed", error);
    dataWarning = "Brand assets could not be loaded right now. Upload controls remain available.";
  }

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: 42 }}>Upload brand assets</h1>
      </div>
      {params.error ? <div className="info-card" style={{ color: "#8f2d24" }}>{params.error}</div> : null}
      {dataWarning ? <div className="info-card" style={{ color: "#8f2d24" }}>{dataWarning}</div> : null}
      <form action={uploadBrandAssetAction} style={{ display: "grid", gap: 16, marginTop: 8 }}>
        <label><span className="field-label">Asset Label</span><input className="input" name="label" placeholder='Main logo' /></label>
        <label><span className="field-label">Type</span><select className="select" name="type" defaultValue={BRAND_ASSET_TYPES[0]}><option value={BRAND_ASSET_TYPES[0]}>Logo</option><option value={BRAND_ASSET_TYPES[1]}>Poster</option></select></label>
        <label><span className="field-label">Image</span><input className="input" type="file" name="image" accept="image/*" required /></label>
        <button className="button" type="submit">Upload Asset</button>
      </form>
      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {assets.map((asset) => (
          <div className="info-card" key={asset.id}>
            <strong>{asset.label}</strong>
            <p>{asset.type}</p>
            <p className="subtle">{asset.imageUrl}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
