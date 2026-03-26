import type { Metadata } from "next";
import { getJournalEntries } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Cake Journal",
    description:
      "Guides on birthday cakes in Mulund, custom cake planning, gifting ideas, and local bakery tips from C N C Cakes N Chocolates.",
    path: "/blog",
    keywords: ["cake blog Mulund", "birthday cake guide Mumbai", "custom cake planning"]
  })
};

export default async function BlogPage() {
  const posts = await getJournalEntries();
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Journal</span>
        <h1 style={{ fontSize: 64 }}>SEO content that still fits the brand.</h1>
        <div className="blog-grid" style={{ marginTop: 32 }}>
          {posts.map((post) => (
            <article className="info-card" key={post.id}>
              <h3 style={{ fontSize: 28 }}>{post.title}</h3>
              <p style={{ marginTop: 12 }}>
                {post.excerpt}
              </p>
              <p style={{ marginTop: 12 }}>
                {post.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
