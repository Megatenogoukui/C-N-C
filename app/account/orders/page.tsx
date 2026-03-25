import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { submitReview } from "@/app/actions";
import { db } from "@/lib/db";
import type { OrderWithItemsRecord } from "@/lib/db-types";
import { getCurrentUserReviewMap } from "@/lib/reviews";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View every order, track it, and leave product reviews."
};

type OrdersPageProps = {
  searchParams: Promise<{ error?: string; reviewed?: string }>;
};

export default async function AccountOrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const params = await searchParams;
  let orders: OrderWithItemsRecord[] = [];
  let reviewMap = new Map();

  try {
    [orders, reviewMap] = await Promise.all([
      db.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: "desc" }
      }) as Promise<OrderWithItemsRecord[]>,
      getCurrentUserReviewMap()
    ]);
  } catch (error) {
    console.error("account orders lookup failed", error);
  }

  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  try {
    products = await db.product.findMany({
      where: {
        id: {
          in: [...new Set(orders.flatMap((order) => order.items.map((item) => item.productId)))]
        }
      }
    });
  } catch (error) {
    console.error("account order products lookup failed", error);
  }
  const productMap = new Map(products.map((product) => [product.id, product]));

  return (
    <main className="section section-soft">
      <div className="container account-page">
        <section className="account-topbar">
          <div className="account-intro">
            <span className="eyebrow">Orders</span>
            <h1 className="account-title">All Orders</h1>
            <p className="lead account-intro-copy" style={{ marginTop: 14 }}>
              Review every order, track its current status, and leave ratings for delivered products.
            </p>
          </div>
          <div className="account-hero-meta">
            <div className="account-stat">
              <span>Total orders</span>
              <strong>{orders.length}</strong>
              <p>Customer history in one place</p>
            </div>
            <div className="account-stat">
              <span>Quick links</span>
              <strong>Track + Review</strong>
              <p>Each delivered item can be rated</p>
            </div>
          </div>
        </section>

        {params.error ? <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>{params.error}</div> : null}
        {params.reviewed ? <div className="info-card" style={{ marginTop: 20, color: "#21543d" }}>Review saved successfully.</div> : null}

        <div className="account-history-list" style={{ marginTop: 24 }}>
          {orders.length ? orders.map((order) => (
            <article className="account-history-card" key={order.id}>
              <div className="account-history-header">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <p className="subtle" style={{ marginTop: 6 }}>
                    {order.deliveryDate} • {order.deliverySlot} • {order.paymentMode} • {order.paymentStatus.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="pill-list">
                  <span className="badge">{order.status.replaceAll("_", " ")}</span>
                  <Link className="button-small" href={`/track-order?order=${order.orderNumber}`}>Track order</Link>
                </div>
              </div>
              <p style={{ marginTop: 10 }}>{order.firstName} {order.lastName} • {order.address} • {order.pincode}</p>
              <div className="account-order-detail-list">
                {order.items.map((item) => {
                  const reviewKey = `${order.id}:${item.productId}`;
                  const existingReview = reviewMap.get(reviewKey);
                  return (
                    <div className="account-order-detail-card" key={item.id}>
                      <div className="account-order-detail-head">
                        <div>
                          <strong>{item.productName}</strong>
                          <p className="subtle">{item.quantity} × {formatInr(item.priceInr)} • {formatInr(item.priceInr * item.quantity)}</p>
                        </div>
                        {productMap.get(item.productId)?.slug ? (
                          <Link className="button-ghost" href={`/product/${productMap.get(item.productId)?.slug}`}>
                            View product
                          </Link>
                        ) : null}
                      </div>
                      {order.status === "DELIVERED" ? (
                        <form action={submitReview} className="review-form">
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="productId" value={item.productId} />
                          <div className="field-grid two">
                            <label>
                              <span className="field-label">Rating</span>
                              <select className="select" name="rating" defaultValue={existingReview?.rating || 5}>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                              </select>
                            </label>
                            <label>
                              <span className="field-label">Review title</span>
                              <input className="input" defaultValue={existingReview?.title || ""} name="title" placeholder="Loved the freshness" />
                            </label>
                          </div>
                          <label>
                            <span className="field-label">Your review</span>
                            <textarea className="textarea" defaultValue={existingReview?.body || ""} name="body" placeholder="Tell other customers how it tasted, looked, and arrived." />
                          </label>
                          <button className="button-small" type="submit">{existingReview ? "Update Review" : "Save Review"}</button>
                        </form>
                      ) : (
                        <p className="subtle" style={{ marginTop: 12 }}>Reviews unlock after the order is marked delivered.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          )) : (
            <div className="account-empty">
              <p>No orders yet. Once you place an order, this page will show the full history with tracking and review options.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
