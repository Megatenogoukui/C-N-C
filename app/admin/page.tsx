import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { deleteProductAction, updateOrderStatusAction } from "@/lib/admin";
import { db } from "@/lib/db";
import type { OrderWithItemsRecord } from "@/lib/db-types";
import { ORDER_STATUSES } from "@/lib/db-types";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for products, brand assets, and order management."
};

export default async function AdminPage() {
  noStore();
  const [products, orders, assets, requests, users] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" }, take: 10 }) as Promise<OrderWithItemsRecord[]>,
    db.brandAsset.findMany({ orderBy: { createdAt: "desc" } }),
    db.customCakeRequest.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.user.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <span className="eyebrow">Admin</span>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <h1>Admin dashboard.</h1>
            <p style={{ marginTop: 12 }}>Monitor users, orders, requests, products, and customer-facing content from one admin workspace.</p>
          </div>
          <div className="cta-row">
            <Link className="button" href="/admin/products/new">New Product</Link>
            <Link className="button-ghost" href="/admin/orders">All Orders</Link>
            <Link className="button-ghost" href="/admin/users">Users</Link>
          </div>
        </div>
      </div>

        <div className="admin-summary-grid" style={{ marginTop: 28 }}>
          <div className="info-card"><strong>{users.length}</strong><p style={{ marginTop: 8 }}>registered users</p></div>
          <div className="info-card"><strong>{orders.length}</strong><p style={{ marginTop: 8 }}>recent orders loaded</p></div>
          <div className="info-card"><strong>{requests.length}</strong><p style={{ marginTop: 8 }}>custom requests in queue</p></div>
          <div className="info-card"><strong>{assets.length}</strong><p style={{ marginTop: 8 }}>brand assets uploaded</p></div>
        </div>

        <div className="custom-layout admin-dashboard-layout" style={{ marginTop: 28 }}>
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
              <p className="subtle" style={{ marginTop: 8, marginBottom: 12 }}>Admin can follow every customer order from pending to delivered here.</p>
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
                      <p className="subtle" style={{ marginTop: 6 }}>{order.email} • {order.phone}</p>
                      <p className="subtle">{order.address} • {order.pincode}</p>
                      <p className="subtle">Delivery: {order.deliveryDate} • {order.deliverySlot}</p>
                      <div className="pill-list" style={{ marginTop: 10 }}>
                        <Link className="button-small" href={`/track-order?order=${order.orderNumber}`}>Customer View</Link>
                      </div>
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
                          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
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
              <h3 style={{ fontSize: 24 }}>Users</h3>
              <p style={{ marginTop: 8 }}>{users.filter((user) => user.role === "ADMIN").length} admins • {users.filter((user) => !user.blockedAt).length} active users</p>
              <div className="pill-list" style={{ marginTop: 12 }}>
                <Link className="button-small" href="/admin/users">Open User Panel</Link>
              </div>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 24 }}>Story & Journal</h3>
              <p style={{ marginTop: 8 }}>Manage About-page story blocks separately from Journal entries customers see on the storefront.</p>
              <div className="pill-list" style={{ marginTop: 12 }}>
                <Link className="button-small" href="/admin/story">Story</Link>
                <Link className="button-small" href="/admin/journal">Journal</Link>
              </div>
            </div>
            <div className="info-card">
              <h3 style={{ fontSize: 24 }}>Brand Assets</h3>
              <p style={{ marginTop: 8 }}>{assets.length} uploaded asset(s)</p>
              <div className="pill-list" style={{ marginTop: 12 }}>
                <Link className="button-small" href="/admin/brand">Manage Assets</Link>
              </div>
            </div>
          </aside>
        </div>
    </section>
  );
}
