import type { Metadata } from "next";
import Link from "next/link";
import { OrderStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteProductAction, updateOrderStatusAction } from "@/lib/admin";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for products, brand assets, and order management."
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== Role.ADMIN) {
    redirect("/account");
  }

  const [products, orders, assets, requests] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 10 }),
    db.brandAsset.findMany({ orderBy: { createdAt: "desc" } }),
    db.customCakeRequest.findMany({ orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Admin</span>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 48 }}>Control products, brand assets, and orders.</h1>
            <p style={{ marginTop: 12 }}>Upload logos, create products, and accept or cancel orders from one dashboard.</p>
          </div>
          <div className="cta-row">
            <Link className="button" href="/admin/products/new">New Product</Link>
            <Link className="button-ghost" href="/admin/brand">Brand Assets</Link>
            <Link className="button-ghost" href="/admin/requests">Custom Requests</Link>
          </div>
        </div>

        <div className="custom-layout" style={{ marginTop: 28 }}>
          <section style={{ display: "grid", gap: 18 }}>
            <div className="panel">
              <h3 style={{ fontSize: 26 }}>Products</h3>
              {products.map((product) => (
                <div
                  className="summary-row"
                  data-testid={`admin-product-${product.slug}`}
                  key={product.id}
                  style={{ padding: "12px 0", borderBottom: "1px solid rgba(211,195,189,0.35)" }}
                >
                  <div>
                    <span>{product.name} • {product.slug}</span>
                    <p className="subtle">{product.active ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="cta-row">
                    <strong>{formatInr(product.priceInr)}</strong>
                    <Link className="button-small" href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button className="button-small" type="submit">Archive</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
            <div className="panel">
              <h3 style={{ fontSize: 26 }}>Orders</h3>
              {orders.length ? orders.map((order) => (
                <div
                  data-testid={`admin-order-${order.orderNumber}`}
                  key={order.id}
                  style={{ borderBottom: "1px solid rgba(211,195,189,0.35)", padding: "14px 0" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div>
                      <strong>{order.orderNumber}</strong>
                      <p>{order.firstName} {order.lastName} • {order.items.length} item(s) • {formatInr(order.totalInr)}</p>
                      <p className="subtle">{order.status.replaceAll("_", " ")} • {order.paymentMode} • {order.paymentStatus.replaceAll("_", " ")}</p>
                    </div>
                    <div className="cta-row">
                      <form action={updateOrderStatusAction} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          className="select"
                          data-testid={`admin-order-status-${order.orderNumber}`}
                          name="status"
                          defaultValue={order.status}
                          style={{ minWidth: 180 }}
                        >
                          {Object.values(OrderStatus).map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                        </select>
                        <button
                          className="button-small"
                          data-testid={`admin-order-update-${order.orderNumber}`}
                          type="submit"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )) : <p style={{ marginTop: 12 }}>No orders yet.</p>}
            </div>
            <div className="panel">
              <h3 style={{ fontSize: 26 }}>Custom Requests</h3>
              {requests.length ? requests.map((request) => (
                <div
                  className="summary-row"
                  data-testid={`admin-request-summary-${request.id}`}
                  key={request.id}
                  style={{ padding: "12px 0", borderBottom: "1px solid rgba(211,195,189,0.35)" }}
                >
                  <div>
                    <span>{request.name} • {request.occasion}</span>
                    <p className="subtle">{request.status} • {request.contactPreference}</p>
                  </div>
                  <Link className="button-small" href="/admin/requests">Manage</Link>
                </div>
              )) : <p style={{ marginTop: 12 }}>No custom requests yet.</p>}
            </div>
          </section>

          <aside style={{ display: "grid", gap: 18 }}>
            <div className="info-card">
              <h3 style={{ fontSize: 24 }}>Brand Assets</h3>
              <p style={{ marginTop: 8 }}>{assets.length} uploaded asset(s)</p>
              <p className="subtle" style={{ marginTop: 8 }}>Logos and posters uploaded here can be used across the storefront shell.</p>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 24 }}>Admin Access</h3>
              <p style={{ marginTop: 8 }}>Admin-only actions are protected by the session role. OAuth users will default to customer unless you elevate them in the database.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
