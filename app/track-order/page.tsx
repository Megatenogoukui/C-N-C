import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getWhatsAppUrl } from "@/lib/business";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/lib/db-types";

type TrackingPageProps = {
  searchParams: Promise<{ order?: string; payment?: string }>;
};

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your cake order through confirmation, baking, dispatch, and delivery."
};

const TRACKING_STAGES: Array<{
  key: Exclude<OrderStatus, "CANCELLED">;
  title: string;
  copy: string;
}> = [
  {
    key: "PENDING",
    title: "Pending",
    copy: "Your order is received and waiting for kitchen confirmation."
  },
  {
    key: "ACCEPTED",
    title: "Accepted",
    copy: "The team has reviewed your order and reserved a production slot."
  },
  {
    key: "BAKING",
    title: "Baking",
    copy: "Your cake is now in preparation with decor and finishing underway."
  },
  {
    key: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    copy: "Your order has left the kitchen and is on the way."
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    copy: "The order has reached you. We hope the celebration went beautifully."
  }
];

const TRACKING_ORDER: OrderStatus[] = ["PENDING", "ACCEPTED", "BAKING", "OUT_FOR_DELIVERY", "DELIVERED"];

export default async function TrackOrderPage({ searchParams }: TrackingPageProps) {
  noStore();
  const params = await searchParams;
  const order = params.order?.trim() || "";
  let orderRecord = null;
  if (order) {
    try {
      orderRecord = await db.order.findUnique({ where: { orderNumber: order } });
    } catch (error) {
      console.error("track order lookup failed", error);
    }
  }
  const activeIndex = orderRecord ? TRACKING_ORDER.indexOf(orderRecord.status) : 0;
  const isCancelled = orderRecord?.status === "CANCELLED";

  return (
    <main className="section">
      <div className="container tracking-shell">
        <span className="eyebrow">Track Order</span>
        <div className="tracking-card">
          {order ? (
            <>
              <h1 style={{ fontSize: 56 }}>Order {order}</h1>
              <p className="lead" style={{ marginTop: 16 }}>
                Follow the order from review to delivery. Each stage unlocks only when the team moves your order forward.
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
              ) : (
                <div className="info-card" style={{ marginTop: 20 }}>
                  We could not find a live order for that number. Please check the order number and try again, or contact WhatsApp support for a manual update.
                </div>
              )}
              {isCancelled ? (
                <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
                  This order has been cancelled. Please contact WhatsApp support if you need clarification or a replacement order.
                </div>
              ) : null}
              <div className="service-strip" style={{ marginTop: 20 }}>
                <div>
                  <strong>Status updates</strong>
                  <p>Tracking changes only after the kitchen or admin team updates the order manually.</p>
                </div>
                <div>
                  <strong>Need intervention?</strong>
                  <p>Use WhatsApp support for delivery notes, address corrections, or payment clarification.</p>
                </div>
              </div>
              {orderRecord ? (
                <div className="tracking-grid">
                  {TRACKING_STAGES.map((stage, index) => {
                    const state = isCancelled
                      ? index === 0
                        ? "tracking-step-cancelled"
                        : "tracking-step-upcoming"
                      : index < activeIndex
                        ? "tracking-step-complete"
                        : index === activeIndex
                          ? "tracking-step-current"
                          : "tracking-step-upcoming";

                    return (
                      <div className={`tracking-step ${state}`} key={stage.key}>
                        <strong>{stage.title}</strong>
                        <p style={{ marginTop: 10 }}>{stage.copy}</p>
                        {!isCancelled && index === activeIndex ? <span className="tracking-step-label">Current stage</span> : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 56 }}>Track your order</h1>
              <p className="lead" style={{ marginTop: 16 }}>
                Enter your order number from checkout or the account page to view its delivery progress and payment status.
              </p>
              <div className="info-card" style={{ marginTop: 20 }}>
                No order number was provided yet. Open an order from your account history or use the tracking link from checkout confirmation.
              </div>
              <div className="cta-row" style={{ marginTop: 20 }}>
                <Link className="button" href="/account/orders">
                  View My Orders
                </Link>
                <Link className="button-ghost" href={getWhatsAppUrl("Hello C N C, I need help tracking my order.")}>
                  WhatsApp Support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
