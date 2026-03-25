import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { OrderWithItemsRecord, ReviewRecord, ReviewWithUserRecord } from "@/lib/db-types";
import { withTimeout } from "@/lib/with-timeout";

export async function getProductReviews(productId: string): Promise<ReviewWithUserRecord[]> {
  try {
    return await withTimeout(
      db.review.findMany({
        where: { productId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 8
      }) as Promise<ReviewWithUserRecord[]>,
      1200,
      "product reviews lookup"
    );
  } catch (error) {
    console.error("product reviews lookup failed", error);
    return [];
  }
}

export async function getUserReviewMap(userId: string) {
  try {
    const reviews = await withTimeout(
      db.review.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      }) as Promise<ReviewRecord[]>,
      1200,
      "user reviews lookup"
    );
    return new Map(reviews.map((review) => [`${review.orderId}:${review.productId}`, review]));
  } catch (error) {
    console.error("user reviews lookup failed", error);
    return new Map<string, ReviewRecord>();
  }
}

export async function canReviewProduct({
  userId,
  orderId,
  productId
}: {
  userId: string;
  orderId: string;
  productId: string;
}) {
  try {
    const order = await withTimeout(
      db.order.findUnique({ where: { id: orderId }, include: { items: true } }),
      1500,
      "review eligibility lookup"
    );
    const orderWithItems = order as OrderWithItemsRecord | null;
    if (!orderWithItems || orderWithItems.userId !== userId || orderWithItems.status !== "DELIVERED") {
      return false;
    }
    return orderWithItems.items.some((item) => item.productId === productId);
  } catch (error) {
    console.error("review eligibility lookup failed", error);
    return false;
  }
}

export async function getCurrentUserReviewMap() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Map<string, ReviewRecord>();
  }
  try {
    return await getUserReviewMap(session.user.id);
  } catch (error) {
    console.error("current user reviews lookup failed", error);
    return new Map<string, ReviewRecord>();
  }
}
