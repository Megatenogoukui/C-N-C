import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const mongoUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/cnc_store";

function getDbNameFromUri(uri) {
  const withoutQuery = uri.split("?")[0];
  return withoutQuery.substring(withoutQuery.lastIndexOf("/") + 1) || "cnc_store";
}

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
    ]),
    active: true
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
    ]),
    active: true
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
    ]),
    active: true
  }
];

const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db(getDbNameFromUri(mongoUri));
  const users = db.collection("users");
  const productsCollection = db.collection("products");

  await users.createIndex({ email: 1 }, { unique: true, sparse: true });
  await productsCollection.createIndex({ slug: 1 }, { unique: true });

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("customer123", 10);
  const now = new Date();

  await users.updateOne(
    { email: "admin@cnc.local" },
    {
      $set: {
        name: 'C "N" C Admin',
        role: "ADMIN",
        passwordHash: adminPassword,
        updatedAt: now
      },
      $setOnInsert: {
        email: "admin@cnc.local",
        phone: "9920554660",
        address: "Mulund East, Mumbai",
        pincode: "400081",
        emailVerified: null,
        image: null,
        createdAt: now
      }
    },
    { upsert: true }
  );

  await users.updateOne(
    { email: "customer@cnc.local" },
    {
      $set: {
        name: "Demo Customer",
        role: "CUSTOMER",
        passwordHash: userPassword,
        updatedAt: now
      },
      $setOnInsert: {
        email: "customer@cnc.local",
        phone: "9920554661",
        address: "Mulund East, Mumbai",
        pincode: "400081",
        emailVerified: null,
        image: null,
        createdAt: now
      }
    },
    { upsert: true }
  );

  for (const product of products) {
    await productsCollection.updateOne(
      { slug: product.slug },
      {
        $set: { ...product, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
  }
}

main()
  .then(async () => {
    await client.close();
  })
  .catch(async (error) => {
    console.error(error);
    await client.close();
    process.exit(1);
  });
