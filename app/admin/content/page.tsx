import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { upsertContentEntryAction } from "@/lib/admin";
import { db } from "@/lib/db";
import { CONTENT_ENTRY_TYPES } from "@/lib/db-types";

type ContentPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Story & Journal",
  description: "Manage story and journal content for the storefront."
};

export default async function AdminContentPage({ searchParams }: ContentPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/content");
  if (session.user.role !== "ADMIN") redirect("/account");
  const params = await searchParams;
  let entries: Awaited<ReturnType<typeof db.contentEntry.findMany>> = [];
  let dataWarning: string | null = null;

  try {
    entries = await db.contentEntry.findMany({ orderBy: { sortOrder: "asc" } });
  } catch (error) {
    console.error("admin content lookup failed", error);
    dataWarning = "Content entries could not be loaded right now. The editor remains available.";
  }

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <span className="eyebrow">Admin</span>
        <h1 style={{ fontSize: 42 }}>Manage Story & Journal</h1>
        <p style={{ marginTop: 12 }}>
          Add or update About-page story blocks and Journal entries from one place.
        </p>
      </div>
      {params.error ? <div className="info-card" style={{ color: "#8f2d24" }}>{params.error}</div> : null}
      {dataWarning ? <div className="info-card" style={{ color: "#8f2d24" }}>{dataWarning}</div> : null}

      <form action={upsertContentEntryAction} style={{ display: "grid", gap: 16, marginTop: 8 }}>
            <div className="field-grid two">
              <label>
                <span className="field-label">Type</span>
                <select className="select" name="type" defaultValue={CONTENT_ENTRY_TYPES[0]}>
                  {CONTENT_ENTRY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Slug</span>
                <input className="input" name="slug" placeholder="mulund-birthday-cake-guide" required />
              </label>
            </div>
            <label>
              <span className="field-label">Title</span>
              <input className="input" name="title" placeholder="Best Birthday Cakes in Mulund East" required />
            </label>
            <label>
              <span className="field-label">Excerpt</span>
              <textarea className="textarea" name="excerpt" placeholder="Short summary for cards and intro text." />
            </label>
            <label>
              <span className="field-label">Body</span>
              <textarea className="textarea" name="body" placeholder="Full story or journal body." required />
            </label>
            <div className="field-grid two">
              <label>
                <span className="field-label">Image URL</span>
                <input className="input" name="imageUrl" placeholder="https://..." />
              </label>
              <label>
                <span className="field-label">Sort Order</span>
                <input className="input" name="sortOrder" type="number" defaultValue={0} />
              </label>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" name="published" defaultChecked />
              <span>Published</span>
            </label>
            <button className="button" type="submit">Save Content</button>
      </form>

      <div style={{ display: "grid", gap: 12, marginTop: 28 }}>
        {entries.map((entry) => (
          <div className="info-card" key={entry.id}>
            <strong>{entry.title}</strong>
            <p style={{ marginTop: 8 }}>{entry.type} • /{entry.slug} • Sort {entry.sortOrder}</p>
            <p className="subtle" style={{ marginTop: 8 }}>{entry.excerpt || entry.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
