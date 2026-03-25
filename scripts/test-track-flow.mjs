import "dotenv/config";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:3000";
const statuses = ["PENDING", "ACCEPTED", "BAKING", "OUT_FOR_DELIVERY", "DELIVERED"];
const orderNumber = `CNC-TRACK-${Date.now().toString().slice(-6)}`;

async function seedOrder() {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db("cnc_store");

  const adminEmail = "admin@cnc.local";
  const existingAdmin = await db.collection("users").findOne({ email: adminEmail });
  if (!existingAdmin) {
    await db.collection("users").insertOne({
      _id: new ObjectId(),
      name: "Admin",
      email: adminEmail,
      phone: null,
      address: null,
      pincode: null,
      emailVerified: null,
      image: null,
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  let product = await db.collection("products").findOne({});
  if (!product) {
    const productId = new ObjectId();
    await db.collection("products").insertOne({
      _id: productId,
      slug: `track-product-${Date.now()}`,
      name: "Tracking Test Cake",
      tagline: "Tracking test product",
      description: "Used to verify order tracking state changes.",
      category: "Test",
      occasion: "Birthday",
      flavor: "Chocolate",
      weight: "1 kg",
      priceInr: 999,
      rating: 5,
      reviews: 1,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
      galleryJson: "[]",
      badge: "Test",
      eggless: false,
      detailBlurb: "Tracking test cake",
      seoBlurb: "Tracking test cake",
      highlightsJson: "[]",
      ingredientsJson: "[]",
      addOnsJson: "[]",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    product = await db.collection("products").findOne({ _id: productId });
  }

  const userId = new ObjectId();
  const orderId = new ObjectId();

  await db.collection("users").insertOne({
    _id: userId,
    name: "Tracking QA",
    email: `tracking-${Date.now()}@example.com`,
    phone: "9920554660",
    address: "Flat 101, Mulund East, Mumbai",
    pincode: "400081",
    emailVerified: null,
    image: null,
    passwordHash: null,
    role: "CUSTOMER",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await db.collection("orders").insertOne({
    _id: orderId,
    orderNumber,
    status: "PENDING",
    paymentMode: "COD",
    paymentStatus: "COD_PENDING",
    paymentReference: null,
    firstName: "Tracking",
    lastName: "QA",
    email: `tracking-${Date.now()}@example.com`,
    phone: "9920554660",
    address: "Flat 101, Mulund East, Mumbai",
    pincode: "400081",
    deliveryDate: "2026-03-27",
    deliverySlot: "4 PM - 7 PM",
    deliveryInstructions: null,
    subtotalInr: Number(product.priceInr || 0),
    deliveryInr: 0,
    discountInr: 0,
    totalInr: Number(product.priceInr || 0),
    userId: userId.toHexString(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  await db.collection("orderItems").insertOne({
    _id: new ObjectId(),
    orderId: orderId.toHexString(),
    productId: product._id.toHexString(),
    productName: product.name,
    quantity: 1,
    priceInr: Number(product.priceInr || 0),
    message: null,
    instructions: null,
    deliveryDate: "2026-03-27",
    deliverySlot: "4 PM - 7 PM",
    createdAt: new Date()
  });

  await client.close();
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

async function loginAdmin() {
  await page.goto(`${baseUrl}/login?callbackUrl=/admin`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.fill('input[name="email"]', "admin@cnc.local");
  await page.fill('input[name="password"]', "admin123");
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(1500);
  if (!page.url().includes("/admin")) {
    throw new Error(`Admin login did not reach /admin. Current URL: ${page.url()}`);
  }
}

async function setStatus(status) {
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded", timeout: 60000 });
  const row = page.locator(`[data-testid="admin-order-${orderNumber}"]`).first();
  await row.waitFor({ state: "visible", timeout: 30000 });
  await row.locator(`[data-testid="admin-order-status-${orderNumber}"]`).selectOption(status);
  await row.locator(`[data-testid="admin-order-update-${orderNumber}"]`).click();
  await page.waitForTimeout(1200);
}

async function readTracking() {
  await page.goto(`${baseUrl}/track-order?order=${orderNumber}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(500);
  return page.locator(".tracking-step").evaluateAll((nodes) =>
    nodes.map((node) => ({
      text: (node.textContent || "").replace(/\s+/g, " ").trim(),
      cls: node.className
    }))
  );
}

await seedOrder();
await loginAdmin();

const results = [];
for (const status of statuses) {
  await setStatus(status);
  const tracking = await readTracking();
  results.push({ status, tracking });
}

console.log(JSON.stringify({ orderNumber, results }, null, 2));
await browser.close();
