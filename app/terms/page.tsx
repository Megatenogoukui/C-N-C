import type { Metadata } from "next";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();
  return buildPageMetadata({
    title: "Terms of Service",
    description: "Terms of service for ordering cakes, chocolates, and custom products from C N C Cakes N Chocolates.",
    path: "/terms",
    keywords: ["cake shop terms", "custom cake order terms"],
    origin
  });
}

export default function TermsPage() {
  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="eyebrow">Policy</span>
        <h1 style={{ fontSize: 56 }}>Terms of Service</h1>
        <div className="content-stack" style={{ gap: 18, marginTop: 28 }}>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>Order acceptance</h2>
            <p style={{ marginTop: 12 }}>Orders are confirmed only after the business accepts them and the required payment status or COD flow is in place.</p>
          </div>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>Custom cake requests</h2>
            <p style={{ marginTop: 12 }}>Custom inquiries are reviewed manually. Submission of a brief does not guarantee acceptance until feasibility, pricing, and timing are confirmed.</p>
          </div>
          <div className="info-card">
            <h2 style={{ fontSize: 26 }}>Delivery commitments</h2>
            <p style={{ marginTop: 12 }}>Delivery windows are operational targets, not guarantees against external delays. Customers should provide clear address and contact information.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
