import type { Metadata } from "next";
import { ProductCard } from "@/components/cards";
import { getProducts } from "@/lib/catalog";

type ShopPageProps = {
  searchParams: Promise<{
    occasion?: string;
    flavor?: string;
    eggless?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse premium cakes by occasion, flavor, and dietary preference."
};

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
          Discover occasion-led cakes, editorial signatures, gift-ready combinations, and premium flavors crafted for one-city luxury delivery.
        </p>
      </div>

      <div className="container shop-layout" style={{ marginTop: 28 }}>
        <aside className="panel">
          <h3 style={{ fontSize: 26 }}>Refine</h3>
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
