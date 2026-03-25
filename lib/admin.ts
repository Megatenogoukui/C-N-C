"use server";

import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BrandAssetType, ContentEntryType, OrderStatus, RequestStatus } from "@/lib/db-types";
import { productSchema } from "@/lib/validation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }
  return session;
}

async function saveUpload(file: File | null) {
  if (!file || file.size === 0) return null;
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".png";
  const fileName = `${Date.now()}-${randomUUID()}${ext}`;
  const outDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, fileName), bytes);
  return `/uploads/${fileName}`;
}

function normalizeJsonArray(value: FormDataEntryValue | null) {
  const input = String(value || "").trim();
  if (!input) return "[]";

  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(Array.isArray(parsed) ? parsed : []);
  } catch {
    return "[]";
  }
}

function csvToJsonArray(value: FormDataEntryValue | null) {
  return JSON.stringify(
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

type ProductInputResult =
  | { error: string }
  | {
      data: {
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
        imageUrl: string;
        galleryJson: string;
        badge: string;
        eggless: boolean;
        detailBlurb: string;
        seoBlurb: string;
        highlightsJson: string;
        ingredientsJson: string;
        addOnsJson: string;
      };
    };

async function buildProductInput(formData: FormData): Promise<ProductInputResult> {
  const imageFile = formData.get("image") as File | null;
  const uploaded = await saveUpload(imageFile);
  const parsed = productSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    category: formData.get("category"),
    occasion: formData.get("occasion"),
    flavor: formData.get("flavor"),
    weight: formData.get("weight"),
    priceInr: formData.get("priceInr"),
    badge: formData.get("badge"),
    detailBlurb: formData.get("detailBlurb"),
    seoBlurb: formData.get("seoBlurb"),
    imageUrl: formData.get("imageUrl"),
    galleryCsv: formData.get("galleryCsv"),
    highlightsCsv: formData.get("highlightsCsv"),
    ingredientsCsv: formData.get("ingredientsCsv"),
    addOnsJson: formData.get("addOnsJson")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Product data is invalid" };
  }

  const payload = parsed.data;
  const finalImageUrl = uploaded || payload.imageUrl || "";
  if (!finalImageUrl) {
    return { error: "Product image is required" };
  }

  return {
    data: {
      slug: payload.slug,
      name: payload.name,
      tagline: payload.tagline,
      description: payload.description,
      category: payload.category,
      occasion: payload.occasion,
      flavor: payload.flavor,
      weight: payload.weight,
      priceInr: payload.priceInr,
      rating: Number(formData.get("rating") || 4.8),
      reviews: Number(formData.get("reviews") || 0),
      imageUrl: finalImageUrl,
      galleryJson: csvToJsonArray(formData.get("galleryCsv")),
      badge: payload.badge,
      eggless: formData.get("eggless") === "on",
      detailBlurb: payload.detailBlurb,
      seoBlurb: payload.seoBlurb,
      highlightsJson: csvToJsonArray(formData.get("highlightsCsv")),
      ingredientsJson: csvToJsonArray(formData.get("ingredientsCsv")),
      addOnsJson: normalizeJsonArray(formData.get("addOnsJson"))
    }
  };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const result = await buildProductInput(formData);
  if ("error" in result) {
    redirect(`/admin/products/new?error=${encodeURIComponent(result.error)}`);
  }

  await db.product.create({
    data: result.data
  });

  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function uploadBrandAssetAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("image") as File | null;
  const imageUrl = await saveUpload(file);
  if (!imageUrl) redirect("/admin/brand?error=Upload%20failed");

  await db.brandAsset.create({
    data: {
      label: String(formData.get("label") || "Brand asset"),
      type: String(formData.get("type") || "LOGO") as BrandAssetType,
      imageUrl
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin/brand");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const updatedOrder = await db.order.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/track-order");
  if (updatedOrder?.orderNumber) {
    revalidatePath(`/track-order?order=${updatedOrder.orderNumber}`);
  }
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin?error=Missing%20product%20id");

  const result = await buildProductInput(formData);
  if ("error" in result) {
    redirect(`/admin/products/${id}/edit?error=${encodeURIComponent(result.error)}`);
  }

  await db.product.update({
    where: { id },
    data: result.data
  });

  revalidatePath("/shop");
  revalidatePath(`/product/${result.data.slug}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin?error=Missing%20product%20id");

  await db.product.update({
    where: { id },
    data: { active: false }
  });

  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateCustomRequestStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as RequestStatus;
  const notes = String(formData.get("notes") || "").trim();

  await db.customCakeRequest.update({
    where: { id },
    data: { status, notes: notes || undefined }
  });

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function upsertContentEntryAction(formData: FormData) {
  await requireAdmin();
  const type = String(formData.get("type") || "STORY") as ContentEntryType;
  const slug = String(formData.get("slug") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const published = formData.get("published") === "on";

  if (!slug || !title || !body) {
    redirect("/admin/content?error=Slug%2C%20title%2C%20and%20body%20are%20required");
  }

  await db.contentEntry.upsert({
    where: { slug },
    update: {
      type,
      title,
      excerpt,
      body,
      imageUrl: imageUrl || null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published
    },
    create: {
      type,
      slug,
      title,
      excerpt,
      body,
      imageUrl: imageUrl || null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      published
    }
  });

  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/story");
  revalidatePath("/admin/journal");
  redirect("/admin/content");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role") || "CUSTOMER");
  if (!id || (role !== "CUSTOMER" && role !== "ADMIN")) return;

  await db.user.update({
    where: { id },
    data: { role }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function toggleUserBlockAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const blocked = String(formData.get("blocked") || "false") === "true";
  if (!id) return;

  await db.user.update({
    where: { id },
    data: { blockedAt: blocked ? new Date() : null }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}
