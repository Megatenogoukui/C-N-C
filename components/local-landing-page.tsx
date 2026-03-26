import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, getSiteOrigin, stringifyJsonLd } from "@/lib/seo";
import { getLocalLandingPage } from "@/lib/local-seo";

export async function getLocalLandingMetadata(slug: string): Promise<Metadata> {
  const page = getLocalLandingPage(slug);
  const origin = await getSiteOrigin();

  if (!page) {
    return { title: "Page not found" };
  }

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: page.keywords,
    origin
  });
}

export function LocalLandingPage({ slug }: { slug: string }) {
  const page = getLocalLandingPage(slug);

  if (!page) {
    return null;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <main className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqSchema) }}
      />
      <div className="container">
        <span className="eyebrow">Mulund Landing Page</span>
        <h1 style={{ fontSize: 62 }}>{page.heading}</h1>
        <p className="lead" style={{ marginTop: 18, maxWidth: 860 }}>
          {page.lead}
        </p>
        <div className="cta-row" style={{ marginTop: 26 }}>
          <Link className="button" href={page.primaryCta.href}>
            {page.primaryCta.label}
          </Link>
          <Link className="button-ghost" href={page.secondaryCta.href}>
            {page.secondaryCta.label}
          </Link>
        </div>

        <div className="info-grid" style={{ marginTop: 32 }}>
          {page.sections.map((section) => (
            <article className="info-card" key={section.title}>
              <h2 style={{ fontSize: 28 }}>{section.title}</h2>
              <p style={{ marginTop: 12 }}>{section.body}</p>
            </article>
          ))}
        </div>

        <section className="section section-soft" style={{ marginTop: 34, borderRadius: "var(--radius)" }}>
          <div className="container" style={{ width: "100%", padding: 0 }}>
            <span className="eyebrow">Frequently Asked</span>
            <h2 style={{ fontSize: 42, marginTop: 10 }}>Questions buyers usually ask first.</h2>
            <div className="info-grid" style={{ marginTop: 24 }}>
              {page.faq.map((item) => (
                <article className="info-card" key={item.question}>
                  <h3 style={{ fontSize: 24 }}>{item.question}</h3>
                  <p style={{ marginTop: 10 }}>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="service-strip" style={{ marginTop: 28 }}>
          <div>
            <strong>Explore the full storefront</strong>
            <p>Use the shop for ready-to-order products, the custom brief for design-heavy orders, and order tracking for post-purchase clarity.</p>
          </div>
          <div>
            <strong>Internal paths that matter</strong>
            <p>
              <Link href="/shop">Shop</Link> • <Link href="/custom-cakes">Custom Cakes</Link> • <Link href="/blog">Journal</Link> • <Link href="/faq">FAQ</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
