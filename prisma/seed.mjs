import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/cnc_store"
  })
});

const products = [
  {
    slug: "lavender-berry-dream",
    name: "Lavender Berry Dream",
    tagline: "A floral-fruit celebration finished with wild berries.",
    description: "Infused with French lavender, whipped mascarpone, and wild forest berry compote.",
    category: "Signature Cakes",
    occasion: "Anniversary",
    flavor: "Fresh Fruit",
    weight: "1 kg",
    priceInr: 2450,
    rating: 4.9,
    reviews: 82,
    imageUrl: "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80"
    ]),
    badge: "Eggless Available",
    eggless: true,
    detailBlurb: "Aromatic, airy, and softly tart, finished with pressed petals and hand-placed berries.",
    seoBlurb: 'Homemade lavender berry cake in Mulund East, Mumbai with delivery slots and custom message options.',
    highlightsJson: JSON.stringify(["24-hour preorder", "Custom message included", "Editorial floral finish"]),
    ingredientsJson: JSON.stringify(["Lavender sponge", "Mascarpone chantilly", "Berry compote", "Pressed edible petals"]),
    addOnsJson: JSON.stringify([
      { name: "Celebration candles", priceInr: 120 },
      { name: "Handwritten card", priceInr: 180 },
      { name: "Mini flower bunch", priceInr: 450 }
    ])
  },
  {
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
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80"
    ]),
    badge: "Bestseller",
    eggless: false,
    detailBlurb: "An intense cocoa-led profile softened by creamy layers and a glossy finish.",
    seoBlurb: "Chocolate cake with Belgian couverture and local delivery in Mulund East, Mumbai.",
    highlightsJson: JSON.stringify(["Fast mover", "Rich cocoa finish", "Ideal for birthdays and gifting"]),
    ingredientsJson: JSON.stringify(["Belgian chocolate sponge", "Dark ganache", "Sea salt flakes", "Valrhona cocoa"]),
    addOnsJson: JSON.stringify([
      { name: "Chocolate truffle box", priceInr: 380 },
      { name: "Sparkler candle set", priceInr: 160 }
    ])
  },
  {
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
    imageUrl: "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
    galleryJson: JSON.stringify([
      "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80"
    ]),
    badge: "Signature",
    eggless: false,
    detailBlurb: "Softly perfumed, lightly textured, and plated to feel ceremonial.",
    seoBlurb: "Rose pistachio cake for anniversary and gifting in Mulund East, Mumbai.",
    highlightsJson: JSON.stringify(["Elegant floral profile", "Premium gifting favorite", "Highly photogenic"]),
    ingredientsJson: JSON.stringify(["Vanilla sponge", "Rose milk soak", "Pistachio praline", "Fresh cream"]),
    addOnsJson: JSON.stringify([
      { name: "Rose petal macarons", priceInr: 320 },
      { name: "Premium greeting scroll", priceInr: 220 }
    ])
  }
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("customer123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cnc.local" },
    update: { role: Role.ADMIN, passwordHash: adminPassword, name: 'C "N" C Admin' },
    create: {
      email: "admin@cnc.local",
      name: 'C "N" C Admin',
      role: Role.ADMIN,
      passwordHash: adminPassword
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@cnc.local" },
    update: { passwordHash: userPassword, name: "Demo Customer" },
    create: {
      email: "customer@cnc.local",
      name: "Demo Customer",
      passwordHash: userPassword
    }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
