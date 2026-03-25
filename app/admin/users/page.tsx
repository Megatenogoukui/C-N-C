import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { toggleUserBlockAction, updateUserRoleAction } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "Manage customer roles and access."
};

export default async function AdminUsersPage() {
  noStore();
  const [users, orders] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  const orderCountByUser = new Map<string, number>();
  for (const order of orders) {
    if (!order.userId) continue;
    orderCountByUser.set(order.userId, (orderCountByUser.get(order.userId) || 0) + 1);
  }

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">Users</span>
          <h1>Manage customer access and permissions.</h1>
          <p>Promote trusted accounts to admin, remove admin access, or block users from logging in.</p>
        </div>
      </div>

      <div className="admin-card-list">
        {users.map((user) => (
          <article className="admin-entity-card" key={user.id}>
            <div className="admin-entity-main">
              <div>
                <strong>{user.name || "Unnamed user"}</strong>
                <p>{user.email || "No email"}{user.phone ? ` • ${user.phone}` : ""}</p>
                <p className="subtle">{user.address || "No saved address"}{user.pincode ? ` • ${user.pincode}` : ""}</p>
              </div>
              <div className="pill-list">
                <span className="admin-status-pill">{user.role}</span>
                <span className={`admin-status-pill ${user.blockedAt ? "admin-status-danger" : "admin-status-success"}`}>
                  {user.blockedAt ? "Blocked" : "Active"}
                </span>
                <span className="admin-status-pill">{orderCountByUser.get(user.id) || 0} orders</span>
              </div>
            </div>
            <div className="admin-card-actions">
              <form action={updateUserRoleAction} className="admin-inline-form">
                <input type="hidden" name="id" value={user.id} />
                <select className="select" defaultValue={user.role} name="role">
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button className="button-small" type="submit">Update Role</button>
              </form>
              <form action={toggleUserBlockAction}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="blocked" value={user.blockedAt ? "false" : "true"} />
                <button className="button-small" type="submit">{user.blockedAt ? "Unblock User" : "Block User"}</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
