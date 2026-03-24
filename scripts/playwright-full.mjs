import fs from "fs/promises";
import os from "os";
import path from "path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3001";
const unique = Date.now().toString().slice(-8);
const customer = {
  name: `QA User ${unique}`,
  email: `qa-${unique}@example.com`,
  password: `QaPass!${unique}`
};

function tomorrowIso() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

async function expectVisible(page, selector, label) {
  await page.locator(selector).first().waitFor({ state: "visible", timeout: 20000 });
  console.log(`ok: ${label}`);
}

async function writeTempPng() {
  const filePath = path.join(os.tmpdir(), `cnc-${unique}.png`);
  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnE9nEAAAAASUVORK5CYII=";
  await fs.writeFile(filePath, Buffer.from(pngBase64, "base64"));
  return filePath;
}

const browser = await chromium.launch({ headless: false, slowMo: 120 });

try {
  const publicContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await publicContext.newPage();

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await expectVisible(page, ".menu-drawer-trigger", "menu trigger");
  await page.locator(".menu-drawer-trigger").click();
  await expectVisible(page, ".menu-drawer-panel-open", "menu open");
  await page.mouse.click(900, 220);
  await page.locator(".menu-drawer-panel-open").waitFor({ state: "hidden", timeout: 10000 });
  console.log("ok: menu closes on outside click");
  await page.locator(".menu-drawer-trigger").click();
  await page.keyboard.press("Escape");
  await page.locator(".menu-drawer-panel-open").waitFor({ state: "hidden", timeout: 10000 });
  console.log("ok: menu closes on escape");

  await page.goto(`${baseUrl}/signup`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(page, 'input[name="name"]', "signup page");
  await page.locator('input[name="name"]').fill(customer.name);
  await page.locator('input[name="email"]').fill(customer.email);
  await page.locator('input[name="password"]').fill(customer.password);
  await page.locator('input[name="confirmPassword"]').fill(customer.password);
  await page.locator('button:has-text("Create Account")').click();
  await page.waitForURL("**/login?registered=1", { timeout: 20000 });
  await expectVisible(page, "text=Account created", "signup success");

  await page.locator('input[name="email"]').fill(customer.email);
  await page.locator('input[name="password"]').fill(customer.password);
  await page.locator('button:has-text("Login")').click();
  await page.waitForURL("**/account", { timeout: 20000 });
  await expectVisible(page, "text=Recent Orders", "customer login");

  await page.goto(`${baseUrl}/product/persian-rose-pistachio`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(page, 'button:has-text("Add to Cart")', "product page");
  await page.locator('button:has-text("Add to Cart")').click();
  await page.waitForURL("**/cart", { timeout: 20000 });
  await page.locator('a:has-text("Proceed to Checkout")').click();
  await page.waitForURL("**/checkout", { timeout: 20000 });
  await page.locator('input[name="firstName"]').fill("QA");
  await page.locator('input[name="lastName"]').fill("Customer");
  await page.locator('input[name="email"]').fill(customer.email);
  await page.locator('input[name="phone"]').fill("9920554660");
  await page.locator('input[name="pincode"]').fill("400081");
  await page.locator('input[name="deliveryDate"]').fill(tomorrowIso());
  await page.locator('textarea[name="address"]').fill("Flat 101, QA Residency, Mulund East, Mumbai");
  await page.locator('button:has-text("Place Order")').click();
  await page.waitForURL("**/track-order**", { timeout: 20000 });
  const orderUrl = new URL(page.url());
  const orderNumber = orderUrl.searchParams.get("order");
  if (!orderNumber) throw new Error("Missing order number after checkout");
  console.log(`ok: checkout created order ${orderNumber}`);

  await page.goto(`${baseUrl}/custom-cakes`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(page, 'textarea[name="brief"]', "custom cakes page");
  await page.locator('textarea[name="brief"]').fill("Need a chocolate birthday cake with berries, clean piping, and a minimal celebration look.");
  await page.locator('select[name="occasion"]').selectOption("Birthday");
  await page.locator('input[name="eventDate"]').fill(tomorrowIso());
  await page.locator('input[name="servings"]').fill("18");
  await page.locator('select[name="budget"]').selectOption("₹10,000+");
  await page.locator('input[name="name"]').fill(customer.name);
  await page.locator('input[name="phone"]').fill("9920554660");
  await page.locator('input[name="email"]').fill(customer.email);
  await page.locator('input[name="flavorPreferences"]').fill("Dark chocolate, cherry compote, vanilla sponge");
  await page.locator('button:has-text("Submit Inquiry")').click();
  await page.waitForURL("**/custom-cakes?submitted=1", { timeout: 20000 });
  await expectVisible(page, "text=Your custom cake inquiry has been received", "custom request submit");

  const resetContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const resetPage = await resetContext.newPage();
  await resetPage.goto(`${baseUrl}/forgot-password`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(resetPage, 'input[name="email"]', "forgot password page");
  await resetPage.locator('input[name="email"]').fill(customer.email);
  await resetPage.locator('button:has-text("Send Reset Link")').click();
  await resetPage.waitForURL("**/forgot-password?sent=1**", { timeout: 20000 });
  const resetHref = await resetPage.locator('a:has-text("open reset form")').getAttribute("href");
  if (!resetHref) throw new Error("Missing reset link");
  await resetPage.goto(`${baseUrl}${resetHref}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(resetPage, 'input[name="password"]', "reset password page");
  const newPassword = `${customer.password}-new`;
  await resetPage.locator('input[name="password"]').fill(newPassword);
  await resetPage.locator('input[name="confirmPassword"]').fill(newPassword);
  await resetPage.locator('button:has-text("Update Password")').click();
  await resetPage.waitForURL("**/login?reset=1", { timeout: 20000 });
  await expectVisible(resetPage, "text=Password updated", "password reset");
  await resetPage.locator('input[name="email"]').fill(customer.email);
  await resetPage.locator('input[name="password"]').fill(newPassword);
  await resetPage.locator('button:has-text("Login")').click();
  await resetPage.waitForURL("**/account", { timeout: 20000 });
  console.log("ok: login with reset password");
  await resetContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const adminPage = await adminContext.newPage();
  const imagePath = await writeTempPng();
  const productSlug = `qa-brownie-${unique}`;
  const productName = `QA Brownie ${unique}`;

  await adminPage.goto(`${baseUrl}/login?callbackUrl=/admin`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(adminPage, 'input[name="email"]', "admin login page");
  await adminPage.locator('input[name="email"]').fill("admin@cnc.local");
  await adminPage.locator('input[name="password"]').fill("admin123");
  await adminPage.locator('button:has-text("Login")').click();
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, "text=Control products, brand assets, and orders.", "admin login");

  await adminPage.goto(`${baseUrl}/admin/products/new`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(adminPage, 'input[name="name"]', "admin product create page");
  await adminPage.locator('input[name="name"]').fill(productName);
  await adminPage.locator('input[name="slug"]').fill(productSlug);
  await adminPage.locator('input[name="category"]').fill("Brownies");
  await adminPage.locator('input[name="occasion"]').fill("Chocolate");
  await adminPage.locator('input[name="flavor"]').fill("Dark Chocolate");
  await adminPage.locator('input[name="weight"]').fill("6 pieces");
  await adminPage.locator('input[name="priceInr"]').fill("420");
  await adminPage.locator('input[name="badge"]').fill("Fresh Batch");
  await adminPage.locator('input[name="tagline"]').fill("Dense chocolate brownie squares");
  await adminPage.locator('textarea[name="description"]').fill("A fudgy brownie box for quick gifting and dessert cravings.");
  await adminPage.locator('textarea[name="detailBlurb"]').fill("Hand-cut brownie squares with a rich dark chocolate finish.");
  await adminPage.locator('input[name="seoBlurb"]').fill("Chocolate brownie gift box in Mulund East.");
  await adminPage.locator('input[name="imageUrl"]').fill("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80");
  await adminPage.locator('textarea[name="galleryCsv"]').fill("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80");
  await adminPage.locator('input[name="highlightsCsv"]').fill("Fudgy texture, Fresh batch");
  await adminPage.locator('input[name="ingredientsCsv"]').fill("Chocolate, Butter, Flour");
  await adminPage.locator('textarea[name="addOnsJson"]').fill('[{\"name\":\"Extra dip\",\"priceInr\":60}]');
  await adminPage.locator('button:has-text("Create Product")').click();
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, `text=${productName}`, "admin product create");

  const createdProductRow = adminPage.locator(`[data-testid="admin-product-${productSlug}"]`).first();
  await createdProductRow.locator('a:has-text("Edit")').click();
  await adminPage.waitForURL("**/edit", { timeout: 20000 });
  await adminPage.locator('input[name="priceInr"]').fill("460");
  await adminPage.locator('input[name="badge"]').fill("Top Seller");
  await adminPage.locator('button:has-text("Save Product")').click();
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, "text=₹460", "admin product edit");

  const productRow = adminPage.locator(`[data-testid="admin-product-${productSlug}"]`).first();
  await productRow.locator('button:has-text("Archive")').click();
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, `div.summary-row:has-text("${productName}") >> text=Inactive`, "admin archive product");

  const orderRow = adminPage.locator(`[data-testid="admin-order-${orderNumber}"]`).first();
  await orderRow.locator(`[data-testid="admin-order-status-${orderNumber}"]`).selectOption("BAKING");
  await orderRow.locator(`[data-testid="admin-order-update-${orderNumber}"]`).click();
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, `text=${orderNumber}`, "admin order status update");

  await adminPage.goto(`${baseUrl}/admin/requests`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(adminPage, "section.panel", "admin requests page");
  const requestRow = adminPage.locator(`section.panel:has-text("${customer.name}")`).first();
  const requestId = await requestRow.getAttribute("data-testid");
  if (!requestId) throw new Error("Missing request test id");
  const requestSuffix = requestId.replace("admin-request-", "");
  await adminPage.locator(`[data-testid="admin-request-status-${requestSuffix}"]`).selectOption("CONTACTED");
  await adminPage.locator(`[data-testid="admin-request-notes-${requestSuffix}"]`).fill("Reached out on WhatsApp for design confirmation.");
  await adminPage.locator(`[data-testid="admin-request-save-${requestSuffix}"]`).click();
  await adminPage.waitForURL("**/admin/requests", { timeout: 20000 });
  await expectVisible(adminPage, `section.panel:has-text("${customer.name}") >> text=CONTACTED`, "admin custom request update");

  await adminPage.goto(`${baseUrl}/admin/brand`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(adminPage, 'input[name="label"]', "admin brand page");
  await adminPage.locator('input[name="label"]').fill(`QA Asset ${unique}`);
  await adminPage.locator('select[name="type"]').selectOption("POSTER");
  await adminPage.locator('input[name="image"]').setInputFiles(imagePath);
  await adminPage.locator('button:has-text("Upload Asset")').click();
  await adminPage.waitForURL("**/admin/brand", { timeout: 20000 });
  await expectVisible(adminPage, `text=QA Asset ${unique}`, "admin brand upload");

  await adminContext.close();
  await publicContext.close();
  console.log("full regression completed");
} finally {
  await browser.close();
}
