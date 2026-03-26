import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCart } from "@/app/actions";
import { formatInr } from "@/lib/storefront-data";
import { getProductBySlug } from "@/lib/catalog";
import { getProductReviews } from "@/lib/reviews";
import { getAbsoluteUrl, stringifyJsonLd } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }

  const url = await getAbsoluteUrl(`/product/${product.slug}`);
  const description = `${product.seoBlurb} Order from C "N" C Cakes "N" Chocolates for delivery across Mumbai with Porter-supported fulfillment.`;

  return {
    title: product.name,
    description,
    keywords: [
      `${product.name} Mumbai`,
      `${product.flavor} cake Mumbai`,
      `${product.category} delivery Mumbai`,
      "cakes in Mumbai",
      "cakes and chocolates in Mumbai"
    ],
    alternates: {
      canonical: `/product/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url,
      images: [{ url: product.image, alt: product.name }]
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.image]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image, ...product.gallery],
    description: product.detailBlurb,
    sku: product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: 'C "N" C Cakes "N" Chocolates'
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.priceInr,
      availability: "https://schema.org/InStock",
      url: await getAbsoluteUrl(`/product/${product.slug}`),
      seller: {
        "@type": "Organization",
        name: 'C "N" C Cakes "N" Chocolates'
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews
    }
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: await getAbsoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: await getAbsoluteUrl("/shop")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: await getAbsoluteUrl(`/product/${product.slug}`)
      }
    ]
  };

  return (
    <main className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd([productSchema, breadcrumbSchema]) }}
      />
      <div className="container product-layout">
        <section className="panel">
          <div className="product-breadcrumbs">
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <span>{product.category}</span>
          </div>
          <div className="gallery-main">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 720px) 100vw, (max-width: 1080px) 56vw, 50vw" />
          </div>
          <div className="gallery-thumb-row">
            {product.gallery.map((src) => (
              <div className="gallery-thumb" key={src}>
                <Image src={src} alt="" fill sizes="(max-width: 720px) 25vw, (max-width: 1080px) 18vw, 16vw" />
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

          <div className="service-strip product-service-strip" style={{ marginTop: 24 }}>
            <div>
              <strong>Best for</strong>
              <p>{product.occasion} celebrations, gifting, and customers who want a polished signature without a long briefing cycle.</p>
            </div>
            <div>
              <strong>Need a variation?</strong>
              <p>Use the custom brief if you need a different finish, size direction, or a theme-led version of this design.</p>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: 24 }}>
            <article className="info-card">
              <h3 className="compact-card-title">Why this works in Mumbai</h3>
              <p style={{ marginTop: 8 }}>
                This product page is structured for Mumbai cake buyers who need fast clarity on flavor, finish, timing, and delivery support without switching to a separate chat thread.
              </p>
            </article>
            <article className="info-card">
              <h3 className="compact-card-title">When to choose custom instead</h3>
              <p style={{ marginTop: 8 }}>
                If the order needs a theme, toppers, references, unusual servings, or a more sculpted finish, move to the custom cakes flow rather than forcing a standard product into a bespoke brief.
              </p>
            </article>
            <article className="info-card">
              <h3 className="compact-card-title">Local trust signals</h3>
              <p style={{ marginTop: 8 }}>
                Customers can track orders after checkout, use WhatsApp for support, and review delivered products from the account area, which makes the storefront more accountable than a catalogue-only bakery page.
              </p>
            </article>
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

          <div className="service-strip" style={{ marginTop: 26 }}>
            <div>
              <strong>Explore related search paths</strong>
              <p>
                <Link href="/cakes-in-mumbai">Cakes in Mumbai</Link> • <Link href="/birthday-cakes-in-mumbai">Birthday cakes in Mumbai</Link> • <Link href="/chocolates-in-mumbai">Chocolates in Mumbai</Link>
              </p>
            </div>
            <div>
              <strong>Need delivery or support info?</strong>
              <p>
                <Link href="/delivery-policy">Delivery policy</Link> • <Link href="/contact">Contact C N C</Link> • <Link href="/track-order">Track order</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
