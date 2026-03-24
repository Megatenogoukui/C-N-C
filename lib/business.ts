export const businessConfig = {
  city: "Mulund East, Mumbai",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "919920554660",
  supportInstagram: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "sunitu_kandar",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@cnccakes.example",
  freeDeliveryThresholdInr: 4000,
  flatDeliveryFeeInr: 180,
  sameDayEnabled: false,
  deliverySlots: ["10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM", "7 PM - 10 PM"],
  serviceablePincodes: [
    "400080",
    "400081",
    "400082",
    "400083",
    "400084",
    "400086",
    "400087"
  ],
  onlinePaymentsEnabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
} as const;

export function getWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${businessConfig.supportPhone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function isServiceablePincode(value: string) {
  return (businessConfig.serviceablePincodes as readonly string[]).includes(value.trim());
}
