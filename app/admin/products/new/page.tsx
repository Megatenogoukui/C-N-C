import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createProductAction } from "@/lib/admin";

type NewProductPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "New Product",
  description: "Create products with image upload, pricing, SEO copy, and add-on metadata."
};

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/products/new");
  if (session.user.role !== "ADMIN") redirect("/account");
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="panel">
          <span className="eyebrow">Admin</span>
          <h1 style={{ fontSize: 42 }}>Create a product</h1>
          {params.error ? <div className="info-card" style={{ marginTop: 16, color: "#8f2d24" }}>{params.error}</div> : null}
          <form action={createProductAction} style={{ display: "grid", gap: 16, marginTop: 24 }}>
            <div className="field-grid two">
              <label><span className="field-label">Name</span><input className="input" name="name" required /></label>
              <label><span className="field-label">Slug</span><input className="input" name="slug" required /></label>
              <label><span className="field-label">Category</span><input className="input" name="category" required /></label>
              <label><span className="field-label">Occasion</span><input className="input" name="occasion" required /></label>
              <label><span className="field-label">Flavor</span><input className="input" name="flavor" required /></label>
              <label><span className="field-label">Weight</span><input className="input" name="weight" required /></label>
              <label><span className="field-label">Price (INR)</span><input className="input" name="priceInr" type="number" required /></label>
              <label><span className="field-label">Badge</span><input className="input" name="badge" defaultValue="Fresh Batch" /></label>
            </div>
            <label><span className="field-label">Tagline</span><input className="input" name="tagline" required /></label>
            <label><span className="field-label">Description</span><textarea className="textarea" name="description" required /></label>
            <label><span className="field-label">Detail Blurb</span><textarea className="textarea" name="detailBlurb" required /></label>
            <label><span className="field-label">SEO Blurb</span><input className="input" name="seoBlurb" required /></label>
            <label><span className="field-label">Upload Product Image</span><input className="input" type="file" name="image" accept="image/*" /></label>
            <label><span className="field-label">Fallback Image URL</span><input className="input" name="imageUrl" /></label>
            <label><span className="field-label">Gallery URLs (comma-separated)</span><textarea className="textarea" name="galleryCsv" /></label>
            <label><span className="field-label">Highlights (comma-separated)</span><input className="input" name="highlightsCsv" /></label>
            <label><span className="field-label">Ingredients (comma-separated)</span><input className="input" name="ingredientsCsv" /></label>
            <label><span className="field-label">Add-ons JSON</span><textarea className="textarea" name="addOnsJson" defaultValue='[{"name":"Candles","priceInr":120}]' /></label>
            <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input type="checkbox" name="eggless" />
              Eggless available
            </label>
            <button className="button" type="submit">Create Product</button>
          </form>
        </div>
      </div>
    </main>
  );
}
