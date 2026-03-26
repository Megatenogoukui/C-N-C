import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJournalEntries } from "@/lib/content";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const posts = await getJournalEntries();
  return posts.find((post) => post.slug === slug) || null;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const origin = await getSiteOrigin();

  if (!post) {
    return {
      title: "Article not found"
    };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt || post.body,
    path: `/blog/${post.slug}`,
    keywords: ["cakes in Mulund", "Mulund bakery", "cakes and chocolates in Mulund"],
    origin
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 860 }}>
        <span className="eyebrow">Journal</span>
        <h1 style={{ fontSize: 58, marginTop: 12 }}>{post.title}</h1>
        {post.excerpt ? (
          <p className="lead" style={{ marginTop: 18 }}>
            {post.excerpt}
          </p>
        ) : null}
        <article className="info-card" style={{ marginTop: 28, padding: 28 }}>
          <p>{post.body}</p>
        </article>
      </div>
    </main>
  );
}
