import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/app/actions";
import { formatInr } from "@/lib/storefront-data";
import type { StoreProduct } from "@/lib/catalog";

export function ProductCard({
  product,
  redirectTo = "/cart"
}: {
  product: StoreProduct;
  redirectTo?: string;
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 26vw" />
      </div>
      <div className="product-card-body">
        <span className="badge">{product.badge}</span>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 10, alignItems: "flex-start" }}>
          <div>
            <h3 style={{ fontSize: 20, lineHeight: 1.1 }}>{product.name}</h3>
            <p className="subtle">
              {product.flavor} • {product.weight}
            </p>
          </div>
          <strong className="price">{formatInr(product.priceInr)}</strong>
        </div>
        <p style={{ marginTop: 8, fontSize: 14 }}>{product.tagline}</p>
        <div className="cta-row" style={{ marginTop: 14 }}>
          <Link className="button-ghost" href={`/product/${product.slug}`}>
            View Cake
          </Link>
          <form action={addToCart}>
            <input type="hidden" name="slug" value={product.slug} />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button className="button" type="submit">
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export function CollectionCard({
  name,
  intro,
  image
}: {
  name: string;
  intro: string;
  image: string;
}) {
  return (
    <Link href={`/shop?occasion=${encodeURIComponent(name)}`} className="collection-card">
      <Image src={image} alt={name} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 22vw" />
      <div className="collection-card-content">
        <h3 style={{ fontSize: 24 }}>{name}</h3>
        <p style={{ marginTop: 6, fontSize: 14 }}>{intro}</p>
      </div>
    </Link>
  );
}
