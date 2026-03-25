import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/actions";
import { formatInr } from "@/lib/storefront-data";
import { getProductBySlug } from "@/lib/catalog";
import { getProductReviews } from "@/lib/reviews";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.seoBlurb
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  return (
    <main className="section">
      <div className="container product-layout">
        <section className="panel">
          <div className="gallery-main">
            <Image src={product.image} alt={product.name} fill sizes="(max-width:1080px) 100vw, 50vw" />
          </div>
          <div className="gallery-thumb-row">
            {product.gallery.map((src) => (
              <div className="gallery-thumb" key={src}>
                <Image src={src} alt="" fill sizes="(max-width: 720px) 100vw, 16vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <span className="badge">{product.badge}</span>
          <h1 style={{ fontSize: 46, marginTop: 12 }}>{product.name}</h1>
          <p className="lead" style={{ marginTop: 18 }}>
            {product.detailBlurb}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start", marginTop: 24 }}>
            <div>
              <div style={{ color: "var(--tertiary)" }}>
                ★★★★★ <span className="subtle">({product.reviews} reviews)</span>
              </div>
              <p className="subtle" style={{ marginTop: 8 }}>
                {product.category} • {product.flavor} • {product.weight}
              </p>
            </div>
            <strong className="price" style={{ fontSize: 30 }}>
              {formatInr(product.priceInr)}
            </strong>
          </div>

          <div className="product-info-grid" style={{ marginTop: 24 }}>
            <div className="info-card">
              <h3 className="compact-card-title">Weight</h3>
              <p style={{ marginTop: 8 }}>0.5 kg, 1 kg, 1.5 kg, 2 kg available during live inventory integration.</p>
            </div>
            <div className="info-card">
              <h3 className="compact-card-title">Delivery</h3>
              <p style={{ marginTop: 8 }}>Select preferred date and slot at checkout. Same-day is intentionally disabled for now.</p>
            </div>
            <div className="info-card">
              <h3 className="compact-card-title">Add-ons</h3>
              <ul className="compact-list">
                {product.addOns.map((addOn) => (
                  <li key={addOn.name}>
                    {addOn.name} • {formatInr(addOn.priceInr)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="info-card">
              <h3 className="compact-card-title">Highlights</h3>
              <ul className="compact-list">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>

          <form action={addToCart} style={{ display: "grid", gap: 18, marginTop: 28 }}>
            <input type="hidden" name="slug" value={product.slug} />
            <input type="hidden" name="redirectTo" value="/cart" />
            <label>
              <span className="field-label">Message on Cake</span>
              <input className="input" name="message" placeholder="Happy Birthday Aarav" />
            </label>
            <div className="field-grid two">
              <label>
                <span className="field-label">Delivery Date</span>
                <input className="input" type="date" name="deliveryDate" />
              </label>
              <label>
                <span className="field-label">Delivery Slot</span>
                <select className="select" name="slot" defaultValue="4 PM - 7 PM">
                  <option>10 AM - 1 PM</option>
                  <option>1 PM - 4 PM</option>
                  <option>4 PM - 7 PM</option>
                  <option>7 PM - 10 PM</option>
                </select>
              </label>
            </div>
            <label>
              <span className="field-label">Special Instructions</span>
              <textarea className="textarea" name="instructions" placeholder="Less sweet, no nuts on top, call before delivery" />
            </label>
            <div className="cta-row">
              <button className="button" type="submit">
                Add to Cart
              </button>
              <Link className="button-ghost" href="/custom-cakes">
                Need a more custom version?
              </Link>
            </div>
          </form>

          <div className="product-review-section">
            <div className="account-card-header">
              <div>
                <h2>Customer Reviews</h2>
                <p>Recent ratings from customers who ordered this product.</p>
              </div>
            </div>
            {reviews.length ? (
              <div className="product-review-list">
                {reviews.map((review) => (
                  <article className="product-review-card" key={review.id}>
                    <div className="rating-row">
                      <strong>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</strong>
                      <span className="subtle">{review.user?.name || "Verified customer"}</span>
                    </div>
                    {review.title ? <h3 className="compact-card-title" style={{ marginTop: 10 }}>{review.title}</h3> : null}
                    {review.body ? <p style={{ marginTop: 8 }}>{review.body}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="info-card" style={{ marginTop: 18 }}>
                No customer reviews yet. Delivered orders will be able to rate this product from the account orders page.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
