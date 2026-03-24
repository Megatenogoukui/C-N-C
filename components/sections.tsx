import Image from "next/image";
import Link from "next/link";
import { CollectionCard, ProductCard } from "@/components/cards";
import { collections, testimonials } from "@/lib/storefront-data";
import type { StoreProduct } from "@/lib/catalog";

export function HomeHero() {
  return (
    <section className="hero grain">
      <div className="hero-image">
        <Image
          src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1800&q=80"
          alt="Luxury floral cake"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="container hero-content">
        <span className="eyebrow">Homemade Treats • Mulund East, Mumbai</span>
        <h1>
          Homemade treats <em>for you</em>.
        </h1>
        <p className="lead" style={{ marginTop: 24 }}>
          C &quot;N&quot; C brings cakes, brownies, cupcakes, chocolates, and celebration orders together in one warm, conversion-ready storefront built for a single-city brand.
        </p>
        <div className="hero-actions" style={{ marginTop: 34 }}>
          <Link className="button" href="/shop">
            Explore Collections
          </Link>
          <Link className="button-ghost" href="/custom-cakes">
            Design a Custom Cake
          </Link>
        </div>
        <div className="stats-row">
          <div className="stats-card">
            <strong>150+</strong>
            <span className="subtle">treats crafted weekly</span>
          </div>
          <div className="stats-card">
            <strong>24h</strong>
            <span className="subtle">preorder lead for most designs</span>
          </div>
          <div className="stats-card">
            <strong>4.9/5</strong>
            <span className="subtle">customer rating across signature range</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  const highlights = [
    {
      index: "01",
      title: "Homemade, not overdesigned",
      copy: "The site should feel warm, trustworthy, and easy to buy from. Rich bakery visuals matter more than decorative complexity."
    },
    {
      index: "02",
      title: "Fast catalog, separate custom flow",
      copy: "Everyday cakes, brownies, cupcakes, and chocolates stay easy to order, while special requests follow a guided custom path."
    },
    {
      index: "03",
      title: "Clear single-city operations",
      copy: "Serviceable pincodes, delivery slots, COD support, and direct WhatsApp assistance stay visible throughout the journey."
    }
  ];

  return (
    <section className="section section-soft">
      <div className="container story-split">
        <div className="story-visuals">
          <div className="story-visual-primary">
            <Image
              src="https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh dessert cups with strawberries"
              fill
              sizes="(max-width: 1080px) 100vw, 34vw"
            />
          </div>
          <div className="story-visual-stack">
            {[
              {
                src: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
                alt: "Birthday candles on a cake"
              },
              {
                src: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80",
                alt: "Layered berry cake"
              }
            ].map((item) => (
              <div className="story-visual-secondary" key={item.src}>
                <Image src={item.src} alt={item.alt} fill sizes="(max-width: 1080px) 100vw, 22vw" />
              </div>
            ))}
          </div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">Freshly Homemade</span>
          <h2>A simpler, warmer bakery experience that feels easier to trust.</h2>
          <p className="lead" style={{ marginTop: 18 }}>
            C &quot;N&quot; C should feel like a modern neighborhood bakery with strong visuals, clear ordering, and a calmer interface, not a cluttered luxury template.
          </p>
          <div className="story-points">
            {highlights.map((item) => (
              <article className="story-point" key={item.index}>
                <div className="story-point-index">{item.index}</div>
                <div>
                  <h3 style={{ fontSize: 22 }}>{item.title}</h3>
                  <p style={{ marginTop: 8 }}>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="pill-list" style={{ marginTop: 24 }}>
            {["Brownies", "Cupcakes", "Celebration Cakes", "Eggless Options", "Custom Orders"].map((item) => (
              <span className="story-pill" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollectionSection() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Categories</span>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end", marginBottom: 8 }}>
          <h2>Curated Selections</h2>
          <Link href="/shop" className="button-ghost">
            View All Collections
          </Link>
        </div>
        <div className="collection-grid" style={{ marginTop: 20 }}>
          {collections.map((collection) => (
            <CollectionCard key={collection.name} {...collection} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestsellerSection({ products }: { products: StoreProduct[] }) {
  return (
    <section className="section section-soft">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <span className="eyebrow">Bestsellers</span>
            <h2>House Favourites</h2>
          </div>
          <Link href="/shop" className="button-small">
            Browse Full Menu
          </Link>
        </div>
        <div className="horizontal-scroll">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CustomCtaSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-panel grain">
          <div className="panel-image">
            <Image
              src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1800&q=80"
              alt="Custom cake workshop"
              fill
              sizes="100vw"
            />
          </div>
          <div className="cta-panel-content">
            <span className="eyebrow" style={{ color: "rgba(255,255,255,0.78)" }}>
              Custom Orders
            </span>
            <h2>Need a custom cake for the occasion?</h2>
            <p className="lead" style={{ color: "rgba(255,255,255,0.84)", marginTop: 20 }}>
              Use the custom cake form for theme cakes, celebration cakes, and larger order requests while keeping the everyday treats easy to buy from the catalog.
            </p>
            <div className="cta-row" style={{ marginTop: 28 }}>
              <Link className="button-secondary" href="/custom-cakes">
                Consult Our Cake Artist
              </Link>
              <Link className="button-ghost" href="/faq" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 22, maxWidth: 620, marginInline: "auto" }}>
          <span className="eyebrow">Customer Love</span>
          <h2>Social proof that still feels premium.</h2>
        </div>
        <div className="review-grid">
          {testimonials.map((testimonial) => (
            <article className="quote-card" key={testimonial.name} style={{ padding: 28 }}>
              <div style={{ color: "var(--tertiary)", marginBottom: 14 }}>★★★★★</div>
              <p style={{ fontSize: 20, color: "var(--primary)", fontStyle: "italic" }}>
                &quot;{testimonial.quote}&quot;
              </p>
              <p style={{ marginTop: 14, textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12 }}>
                {testimonial.name} • {testimonial.area}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JourneySection() {
  const steps = [
    ["01", "Curate Your Cake", "Choose from occasion-led collections, or enter the custom flow if you need a commission-led design."],
    ["02", "Select Delivery Details", "Pick your date, time window, message-on-cake, and any finishing add-ons before checkout."],
    ["03", "Track With Clarity", "From confirmation to baking to final dispatch, the order flow stays transparent and reassuring."]
  ];

  return (
    <section className="section section-soft">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 22, maxWidth: 640, marginInline: "auto" }}>
          <span className="eyebrow">Order Flow</span>
          <h2>Simple enough for quick orders, structured enough for growth.</h2>
        </div>
        <div className="journey-grid">
          {steps.map(([index, title, copy]) => (
            <article className="info-card" key={index} style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 999, display: "grid", placeItems: "center", margin: "0 auto 20px", background: "var(--surface)", border: "1px solid rgba(211, 195, 189, 0.65)", color: "var(--secondary)", fontWeight: 700 }}>
                {index}
              </div>
              <h3 style={{ fontSize: 24 }}>{title}</h3>
              <p style={{ marginTop: 10 }}>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
