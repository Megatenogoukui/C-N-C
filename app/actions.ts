"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { businessConfig } from "@/lib/business";
import { readCartEntries, writeCartEntries } from "@/lib/cart";
import { db } from "@/lib/db";
import { PAYMENT_STATUSES } from "@/lib/db-types";
import { getProductBySlugs } from "@/lib/catalog";
import { checkoutSchema, customCakeSchema } from "@/lib/validation";

export async function addToCart(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const redirectTo = String(formData.get("redirectTo") || "/cart");
  if (!slug) redirect(redirectTo);

  const entries = await readCartEntries();
  const existing = entries.find((entry) => entry.slug === slug);

  if (existing) {
    existing.quantity += 1;
  } else {
    entries.push({ slug, quantity: 1 });
  }

  await writeCartEntries(entries);
  redirect(redirectTo);
}

export async function updateCart(formData: FormData) {
  const slug = String(formData.get("slug") || "");
  const action = String(formData.get("action") || "");
  const entries = await readCartEntries();
  const current = entries.find((entry) => entry.slug === slug);

  if (!current) {
    redirect("/cart");
  }

  if (action === "increase") {
    current.quantity += 1;
  } else if (action === "decrease") {
    current.quantity -= 1;
  } else if (action === "remove") {
    current.quantity = 0;
  }

  await writeCartEntries(entries.filter((entry) => entry.quantity > 0));
  redirect("/cart");
}

export async function submitCheckout(formData: FormData) {
  const session = await auth();
  const entries = await readCartEntries();
  if (entries.length === 0) {
    redirect("/cart");
  }
  const products = await getProductBySlugs(entries.map((entry) => entry.slug));
  const productMap = new Map(products.map((product) => [product.slug, product]));
  const lines = entries
    .map((entry) => {
      const product = productMap.get(entry.slug);
      if (!product) return null;
      return { entry, product };
    })
    .filter(Boolean) as Array<{
    entry: { slug: string; quantity: number };
    product: (typeof products)[number];
  }>;

  const parsed = checkoutSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email") || session?.user?.email || "",
    phone: formData.get("phone"),
    pincode: formData.get("pincode"),
    deliveryDate: formData.get("deliveryDate"),
    slot: formData.get("slot"),
    address: formData.get("address"),
    payment: formData.get("payment"),
    instructions: formData.get("instructions")
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Checkout details are invalid";
    redirect(`/checkout?error=${encodeURIComponent(message)}`);
  }

  const checkout = parsed.data;
  if (checkout.payment === "ONLINE" && !businessConfig.onlinePaymentsEnabled) {
    redirect("/checkout?error=Online%20payments%20are%20not%20enabled%20yet");
  }

  const subtotal = lines.reduce((sum, line) => sum + line.product.priceInr * line.entry.quantity, 0);
  const delivery = subtotal >= businessConfig.freeDeliveryThresholdInr || subtotal === 0 ? 0 : businessConfig.flatDeliveryFeeInr;
  const total = subtotal + delivery;

  const order = await db.order.create({
    data: {
      orderNumber: `CNC-${Date.now().toString().slice(-8)}-${randomUUID().slice(0, 4).toUpperCase()}`,
      paymentMode: checkout.payment,
      paymentStatus: checkout.payment === "COD" ? PAYMENT_STATUSES[4] : PAYMENT_STATUSES[0],
      firstName: checkout.firstName,
      lastName: checkout.lastName,
      email: checkout.email,
      phone: checkout.phone,
      address: checkout.address,
      pincode: checkout.pincode,
      deliveryDate: checkout.deliveryDate,
      deliverySlot: checkout.slot,
      deliveryInstructions: checkout.instructions,
      subtotalInr: subtotal,
      deliveryInr: delivery,
      totalInr: total,
      userId: session?.user?.id ?? null,
      items: {
        create: lines.map((line) => ({
          productId: line.product.id,
          productName: line.product.name,
          quantity: line.entry.quantity,
          priceInr: line.product.priceInr
        }))
      }
    }
  });

  await writeCartEntries([]);
  redirect(`/track-order?order=${order.orderNumber}${checkout.payment === "ONLINE" ? "&payment=pending" : ""}`);
}

export async function submitCustomCake(formData: FormData) {
  const session = await auth();
  const parsed = customCakeSchema.safeParse({
    brief: formData.get("brief"),
    occasion: formData.get("occasion"),
    eventDate: formData.get("eventDate"),
    servings: formData.get("servings"),
    budget: formData.get("budget"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    contactPreference: formData.get("contactPreference"),
    flavorPreferences: formData.get("flavorPreferences")
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Custom cake request is invalid";
    redirect(`/custom-cakes?error=${encodeURIComponent(message)}`);
  }

  const payload = parsed.data;
  await db.customCakeRequest.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      brief: payload.brief,
      occasion: payload.occasion,
      eventDate: payload.eventDate,
      servings: payload.servings ?? null,
      budget: payload.budget,
      flavorPreferences: payload.flavorPreferences,
      contactPreference: payload.contactPreference,
      userId: session?.user?.id ?? null
    }
  });

  redirect("/custom-cakes?submitted=1");
}
