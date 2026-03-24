import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/business";
import { orderStages } from "@/lib/storefront-data";
import { db } from "@/lib/db";

type TrackingPageProps = {
  searchParams: Promise<{ order?: string; payment?: string }>;
};

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your cake order through confirmation, baking, dispatch, and delivery."
};

export default async function TrackOrderPage({ searchParams }: TrackingPageProps) {
  const params = await searchParams;
  const order = params.order || "CNC-DEMO-0001";
  const orderRecord = await db.order.findUnique({ where: { orderNumber: order } });
  const activeIndex = orderRecord
    ? ["PENDING", "ACCEPTED", "BAKING", "OUT_FOR_DELIVERY", "DELIVERED"].indexOf(orderRecord.status)
    : 0;

  return (
    <main className="section">
      <div className="container tracking-shell">
        <span className="eyebrow">Track Order</span>
        <div className="tracking-card">
          <h1 style={{ fontSize: 56 }}>Order {order}</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            This flow is intentionally clear and reassuring: your order is confirmed, batched for production, and visible through the final delivery stage.
          </p>
          {params.payment === "pending" || orderRecord?.paymentStatus === "PENDING" ? (
            <div className="info-card" style={{ marginTop: 20 }}>
              Online payment is marked as pending. Until the gateway is connected, please confirm payment manually over WhatsApp support.
            </div>
          ) : null}
          {orderRecord ? (
            <div className="info-card" style={{ marginTop: 20 }}>
              <strong>Delivery:</strong> {orderRecord.deliveryDate} • {orderRecord.deliverySlot}
              <br />
              <strong>Payment:</strong> {orderRecord.paymentMode} • {orderRecord.paymentStatus.replaceAll("_", " ")}
              <br />
              <Link href={getWhatsAppUrl(`Hello C N C, I need help with order ${orderRecord.orderNumber}.`)}>
                Need support on this order?
              </Link>
            </div>
          ) : null}
          <div className="tracking-grid">
            {orderStages.map((stage, index) => (
              <div className={`tracking-step ${index <= activeIndex ? "tracking-step-active" : ""}`} key={stage}>
                <strong>{stage}</strong>
                <p style={{ marginTop: 10 }}>
                  {index === 0 && "Payment mode captured."}
                  {index === 1 && "Kitchen slot reserved."}
                  {index === 2 && "Decor team has started."}
                  {index === 3 && "Dispatch pending."}
                  {index === 4 && "Final confirmation awaits."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
