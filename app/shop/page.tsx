import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/cards";
import { getProducts } from "@/lib/catalog";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

type ShopPageProps = {
  searchParams: Promise<{
    occasion?: string;
    flavor?: string;
    eggless?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();

  return buildPageMetadata({
    title: "Shop Cakes in Mumbai",
    description:
      'Browse birthday cakes, chocolate cakes, eggless cakes, brownies, and celebration favourites for Mumbai delivery from C "N" C Cakes "N" Chocolates.',
    path: "/shop",
    keywords: ["shop cakes in Mumbai", "chocolate cake Mumbai", "eggless cake Mumbai"],
    origin
  });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = await searchParams;
  const filtered = await getProducts({
    occasion: filters.occasion,
    flavor: filters.flavor,
    eggless: filters.eggless === "1"
  });

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Shop</span>
        <h1 style={{ fontSize: 68 }}>Our Collections</h1>
        <p className="lead" style={{ marginTop: 18 }}>
          Discover occasion-led cakes, gift-ready signatures, and quick-order favorites crafted for trusted local delivery.
        </p>
        <div className="hero-pill-row" style={{ marginTop: 22 }}>
          <Link href="/shop?occasion=Birthday" className="story-pill">Birthday</Link>
          <Link href="/shop?occasion=Anniversary" className="story-pill">Anniversary</Link>
          <Link href="/shop?occasion=Chocolate" className="story-pill">Chocolate</Link>
          <Link href="/shop?eggless=1" className="story-pill">Eggless</Link>
          <Link href="/custom-cakes" className="story-pill">Need custom?</Link>
        </div>
      </div>

      <div className="container shop-layout" style={{ marginTop: 28 }}>
        <aside className="panel shop-filter-panel">
          <h3 style={{ fontSize: 26 }}>Refine</h3>
          <p className="subtle" style={{ marginTop: 10 }}>
            Narrow the catalog only after you have landed on the right occasion. If nothing fits cleanly, switch to the custom brief.
          </p>
          <form action="/shop" method="get" style={{ display: "grid", gap: 24, marginTop: 20 }}>
            <div>
              <label className="field-label">Occasion</label>
              <select className="select" name="occasion" defaultValue={filters.occasion ?? ""}>
                <option value="">All</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Chocolate">Chocolate</option>
              </select>
            </div>
            <div>
              <label className="field-label">Flavor</label>
              <select className="select" name="flavor" defaultValue={filters.flavor ?? ""}>
                <option value="">All</option>
                <option value="Belgian Chocolate">Belgian Chocolate</option>
                <option value="Fresh Fruit">Fresh Fruit</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Madagascar Vanilla">Madagascar Vanilla</option>
              </select>
            </div>
            <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input defaultChecked={filters.eggless === "1"} name="eggless" type="checkbox" value="1" />
              Eggless-ready only
            </label>
            <button className="button" type="submit">
              Apply Filters
            </button>
          </form>
          <div className="info-card" style={{ marginTop: 18 }}>
            <strong>Ordering tip</strong>
            <p style={{ marginTop: 8 }}>
              For birthdays and gifting, the catalog is the fastest route. For themes, sculpted cakes, or design-heavy references, use the custom cake form.
            </p>
          </div>
        </aside>

        <section className="product-grid">
          {filtered.length > 0 ? (
            filtered.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="info-card">
              <h3>No cakes matched this filter set.</h3>
              <p style={{ marginTop: 12 }}>
                Reset one or two filters. For anything more specialized, use the custom cake inquiry flow instead of forcing the catalog.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
