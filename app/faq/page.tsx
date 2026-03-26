import type { Metadata } from "next";
import { buildPageMetadata, getAbsoluteUrl, stringifyJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Cake Delivery FAQ",
    description:
      "Answers about cake delivery in Mulund, custom cake lead times, freshness, payment options, and support for C N C customers.",
    path: "/faq",
    keywords: ["cake delivery FAQ Mulund", "custom cake questions Mumbai", "Mulund cake shop support"]
  })
};

const faqs = [
  ["How much notice do you need?", "Most catalog cakes work with 24-hour notice. Complex custom pieces need manual review."],
  ["Do you support COD?", "Yes. COD and online payments are both represented in the checkout flow."],
  ["Can I request eggless?", "Yes, but availability depends on product and lead time. The live rules can be added at the catalog layer later."],
  ["Do you deliver outside Mulund / Mumbai?", "This launch shape is intentionally single-city first. Expand after operations are stable."],
  ["How are custom requests priced?", "The custom flow captures budget, scale, and references. Final quote should be manual until pricing rules are mature."],
  ["Where does WhatsApp fit?", "Support, custom inquiries, and post-order help. The number and API templates are pending your inputs."]
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    })),
    url: getAbsoluteUrl("/faq")
  };

  return (
    <main className="section section-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqSchema) }}
      />
      <div className="container">
        <span className="eyebrow">FAQ</span>
        <h1 style={{ fontSize: 64 }}>Support before support tickets.</h1>
        <div className="info-grid" style={{ marginTop: 32 }}>
          {faqs.map(([question, answer]) => (
            <article className="info-card" key={question}>
              <h3 style={{ fontSize: 26 }}>{question}</h3>
              <p style={{ marginTop: 12 }}>{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
