import type { Metadata } from "next";
import Link from "next/link";
import { businessConfig, getWhatsAppUrl } from "@/lib/business";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();

  return buildPageMetadata({
    title: "Contact C N C",
    description:
      "Contact C N C Cakes N Chocolates for cake orders, custom cake inquiries, delivery help, and WhatsApp support across Mumbai.",
    path: "/contact",
    keywords: ["contact cake shop Mumbai", "Mumbai cake support", "WhatsApp cake order Mumbai"],
    origin
  });
}

export default function ContactPage() {
  const email = businessConfig.supportEmail.includes(".example") ? null : businessConfig.supportEmail;

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h1 style={{ fontSize: 60 }}>Need help before or after ordering?</h1>
        <p className="lead" style={{ marginTop: 18, maxWidth: 780 }}>
          Use WhatsApp for the fastest response on cake selection, custom requests, delivery clarifications, and order support across Mumbai. Porter is used to help fulfill deliveries depending on the order and zone.
        </p>
        <div className="info-grid" style={{ marginTop: 30 }}>
          <article className="info-card">
            <h2 style={{ fontSize: 28 }}>WhatsApp concierge</h2>
            <p style={{ marginTop: 12 }}>Fastest route for product help, delivery notes, and custom-order direction.</p>
            <p style={{ marginTop: 16 }}>
              <Link className="button-small" href={getWhatsAppUrl("Hello C N C, I need help with an order.")}>
                Start WhatsApp Chat
              </Link>
            </p>
          </article>
          <article className="info-card">
            <h2 style={{ fontSize: 28 }}>Phone</h2>
            <p style={{ marginTop: 12 }}>+{businessConfig.supportPhone}</p>
            <p style={{ marginTop: 8 }}>Best for quick delivery confirmation and order support.</p>
          </article>
          <article className="info-card">
            <h2 style={{ fontSize: 28 }}>Service area</h2>
            <p style={{ marginTop: 12 }}>{businessConfig.city}</p>
            <p style={{ marginTop: 8 }}>Pincodes: {businessConfig.serviceablePincodes.join(", ")}</p>
          </article>
          {email ? (
            <article className="info-card">
              <h2 style={{ fontSize: 28 }}>Email</h2>
              <p style={{ marginTop: 12 }}>{email}</p>
              <p style={{ marginTop: 8 }}>Useful for detailed event briefs and longer custom references.</p>
            </article>
          ) : null}
        </div>
      </div>
    </main>
  );
}
