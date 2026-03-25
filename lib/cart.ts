import { cookies } from "next/headers";
import { businessConfig } from "@/lib/business";
import { getProductBySlugs } from "@/lib/catalog";

const CART_KEY = "hb_cart";

export type CartEntry = {
  slug: string;
  quantity: number;
};

export async function readCartEntries(): Promise<CartEntry[]> {
  const store = await cookies();
  const raw = store.get(CART_KEY)?.value;
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => {
      const [slug, qty] = part.split(":");
      const quantity = Number(qty);
      if (!slug || !Number.isFinite(quantity) || quantity <= 0) return null;
      return { slug, quantity };
    })
    .filter((entry): entry is CartEntry => entry !== null);
}

export async function readCartCount() {
  const entries = await readCartEntries();
  return entries.reduce((sum, entry) => sum + entry.quantity, 0);
}

export async function readCartLines() {
  const entries = await readCartEntries();
  const products = await getProductBySlugs(entries.map((entry) => entry.slug));
  const productMap = new Map(products.map((product) => [product.slug, product]));

  const lines = entries
    .map((entry) => {
      const product = productMap.get(entry.slug);
      if (!product) return null;
      return { ...entry, product };
    })
    .filter(Boolean) as Array<{
    slug: string;
    quantity: number;
    product: (typeof products)[number];
  }>;

  const subtotal = lines.reduce((sum, line) => sum + line.product.priceInr * line.quantity, 0);
  const delivery = subtotal >= businessConfig.freeDeliveryThresholdInr || subtotal === 0 ? 0 : businessConfig.flatDeliveryFeeInr;
  const total = subtotal + delivery;

  return {
    lines,
    subtotal,
    delivery,
    discount: 0,
    total,
    count: lines.reduce((sum, line) => sum + line.quantity, 0)
  };
}

export async function writeCartEntries(entries: CartEntry[]) {
  const store = await cookies();
  const value = entries.map((entry) => `${entry.slug}:${entry.quantity}`).join(",");
  store.set(CART_KEY, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}
