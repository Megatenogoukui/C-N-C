import type { Metadata } from "next";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();
  return buildPageMetadata({
    title: "Privacy Policy",
    description: "Privacy policy for C N C Cakes N Chocolates covering account details, order data, and support communication.",
    path: "/privacy-policy",
    keywords: ["privacy policy cake shop", "customer data bakery website"],
    origin
  });
}

export default function PrivacyPolicyPage() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="eyebrow">Policy</span>
        <h1 style={{ fontSize: 56 }}>Privacy Policy</h1>
        <div className="content-stack" style={{ gap: 18, marginTop: 28 }}>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>What we collect</h2>
            <p style={{ marginTop: 12 }}>We collect the details needed to fulfill orders and support customers, including name, phone, email, delivery address, pincode, order details, and messages you provide during checkout or custom inquiries.</p>
          </div>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>Why we use it</h2>
            <p style={{ marginTop: 12 }}>This information is used to process orders, coordinate delivery, respond to support requests, and improve the customer experience across storefront and admin workflows.</p>
          </div>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>Support communication</h2>
            <p style={{ marginTop: 12 }}>If you contact the business over WhatsApp or email, those conversations may be used to resolve delivery, custom-order, payment, or product support issues.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
