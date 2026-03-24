import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Account",
  description: "View saved addresses, reorder favorites, and manage support touchpoints."
};

export default function AccountPage() {
  return <AccountPageInner />;
}

async function AccountPageInner() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orders, requests] = await Promise.all([
    db.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    }),
    db.customCakeRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return (
    <main className="section section-soft">
      <div className="container">
        <span className="eyebrow">Account</span>
        <h1 style={{ fontSize: 64 }}>Orders, addresses, and fast reorders.</h1>
        <div className="custom-layout" style={{ marginTop: 28 }}>
          <section className="panel">
            <h3 style={{ fontSize: 30 }}>Recent Orders</h3>
            {orders.length ? orders.map((order) => (
              <article className="cart-line" key={order.id}>
                <div className="cart-line-image" style={{ background: "var(--surface-low)", display: "grid", placeItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--secondary)" }}>#{order.orderNumber.slice(-4)}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 22 }}>{order.orderNumber}</h3>
                  <p>{order.items.length} item(s) • {formatInr(order.totalInr)} • {order.status.replaceAll("_", " ")}</p>
                </div>
                <Link className="button-ghost" href={`/track-order?order=${order.orderNumber}`}>
                  Track
                </Link>
              </article>
            )) : <p style={{ marginTop: 12 }}>No orders yet. Place your first order from the shop after logging in.</p>}
          </section>
          <aside style={{ display: "grid", gap: 20 }}>
            <div className="info-card">
              <h3 style={{ fontSize: 28 }}>Saved Address</h3>
              <p style={{ marginTop: 12 }}>Mulund East, Mumbai 400081</p>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 28 }}>Wishlist Direction</h3>
              <p style={{ marginTop: 12 }}>Wishlist persistence belongs here once auth and database storage move beyond demo mode.</p>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 28 }}>Custom Requests</h3>
              {requests.length ? requests.map((request) => (
                <p key={request.id} style={{ marginTop: 10 }}>
                  {request.occasion} • {request.status} • {request.eventDate}
                </p>
              )) : <p style={{ marginTop: 12 }}>No custom cake requests yet.</p>}
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 28 }}>Support</h3>
              <p style={{ marginTop: 12 }}>Need to modify an order? Route customers toward WhatsApp and order support from this panel.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
