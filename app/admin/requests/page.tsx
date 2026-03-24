import type { Metadata } from "next";
import { RequestStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateCustomRequestStatusAction } from "@/lib/admin";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Custom Cake Requests",
  description: "Review and manage bespoke cake inquiries."
};

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/requests");
  if (session.user.role !== Role.ADMIN) redirect("/account");

  const requests = await db.customCakeRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="section section-soft">
      <div className="container">
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: 48 }}>Custom cake requests.</h1>
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {requests.length ? requests.map((request) => (
            <section className="panel" data-testid={`admin-request-${request.id}`} key={request.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 26 }}>{request.name} • {request.occasion}</h3>
                  <p style={{ marginTop: 8 }}>{request.email} • {request.phone}</p>
                  <p className="subtle" style={{ marginTop: 8 }}>
                    {request.eventDate} • {request.budget} • {request.contactPreference} • {request.status}
                  </p>
                </div>
                <form action={updateCustomRequestStatusAction} style={{ display: "grid", gap: 10, minWidth: 240 }}>
                  <input type="hidden" name="id" value={request.id} />
                  <select className="select" data-testid={`admin-request-status-${request.id}`} name="status" defaultValue={request.status}>
                    {Object.values(RequestStatus).map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <textarea className="textarea" data-testid={`admin-request-notes-${request.id}`} name="notes" placeholder="Internal notes" defaultValue={request.notes || ""} />
                  <button className="button-small" data-testid={`admin-request-save-${request.id}`} type="submit">Save Status</button>
                </form>
              </div>
              <div className="info-card" style={{ marginTop: 16 }}>
                <strong>Brief</strong>
                <p style={{ marginTop: 8 }}>{request.brief}</p>
                <p style={{ marginTop: 12 }}><strong>Flavor preferences:</strong> {request.flavorPreferences}</p>
                {request.servings ? <p><strong>Servings:</strong> {request.servings}</p> : null}
              </div>
            </section>
          )) : (
            <div className="info-card">No custom requests yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
