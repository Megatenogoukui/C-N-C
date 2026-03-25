import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { updateOrderStatusAction } from "@/lib/admin";
import { ORDER_STATUSES, type OrderWithItemsRecord } from "@/lib/db-types";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Track every order and update status from one page."
};

export default async function AdminOrdersPage() {
  noStore();
  const orders = await db.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  }) as OrderWithItemsRecord[];

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">Orders</span>
          <h1>Track every customer order.</h1>
          <p>Review delivery details, payment state, ordered items, and update status for the customer tracker.</p>
        </div>
      </div>

      <div className="admin-card-list">
        {orders.map((order) => (
          <article className="admin-entity-card" key={order.id}>
            <div className="admin-entity-main">
              <div>
                <strong>{order.orderNumber}</strong>
                <p>{order.firstName} {order.lastName} • {formatInr(order.totalInr)} • {order.items.length} item(s)</p>
                <p className="subtle">{order.email} • {order.phone}</p>
                <p className="subtle">{order.address} • {order.pincode}</p>
                <p className="subtle">Delivery: {order.deliveryDate} • {order.deliverySlot} • {order.paymentMode} / {order.paymentStatus}</p>
              </div>
              <div className="pill-list">
                <span className="admin-status-pill">{order.status.replaceAll("_", " ")}</span>
                <Link className="button-small" href={`/track-order?order=${order.orderNumber}`}>Customer View</Link>
              </div>
            </div>
            <div className="admin-order-items">
              {order.items.map((item) => (
                <div className="admin-order-item" key={item.id}>
                  <span>{item.productName}</span>
                  <span>{item.quantity} × {formatInr(item.priceInr)}</span>
                </div>
              ))}
            </div>
            <form action={updateOrderStatusAction} className="admin-inline-form">
              <input type="hidden" name="id" value={order.id} />
              <select className="select" data-testid={`admin-order-status-${order.orderNumber}`} defaultValue={order.status} name="status">
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                ))}
              </select>
              <button className="button-small" data-testid={`admin-order-update-${order.orderNumber}`} type="submit">Update Status</button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
