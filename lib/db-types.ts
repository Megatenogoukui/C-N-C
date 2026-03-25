export const ROLES = ["CUSTOMER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "CANCELLED",
  "BAKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED"
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "COD_PENDING"
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BRAND_ASSET_TYPES = ["LOGO", "POSTER"] as const;
export type BrandAssetType = (typeof BRAND_ASSET_TYPES)[number];

export const CONTENT_ENTRY_TYPES = ["STORY", "JOURNAL"] as const;
export type ContentEntryType = (typeof CONTENT_ENTRY_TYPES)[number];

export const REQUEST_STATUSES = [
  "NEW",
  "CONTACTED",
  "APPROVED",
  "CANCELLED",
  "CLOSED"
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type UserRecord = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  pincode: string | null;
  emailVerified: Date | null;
  image: string | null;
  passwordHash: string | null;
  role: Role;
  blockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountRecord = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PasswordResetTokenRecord = {
  id: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  userId: string;
};

export type ProductRecord = {
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
  imageUrl: string;
  galleryJson: string;
  badge: string;
  eggless: boolean;
  detailBlurb: string;
  seoBlurb: string;
  highlightsJson: string;
  ingredientsJson: string;
  addOnsJson: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMode: string;
  paymentStatus: PaymentStatus;
  paymentReference: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  deliveryDate: string;
  deliverySlot: string;
  deliveryInstructions: string | null;
  subtotalInr: number;
  deliveryInr: number;
  discountInr: number;
  totalInr: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItemRecord = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  priceInr: number;
  message: string | null;
  instructions: string | null;
  deliveryDate: string | null;
  deliverySlot: string | null;
  createdAt: Date;
};

export type OrderWithItemsRecord = OrderRecord & {
  items: OrderItemRecord[];
};

export type BrandAssetRecord = {
  id: string;
  type: BrandAssetType;
  label: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomCakeRequestRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  brief: string;
  occasion: string;
  eventDate: string;
  servings: number | null;
  budget: string;
  flavorPreferences: string;
  contactPreference: string;
  inspirationUrl: string | null;
  status: RequestStatus;
  notes: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentEntryRecord = {
  id: string;
  type: ContentEntryType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
