import { db } from "@/lib/db";
import { logExpectedFallback, isBuildProcess } from "@/lib/runtime";
import { withTimeout } from "@/lib/with-timeout";

const fallbackStoryEntries = [
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

const fallbackJournalEntries = [
  {
    id: "journal-1",
    type: "JOURNAL" as const,
    slug: "best-birthday-cakes-mulund-east",
    title: "Best Birthday Cakes in Mulund East for 2026 Celebrations",
    excerpt: "What birthday buyers in Mulund actually care about before placing a cake order.",
    body: "The strongest birthday cake pages answer practical buying questions early: delivery slot clarity, message-on-cake inputs, eggless options, and whether the bakery can handle a theme request without turning the process into a long back-and-forth. For Mulund East buyers, convenience and reliability matter as much as the design itself.",
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
    excerpt: "A cleaner process for larger custom cake orders, references, servings, and timing.",
    body: "Large celebration cakes fail when the bakery and the customer are discussing design, servings, and budget in fragments. A proper custom brief helps qualify the order faster and protects the customer from vague promises. The right page should move buyers from inspiration to a real consultation request without friction.",
    imageUrl: null,
    published: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "journal-3",
    type: "JOURNAL" as const,
    slug: "cakes-and-chocolates-in-mulund",
    title: "Where to Order Cakes and Chocolates Together in Mulund",
    excerpt: "Why mixed gifting intent matters more than treating cakes and chocolates as separate searches.",
    body: "Many high-intent buyers are not looking for just a cake. They want a complete gifting order that includes chocolates, brownies, cupcakes, or supporting treats. Building those combinations into one bakery storefront creates a stronger local search and conversion path.",
    imageUrl: null,
    published: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "journal-4",
    type: "JOURNAL" as const,
    slug: "eggless-cakes-in-mulund-guide",
    title: "How to Choose Eggless Cakes in Mulund Without Sacrificing Taste",
    excerpt: "A practical local guide for one of the highest-intent filter journeys in the catalog.",
    body: "Eggless buyers usually want fast clarity rather than long descriptions. Good local bakery pages make those options easy to discover, easy to compare, and easy to order with confidence around freshness, flavor, and delivery.",
    imageUrl: null,
    published: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function getStoryEntries() {
  if (isBuildProcess()) {
    return fallbackStoryEntries;
  }

  try {
    const entries = await withTimeout(
      db.contentEntry.findMany({
        where: { type: "STORY", published: true },
        orderBy: { sortOrder: "asc" }
      }),
      1200,
      "story content lookup"
    );

    if (entries.length) {
      return entries;
    }
  } catch (error) {
    logExpectedFallback("story content lookup", error);
  }

  return fallbackStoryEntries;
}

export async function getJournalEntries() {
  if (isBuildProcess()) {
    return fallbackJournalEntries;
  }

  try {
    const entries = await withTimeout(
      db.contentEntry.findMany({
        where: { type: "JOURNAL", published: true },
        orderBy: { sortOrder: "asc" }
      }),
      1200,
      "journal content lookup"
    );

    if (entries.length) {
      return entries;
    }
  } catch (error) {
    logExpectedFallback("journal content lookup", error);
  }

  return fallbackJournalEntries;
}
