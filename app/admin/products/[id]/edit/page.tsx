import type { Metadata } from "next";
import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateProductAction } from "@/lib/admin";
import { db } from "@/lib/db";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Update product content, pricing, SEO copy, and imagery."
};

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== Role.ADMIN) redirect("/account");

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();
  const parseList = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join(", ") : "";
    } catch {
      return "";
    }
  };

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="panel">
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: 42 }}>Edit product</h1>
          {query.error ? <div className="info-card" style={{ marginTop: 16, color: "#8f2d24" }}>{query.error}</div> : null}
          <form action={updateProductAction} style={{ display: "grid", gap: 16, marginTop: 24 }}>
            <input type="hidden" name="id" value={product.id} />
            <div className="field-grid two">
              <label><span className="field-label">Name</span><input className="input" name="name" defaultValue={product.name} required /></label>
              <label><span className="field-label">Slug</span><input className="input" name="slug" defaultValue={product.slug} required /></label>
              <label><span className="field-label">Category</span><input className="input" name="category" defaultValue={product.category} required /></label>
              <label><span className="field-label">Occasion</span><input className="input" name="occasion" defaultValue={product.occasion} required /></label>
              <label><span className="field-label">Flavor</span><input className="input" name="flavor" defaultValue={product.flavor} required /></label>
              <label><span className="field-label">Weight</span><input className="input" name="weight" defaultValue={product.weight} required /></label>
              <label><span className="field-label">Price (INR)</span><input className="input" name="priceInr" type="number" defaultValue={product.priceInr} required /></label>
              <label><span className="field-label">Badge</span><input className="input" name="badge" defaultValue={product.badge} /></label>
            </div>
            <label><span className="field-label">Tagline</span><input className="input" name="tagline" defaultValue={product.tagline} required /></label>
            <label><span className="field-label">Description</span><textarea className="textarea" name="description" defaultValue={product.description} required /></label>
            <label><span className="field-label">Detail Blurb</span><textarea className="textarea" name="detailBlurb" defaultValue={product.detailBlurb} required /></label>
            <label><span className="field-label">SEO Blurb</span><input className="input" name="seoBlurb" defaultValue={product.seoBlurb} required /></label>
            <label><span className="field-label">Replace Product Image</span><input className="input" type="file" name="image" accept="image/*" /></label>
            <label><span className="field-label">Fallback Image URL</span><input className="input" name="imageUrl" defaultValue={product.imageUrl} /></label>
            <label><span className="field-label">Gallery URLs (comma-separated)</span><textarea className="textarea" name="galleryCsv" defaultValue={parseList(product.galleryJson)} /></label>
            <label><span className="field-label">Highlights (comma-separated)</span><input className="input" name="highlightsCsv" defaultValue={parseList(product.highlightsJson)} /></label>
            <label><span className="field-label">Ingredients (comma-separated)</span><input className="input" name="ingredientsCsv" defaultValue={parseList(product.ingredientsJson)} /></label>
            <label><span className="field-label">Add-ons JSON</span><textarea className="textarea" name="addOnsJson" defaultValue={product.addOnsJson} /></label>
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="checkbox" name="eggless" defaultChecked={product.eggless} />
              Eggless available
            </label>
            <button className="button" type="submit">Save Product</button>
          </form>
        </div>
      </div>
    </main>
  );
}
