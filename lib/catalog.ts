import { db } from "@/lib/db";
import { products as fallbackProducts } from "@/lib/storefront-data";

export type StoreAddOn = { name: string; priceInr: number };

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  occasion: string;
  flavor: string;
  weight: string;
  priceInr: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  badge: string;
  eggless?: boolean;
  detailBlurb: string;
  seoBlurb: string;
  highlights: string[];
  ingredients: string[];
  addOns: StoreAddOn[];
};

function parseJSON<T>(value: string, fallback: T): T {
  let current: unknown = value;

  try {
    while (typeof current === "string") {
      current = JSON.parse(current);
    }

    return current as T;
  } catch {
    return fallback;
  }
}

function parseStringArray(value: string, fallback: string[] = []) {
  const parsed = parseJSON<unknown>(value, fallback);
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : fallback;
}

function parseAddOns(value: string) {
  const parsed = parseJSON<unknown>(value, []);
  if (!Array.isArray(parsed)) return [] as StoreAddOn[];

  return parsed
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as { name?: unknown; priceInr?: unknown };
      if (typeof candidate.name !== "string") return null;
      const price = Number(candidate.priceInr);
      return {
        name: candidate.name,
        priceInr: Number.isFinite(price) ? price : 0
      } satisfies StoreAddOn;
    })
    .filter((item): item is StoreAddOn => Boolean(item));
}

export function mapProduct(product: Awaited<ReturnType<typeof db.product.findFirstOrThrow>>): StoreProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    category: product.category,
    occasion: product.occasion,
    flavor: product.flavor,
    weight: product.weight,
    priceInr: product.priceInr,
    rating: product.rating,
    reviews: product.reviews,
    image: product.imageUrl,
    gallery: parseStringArray(product.galleryJson, [product.imageUrl]),
    badge: product.badge,
    eggless: product.eggless,
    detailBlurb: product.detailBlurb,
    seoBlurb: product.seoBlurb,
    highlights: parseStringArray(product.highlightsJson, []),
    ingredients: parseStringArray(product.ingredientsJson, []),
    addOns: parseAddOns(product.addOnsJson)
  };
}

export async function getProducts(filters?: { occasion?: string; flavor?: string; eggless?: boolean }) {
  try {
    const products = await db.product.findMany({
      where: {
        active: true,
        ...(filters?.occasion
          ? {
              OR: [{ occasion: filters.occasion }, { category: filters.occasion }]
            }
          : {}),
        ...(filters?.flavor ? { flavor: filters.flavor } : {}),
        ...(filters?.eggless ? { eggless: true } : {})
      },
      orderBy: { createdAt: "desc" }
    });
    return products.map(mapProduct);
  } catch (error) {
    console.error("catalog lookup failed", error);
    return fallbackProducts.filter((product) => {
      if (filters?.occasion && product.occasion !== filters.occasion && product.category !== filters.occasion) {
        return false;
      }
      if (filters?.flavor && product.flavor !== filters.flavor) {
        return false;
      }
      if (filters?.eggless && !product.eggless) {
        return false;
      }
      return true;
    });
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({ where: { slug } });
    return product ? mapProduct(product) : null;
  } catch (error) {
    console.error("product lookup failed", error);
    return fallbackProducts.find((product) => product.slug === slug) || null;
  }
}

export async function getProductBySlugs(slugs: string[]) {
  try {
    const products = await db.product.findMany({
      where: { slug: { in: slugs }, active: true }
    });
    const map = new Map(products.map((product) => [product.slug, mapProduct(product)]));
    return slugs.map((slug) => map.get(slug)).filter(Boolean) as StoreProduct[];
  } catch (error) {
    console.error("product batch lookup failed", error);
    const map = new Map(fallbackProducts.map((product) => [product.slug, product]));
    return slugs.map((slug) => map.get(slug)).filter(Boolean) as StoreProduct[];
  }
}
