import type { Metadata } from "next";
import { db } from "@/lib/db";
import { upsertContentEntryAction } from "@/lib/admin";
import { logExpectedFallback } from "@/lib/runtime";

export const metadata: Metadata = {
  title: "Admin Story",
  description: "Manage about-page story content."
};

export default async function AdminStoryPage() {
  let entries: Awaited<ReturnType<typeof db.contentEntry.findMany>> = [];
  let dataWarning: string | null = null;

  try {
    entries = await db.contentEntry.findMany({
      where: { type: "STORY" },
      orderBy: { sortOrder: "asc" }
    });
  } catch (error) {
    logExpectedFallback("admin story lookup", error);
    dataWarning = "Story entries could not be loaded right now. You can still submit new content.";
  }

  return (
    <section className="panel admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">Story</span>
          <h1>Manage brand story content.</h1>
          <p>Everything saved here appears on the customer-facing story page.</p>
        </div>
      </div>
      {dataWarning ? <div className="info-card" style={{ color: "#8f2d24" }}>{dataWarning}</div> : null}
      <form action={upsertContentEntryAction} className="admin-content-form">
        <input type="hidden" name="type" value="STORY" />
        <div className="field-grid two">
          <label>
            <span className="field-label">Slug</span>
            <input className="input" name="slug" placeholder="about-our-bakehouse" required />
          </label>
          <label>
            <span className="field-label">Sort Order</span>
            <input className="input" defaultValue={0} name="sortOrder" type="number" />
          </label>
        </div>
        <label>
          <span className="field-label">Title</span>
          <input className="input" name="title" placeholder="How C N C started" required />
        </label>
        <label>
          <span className="field-label">Excerpt</span>
          <textarea className="textarea" name="excerpt" placeholder="Short story summary." />
        </label>
        <label>
          <span className="field-label">Body</span>
          <textarea className="textarea" name="body" placeholder="Full story block." required />
        </label>
        <label>
          <span className="field-label">Image URL</span>
          <input className="input" name="imageUrl" placeholder="https://..." />
        </label>
        <label className="admin-checkbox">
          <input defaultChecked name="published" type="checkbox" />
          <span>Published</span>
        </label>
        <button className="button" type="submit">Save Story Entry</button>
      </form>
      <div className="admin-card-list">
        {entries.map((entry) => (
          <article className="info-card" key={entry.id}>
            <strong>{entry.title}</strong>
            <p className="subtle" style={{ marginTop: 8 }}>/about • {entry.slug} • Sort {entry.sortOrder}</p>
            <p style={{ marginTop: 8 }}>{entry.excerpt || entry.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
