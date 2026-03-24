export type AddOn = {
  name: string;
  priceInr: number;
};

export type Product = {
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
  addOns: AddOn[];
};

export type Collection = {
  name: string;
  intro: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  area: string;
};

export const products: Product[] = [
  {
    id: "1",
    slug: "lavender-berry-dream",
    name: "Lavender Berry Dream",
    tagline: "A floral-fruit celebration finished with wild berries.",
    description:
      "Infused with French lavender, whipped mascarpone, and wild forest berry compote.",
    category: "Signature Cakes",
    occasion: "Anniversary",
    flavor: "Fresh Fruit",
    weight: "1 kg",
    priceInr: 2450,
    rating: 4.9,
    reviews: 82,
    image:
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Eggless Available",
    eggless: true,
    detailBlurb:
      "Aromatic, airy, and softly tart, finished with pressed petals and hand-placed berries.",
    seoBlurb:
      'Homemade lavender berry cake in Mulund East, Mumbai with delivery slots and custom message options.',
    highlights: ["24-hour preorder", "Custom message included", "Editorial floral finish"],
    ingredients: [
      "Lavender sponge",
      "Mascarpone chantilly",
      "Berry compote",
      "Pressed edible petals"
    ],
    addOns: [
      { name: "Celebration candles", priceInr: 120 },
      { name: "Handwritten card", priceInr: 180 },
      { name: "Mini flower bunch", priceInr: 450 }
    ]
  },
  {
    id: "2",
    slug: "noir-chocolate-ganache",
    name: "Noir Chocolate Ganache",
    tagline: "Single-origin Belgian chocolate with fleur de sel.",
    description: "A dense layered chocolate cake glazed in satin ganache and finished with gold leaf.",
    category: "Chocolate",
    occasion: "Birthday",
    flavor: "Belgian Chocolate",
    weight: "1 kg",
    priceInr: 1950,
    rating: 4.8,
    reviews: 164,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Bestseller",
    detailBlurb:
      "An intense cocoa-led profile softened by creamy layers and a glossy finish.",
    seoBlurb:
      "Chocolate cake with Belgian couverture and local delivery in Mulund East, Mumbai.",
    highlights: ["Fast mover", "Rich cocoa finish", "Ideal for birthdays and gifting"],
    ingredients: ["Belgian chocolate sponge", "Dark ganache", "Sea salt flakes", "Valrhona cocoa"],
    addOns: [
      { name: "Chocolate truffle box", priceInr: 380 },
      { name: "Sparkler candle set", priceInr: 160 }
    ]
  },
  {
    id: "3",
    slug: "persian-rose-pistachio",
    name: "Persian Rose & Pistachio",
    tagline: "Rose-water sponge with toasted pistachios and silk cream.",
    description: "A refined floral cake designed for elegant intimate dinners and premium gifting.",
    category: "Signature Cakes",
    occasion: "Anniversary",
    flavor: "Madagascar Vanilla",
    weight: "1 kg",
    priceInr: 2250,
    rating: 4.9,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Signature",
    detailBlurb: "Softly perfumed, lightly textured, and plated to feel ceremonial.",
    seoBlurb: "Rose pistachio cake for anniversary and gifting in Mulund East, Mumbai.",
    highlights: ["Elegant floral profile", "Premium gifting favorite", "Highly photogenic"],
    ingredients: ["Vanilla sponge", "Rose milk soak", "Pistachio praline", "Fresh cream"],
    addOns: [
      { name: "Rose petal macarons", priceInr: 320 },
      { name: "Premium greeting scroll", priceInr: 220 }
    ]
  },
  {
    id: "4",
    slug: "midnight-truffle-bloom",
    name: "Midnight Truffle Bloom",
    tagline: "Dark truffle layers with couture floral finishing.",
    description: "A deep chocolate centerpiece with velvet frosting and gold detailing.",
    category: "Premium Cakes",
    occasion: "Wedding",
    flavor: "Belgian Chocolate",
    weight: "1.5 kg",
    priceInr: 3200,
    rating: 5,
    reviews: 48,
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Chef's Special",
    detailBlurb:
      "Built for statement tables, formal dinners, and indulgent chocolate lovers.",
    seoBlurb:
      "Designer truffle cake with premium gold finish for milestone celebrations.",
    highlights: ["Statement cake", "Luxury finish", "Best for formal events"],
    ingredients: ["Chocolate sponge", "Truffle mousse", "Dark mirror glaze", "Edible gold"],
    addOns: [
      { name: "Luxury knife set", priceInr: 350 },
      { name: "Fresh flower styling", priceInr: 650 }
    ]
  },
  {
    id: "5",
    slug: "crimson-velvet-heart",
    name: "Crimson Velvet Heart",
    tagline: "Classic red velvet reimagined with soft sculpted frosting.",
    description:
      "Tangy cream cheese frosting with a plush red velvet crumb and romantic finish.",
    category: "Birthday",
    occasion: "Birthday",
    flavor: "Red Velvet",
    weight: "1.5 kg",
    priceInr: 2400,
    rating: 5,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Top Rated",
    detailBlurb:
      "Soft, celebratory, and built to be loved across age groups.",
    seoBlurb:
      "Luxury red velvet celebration cake with customizable message.",
    highlights: ["Most reordered", "Party-safe crowd pleaser", "Rich but balanced"],
    ingredients: [
      "Red velvet sponge",
      "Cream cheese frosting",
      "Vanilla crumb",
      "Berry garnish"
    ],
    addOns: [
      { name: "Heart candles", priceInr: 140 },
      { name: "Balloon bouquet", priceInr: 700 }
    ]
  },
  {
    id: "6",
    slug: "portrait-gallery-cake",
    name: "Portrait Gallery Cake",
    tagline: "Photo-printed celebration cake with floral detailing.",
    description:
      "A custom-ready photo cake designed for milestone birthdays and personal celebrations.",
    category: "Photo Cakes",
    occasion: "Birthday",
    flavor: "Custom Photo",
    weight: "1 kg",
    priceInr: 2800,
    rating: 4.7,
    reviews: 32,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80"
    ],
    badge: "Photo Cake",
    detailBlurb:
      "Designed to merge sentiment with polished premium execution.",
    seoBlurb:
      "Photo cake delivery in Mulund East, Mumbai with premium edible print finish.",
    highlights: ["High-resolution edible print", "Ideal for milestone events", "WhatsApp support available"],
    ingredients: ["Vanilla sponge", "Photo sheet", "Fresh cream", "Fondant detailing"],
    addOns: [
      { name: "Photo topper upgrade", priceInr: 260 },
      { name: "Birthday sash", priceInr: 340 }
    ]
  }
];

export const collections: Collection[] = [
  {
    name: "Birthday",
    intro: "Layered celebration cakes for intimate and grand parties.",
    image: products[4].image
  },
  {
    name: "Anniversary",
    intro: "Romantic centerpieces with floral and fruit-led profiles.",
    image: products[0].image
  },
  {
    name: "Eggless",
    intro: "Full-bodied eggless cakes that do not compromise texture.",
    image: products[2].image
  },
  {
    name: "Chocolate",
    intro: "Dark cocoa signatures and truffle-led indulgence.",
    image: products[1].image
  },
  {
    name: "Combos",
    intro: "Cake plus flowers, candles, cards, and gifting upgrades.",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80"
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The Lavender Berry cake was the highlight of our anniversary. It felt editorial, not generic.",
    name: "Ananya K.",
    area: "Golf Course Road"
  },
  {
    quote: "Packaging was as premium as the taste. This is now our go-to for corporate gifting.",
    name: "Vikram S.",
    area: "Chanakyapuri"
  },
  {
    quote: "The eggless chocolate range actually tastes luxurious. That is rare.",
    name: "Priya M.",
    area: "Vasant Vihar"
  }
];

export const orderStages = [
  "Received",
  "Confirmed",
  "Baking",
  "Out for Delivery",
  "Delivered"
] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
