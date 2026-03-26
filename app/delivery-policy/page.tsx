import type { Metadata } from "next";
import { businessConfig } from "@/lib/business";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();
  return buildPageMetadata({
    title: "Delivery Policy",
    description: "Delivery slots, serviceable pincodes, support expectations, and order timing policy for C N C cakes and chocolates.",
    path: "/delivery-policy",
    keywords: ["cake delivery policy Mulund", "Mulund delivery slots cake shop"],
    origin
  });
}

export default function DeliveryPolicyPage() {
  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="eyebrow">Policy</span>
        <h1 style={{ fontSize: 56 }}>Delivery Policy</h1>
        <div className="info-grid" style={{ marginTop: 28 }}>
          <article className="info-card">
            <h2 style={{ fontSize: 26 }}>Service area</h2>
            <p style={{ marginTop: 12 }}>Orders are currently focused on {businessConfig.city} and the listed serviceable pincodes: {businessConfig.serviceablePincodes.join(", ")}.</p>
          </article>
          <article className="info-card">
            <h2 style={{ fontSize: 26 }}>Delivery windows</h2>
            <p style={{ marginTop: 12 }}>Available slots: {businessConfig.deliverySlots.join(", ")}. Orders are routed into these windows to keep production and dispatch predictable.</p>
          </article>
          <article className="info-card">
            <h2 style={{ fontSize: 26 }}>Same-day orders</h2>
            <p style={{ marginTop: 12 }}>{businessConfig.sameDayEnabled ? "Same-day orders may be accepted based on capacity." : "Same-day delivery is intentionally disabled at the storefront level unless manually confirmed."}</p>
          </article>
          <article className="info-card">
            <h2 style={{ fontSize: 26 }}>Support changes</h2>
            <p style={{ marginTop: 12 }}>For address corrections, gate instructions, or delivery clarifications after placing an order, contact WhatsApp support with the order number.</p>
          </article>
        </div>
      </div>
    </main>
  );
}
