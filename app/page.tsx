import {
  BestsellerSection,
  CollectionSection,
  CustomCtaSection,
  HomeHero,
  JourneySection,
  ReviewsSection,
  StorySection
} from "@/components/sections";
import { getProducts } from "@/lib/catalog";
import { buildPageMetadata, getAbsoluteUrl, getLocalBusinessSchema, getSiteOrigin, stringifyJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  const origin = await getSiteOrigin();

  return buildPageMetadata({
    title: "Cakes in Mulund | Cakes N Chocolates",
    description:
      'C "N" C is a Mulund East cakes and chocolates brand for birthday cakes, brownies, cupcakes, and custom celebration cakes with local delivery across Mumbai serviceable pincodes.',
    path: "/",
    keywords: [
      "cakes in Mulund East Mumbai",
      "cakes and chocolates in Mulund",
      "birthday cake delivery Mulund",
      "homemade chocolates Mulund"
    ],
    origin
  });
}

export default async function HomePage() {
  const products = await getProducts();
  const localBusinessSchema = getLocalBusinessSchema();
  const pageUrl = await getAbsoluteUrl("/");
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cakes and chocolates in Mulund",
    url: pageUrl,
    description:
      'C "N" C is a Mulund East cakes and chocolates brand for birthday cakes, brownies, cupcakes, and custom celebration cakes with local delivery across Mumbai serviceable pincodes.',
    about: [
      "Birthday cakes in Mulund",
      "Custom cakes in Mulund East",
      "Homemade chocolates in Mumbai"
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd([localBusinessSchema, webPageSchema]) }}
      />
      <HomeHero />
      <section className="section">
        <div className="container">
          <div className="content-split" style={{ alignItems: "start" }}>
            <div className="content-stack">
              <span className="eyebrow">Mulund Search Intent</span>
              <h2>Cakes, chocolates, and custom celebration orders for Mulund East.</h2>
              <p className="lead" style={{ marginTop: 18 }}>
                People searching for cakes in Mulund usually need one of three things fast: a reliable birthday cake, a thoughtful cakes-and-chocolates gift, or a custom cake that does not collapse into WhatsApp chaos. This storefront is built around those exact paths.
              </p>
            </div>
            <div className="info-grid">
              <article className="info-card">
                <h3 style={{ fontSize: 24 }}>Birthday cakes in Mulund</h3>
                <p style={{ marginTop: 10 }}>
                  Signature catalog cakes handle the quick-order path with delivery-slot clarity, message-on-cake inputs, and tracked status after checkout.
                </p>
              </article>
              <article className="info-card">
                <h3 style={{ fontSize: 24 }}>Cakes and chocolates together</h3>
                <p style={{ marginTop: 10 }}>
                  Brownies, cupcakes, and chocolates sit alongside cakes so gifting orders feel complete instead of forcing customers into multiple vendors.
                </p>
              </article>
              <article className="info-card">
                <h3 style={{ fontSize: 24 }}>Custom cakes in Mulund East</h3>
                <p style={{ marginTop: 10 }}>
                  The bespoke brief captures theme, servings, budget, and event timing before the team follows up, which is stronger than a vague inquiry form.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <StorySection />
      <CollectionSection />
      <BestsellerSection products={products} />
      <CustomCtaSection />
      <ReviewsSection />
      <JourneySection />
    </main>
  );
}
