import { z } from "zod";
import { businessConfig } from "@/lib/business";

const indianPhoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.email().max(120),
  phone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit mobile number"),
  pincode: z
    .string()
    .trim()
    .regex(pincodeRegex, "Enter a valid 6-digit pincode")
    .refine((value) => (businessConfig.serviceablePincodes as readonly string[]).includes(value), "We only deliver to supported pincodes right now"),
  deliveryDate: z.string().trim().min(1, "Select a delivery date"),
  slot: z.enum(businessConfig.deliverySlots),
  address: z.string().trim().min(12).max(300),
  payment: z.enum(["COD", "ONLINE"]),
  instructions: z.string().trim().max(300).optional().default("")
});

export const customCakeSchema = z.object({
  brief: z.string().trim().min(20).max(1500),
  occasion: z.string().trim().min(2).max(60),
  eventDate: z.string().trim().min(1),
  servings: z.coerce.number().int().min(1).max(500).optional(),
  budget: z.string().trim().min(2).max(40),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit mobile number"),
  email: z.email().max(120),
  contactPreference: z.enum(["WhatsApp", "Email", "Phone call"]),
  flavorPreferences: z.string().trim().min(2).max(240)
});

export const productSchema = z.object({
  slug: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(4).max(180),
  description: z.string().trim().min(8).max(1500),
  category: z.string().trim().min(2).max(60),
  occasion: z.string().trim().min(2).max(60),
  flavor: z.string().trim().min(2).max(60),
  weight: z.string().trim().min(2).max(40),
  priceInr: z.coerce.number().int().positive().max(100000),
  badge: z.string().trim().min(2).max(50),
  detailBlurb: z.string().trim().min(8).max(600),
  seoBlurb: z.string().trim().min(8).max(180),
  imageUrl: z.string().trim().optional().default(""),
  galleryCsv: z.string().optional().default(""),
  highlightsCsv: z.string().optional().default(""),
  ingredientsCsv: z.string().optional().default(""),
  addOnsJson: z.string().optional().default("[]")
});

export const forgotPasswordSchema = z.object({
  email: z.email().max(120)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  phone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit mobile number"),
  address: z.string().trim().min(12).max(300),
  pincode: z.string().trim().regex(pincodeRegex, "Enter a valid 6-digit pincode"),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(indianPhoneRegex, "Enter a valid 10-digit mobile number"),
  address: z.string().trim().min(12).max(300),
  pincode: z.string().trim().regex(pincodeRegex, "Enter a valid 6-digit pincode")
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(10),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const reviewSchema = z.object({
  orderId: z.string().trim().min(1),
  productId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(80).optional().default(""),
  body: z.string().trim().max(600).optional().default("")
});
