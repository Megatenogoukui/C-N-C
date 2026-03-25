import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateProfileAction } from "@/lib/auth-actions";
import { db } from "@/lib/db";
import type { OrderWithItemsRecord } from "@/lib/db-types";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Account",
  description: "View saved addresses, reorder favorites, and manage support touchpoints."
};

type AccountPageProps = {
  searchParams: Promise<{ error?: string; updated?: string }>;
};

export default function AccountPage({ searchParams }: AccountPageProps) {
  return <AccountPageInner searchParams={searchParams} />;
}

async function AccountPageInner({ searchParams }: AccountPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const params = await searchParams;

  const [orders, requests] = await Promise.all([
    db.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    }) as Promise<OrderWithItemsRecord[]>,
    db.customCakeRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return (
    <main className="section section-soft">
      <div className="container account-page">
        <section className="account-topbar">
          <div className="account-intro">
            <span className="eyebrow">Account</span>
            <h1 className="account-title">My Account</h1>
            <p className="lead account-intro-copy" style={{ marginTop: 14 }}>
              Manage personal details, review orders, and keep custom cake conversations in one clean dashboard.
            </p>
          </div>
          <div className="account-hero-meta">
            <div className="account-stat">
              <span>Signed in</span>
              <strong>{user.name || "Customer"}</strong>
              <p>{user.email}</p>
            </div>
            <div className="account-stat">
              <span>Support</span>
              <strong>WhatsApp concierge</strong>
              <p>Order tracking and delivery help</p>
            </div>
          </div>
        </section>

        {params.error ? <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>{params.error}</div> : null}
        {params.updated ? <div className="info-card" style={{ marginTop: 20, color: "#21543d" }}>Profile updated successfully.</div> : null}

        <div className="account-shell" style={{ marginTop: 24 }}>
          <div style={{ display: "grid", gap: 20 }}>
            <section className="account-card account-card-form">
              <div className="account-card-header">
                <div>
                  <h2>Personal Details</h2>
                  <p>These details prefill checkout and help the team confirm delivery without extra follow-up.</p>
                </div>
              </div>
              <form action={updateProfileAction} className="account-form">
                <div className="field-grid two">
                  <label>
                    <span className="field-label">Full Name</span>
                    <input className="input" name="name" defaultValue={user.name || ""} required />
                  </label>
                  <label>
                    <span className="field-label">Phone</span>
                    <input className="input" name="phone" defaultValue={user.phone || ""} required />
                  </label>
                </div>
                <div className="field-grid two">
                  <label>
                    <span className="field-label">Email</span>
                    <input className="input" value={user.email || ""} disabled />
                  </label>
                  <label>
                    <span className="field-label">Pincode</span>
                    <input className="input" name="pincode" defaultValue={user.pincode || ""} required />
                  </label>
                </div>
                <label>
                  <span className="field-label">Address</span>
                  <textarea className="textarea" name="address" defaultValue={user.address || ""} required />
                </label>
                <div className="account-form-footer">
                  <p className="subtle">Keep these details current so checkout stays fast and support can confirm delivery quickly.</p>
                  <button className="button" type="submit">Save Details</button>
                </div>
              </form>
            </section>

            <section className="account-card">
              <div className="account-card-header">
                <div>
                  <h2>Past Orders</h2>
                  <p>View your full order history, delivery details, payment mode, and track any order again.</p>
                </div>
              </div>
              {orders.length ? (
                <div className="account-history-list">
                  {orders.map((order: (typeof orders)[number]) => (
                    <article className="account-history-card" key={`history-${order.id}`}>
                      <div className="account-history-header">
                        <div>
                          <strong>{order.orderNumber}</strong>
                          <p className="subtle" style={{ marginTop: 6 }}>
                            {order.deliveryDate} • {order.deliverySlot} • {order.paymentMode} • {order.paymentStatus.replaceAll("_", " ")}
                          </p>
                        </div>
                        <span className="badge">{order.status.replaceAll("_", " ")}</span>
                      </div>
                      <p style={{ marginTop: 10 }}>{order.firstName} {order.lastName} • {order.address} • {order.pincode}</p>
                      <ul className="compact-list">
                        {order.items.map((item) => (
                          <li key={item.id}>{item.productName} × {item.quantity} • {formatInr(item.priceInr * item.quantity)}</li>
                        ))}
                      </ul>
                      <div className="pill-list" style={{ marginTop: 14 }}>
                        <Link className="button-small" href={`/track-order?order=${order.orderNumber}`}>Track this order</Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="account-empty">
                  <p>No past orders yet. Once you place an order, the full order history will appear here.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="account-sidebar">
            <section className="account-card">
              <div className="account-card-header">
                <div>
                  <h2>Recent Orders</h2>
                  <p>Track your latest purchases and jump back into checkout quickly.</p>
                </div>
                <Link className="account-card-action" href="/shop">
                  Shop now
                </Link>
              </div>
              {orders.length ? (
                <div className="account-order-list">
                  {orders.map((order: (typeof orders)[number]) => (
                    <article className="account-order-row" key={order.id}>
                      <div className="account-order-badge">#{order.orderNumber.slice(-4)}</div>
                      <div>
                        <h3>{order.orderNumber}</h3>
                        <p>{order.items.length} item(s) • {formatInr(order.totalInr)}</p>
                        <p className="subtle" style={{ marginTop: 4 }}>{order.status.replaceAll("_", " ")}</p>
                      </div>
                      <Link className="button-ghost" href={`/track-order?order=${order.orderNumber}`}>
                        Track
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="account-empty">
                  <p>No orders yet. Place your first order from the shop and it will appear here for tracking and reorders.</p>
                </div>
              )}
            </section>

            <section className="account-card">
              <div className="account-card-header">
                <div>
                  <h2>Custom Requests</h2>
                  <p>Your recent custom cake conversations and their current status.</p>
                </div>
                <Link className="account-card-action" href="/custom-cakes">
                  New request
                </Link>
              </div>
              {requests.length ? (
                <div className="account-request-list">
                  {requests.map((request: (typeof requests)[number]) => (
                    <article className="account-request-row" key={request.id}>
                      <strong>{request.occasion}</strong>
                      <p>{request.eventDate}</p>
                      <span className="badge" style={{ marginTop: 8 }}>{request.status}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="account-empty">
                  <p>No custom cake requests yet. Start one from the bespoke ordering page whenever you need a personalized design.</p>
                </div>
              )}
            </section>

            <section className="account-card">
              <div className="account-card-header">
                <div>
                  <h2>Support</h2>
                  <p>Need to update an order or confirm delivery details?</p>
                </div>
              </div>
              <div className="pill-list" style={{ marginTop: 6 }}>
                <Link className="button-ghost" href="https://wa.me/919920554660" target="_blank">
                  WhatsApp support
                </Link>
                <Link className="button-ghost" href="/track-order">
                  Track order
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
