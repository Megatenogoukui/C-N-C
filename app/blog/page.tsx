import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Editorial content for cake occasions, flavor guides, gifting ideas, and local SEO growth."
};

const posts = [
  "Best Birthday Cakes in Mulund East for 2026 Celebrations",
  "How to Order a Custom Wedding Cake Without Last-Minute Chaos",
  "Eggless Cakes That Still Feel Premium"
];

export default function BlogPage() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Journal</span>
        <h1 style={{ fontSize: 64 }}>SEO content that still fits the brand.</h1>
        <div className="blog-grid" style={{ marginTop: 32 }}>
          {posts.map((post) => (
            <article className="info-card" key={post}>
              <h3 style={{ fontSize: 28 }}>{post}</h3>
              <p style={{ marginTop: 12 }}>
                This content slot supports high-intent search demand while guiding visitors into either the catalog or custom inquiry funnel.
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
