import { db } from "@/lib/db";

export async function getStoryEntries() {
  const entries = await db.contentEntry.findMany({
    where: { type: "STORY", published: true },
    orderBy: { sortOrder: "asc" }
  });

  if (entries.length) {
    return entries;
  }

  return [
    {
      id: "story-1",
      type: "STORY" as const,
      slug: "homemade-comfort",
      title: "Homemade comfort, stronger digital storefront",
      excerpt: "A warm one-city bakery identity with clear ordering and stronger trust.",
      body: "C \"N\" C is positioned as a homemade treats brand with space for serious commerce depth. The experience avoids clutter and focuses on clean ordering, strong trust, and a bakery identity that feels local and personal.",
      imageUrl: null,
      published: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "story-2",
      type: "STORY" as const,
      slug: "what-changes-later",
      title: "What changes later",
      excerpt: "Payments, media, and operations can scale without redesigning the customer flow.",
      body: "Product data, real media, payments, notifications, and admin workflows can move from seeded state to persistent services without breaking the storefront structure or forcing a redesign later.",
      imageUrl: null,
      published: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}

export async function getJournalEntries() {
  const entries = await db.contentEntry.findMany({
    where: { type: "JOURNAL", published: true },
    orderBy: { sortOrder: "asc" }
  });

  if (entries.length) {
    return entries;
  }

  return [
    {
      id: "journal-1",
      type: "JOURNAL" as const,
      slug: "best-birthday-cakes-mulund-east",
      title: "Best Birthday Cakes in Mulund East for 2026 Celebrations",
      excerpt: "Occasion-led content for high-intent local cake buyers.",
      body: "This content slot supports high-intent search demand while guiding visitors into the catalog or the custom inquiry funnel.",
      imageUrl: null,
      published: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "journal-2",
      type: "JOURNAL" as const,
      slug: "custom-wedding-cake-guide",
      title: "How to Order a Custom Wedding Cake Without Last-Minute Chaos",
      excerpt: "A guide that drives custom-order trust and consultation enquiries.",
      body: "This content slot supports high-intent search demand while guiding visitors into the catalog or the custom inquiry funnel.",
      imageUrl: null,
      published: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}
