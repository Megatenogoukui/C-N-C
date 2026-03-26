import fs from "fs/promises";
import os from "os";
import path from "path";
import { appUrl, click, expectVisible, fill, goto, launchBrowser, newViewportContext } from "./e2e-helpers.mjs";

const unique = Date.now().toString().slice(-8);
const customer = {
  name: `QA User ${unique}`,
  email: `qa-${unique}@example.com`,
  password: `QaPass!${unique}`
};
const trackingTitles = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  BAKING: "Baking",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered"
};

function tomorrowIso() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

async function writeTempPng() {
  const filePath = path.join(os.tmpdir(), `cnc-${unique}.png`);
  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnE9nEAAAAASUVORK5CYII=";
  await fs.writeFile(filePath, Buffer.from(pngBase64, "base64"));
  return filePath;
}

const browser = await launchBrowser();

try {
  const publicContext = await newViewportContext(browser);
  const page = await publicContext.newPage();

  await goto(page, "/", { timeout: 60000 });
  await expectVisible(page, ".menu-drawer-trigger", "menu trigger");
  await page.locator(".menu-drawer-trigger").click();
  await expectVisible(page, ".menu-drawer-panel-open", "menu open");
  await page.locator(".menu-drawer-backdrop").click();
  await page.locator(".menu-drawer-panel-open").waitFor({ state: "hidden", timeout: 10000 });
  console.log("ok: menu closes on outside click");
  await page.locator(".menu-drawer-trigger").click();
  await page.keyboard.press("Escape");
  await page.locator(".menu-drawer-panel-open").waitFor({ state: "hidden", timeout: 10000 });
  console.log("ok: menu closes on escape");

  await goto(page, "/signup", { timeout: 30000 });
  await expectVisible(page, 'input[name="name"]', "signup page");
  await fill(page, 'input[name="name"]', customer.name);
  await fill(page, 'input[name="email"]', customer.email);
  await fill(page, 'input[name="phone"]', "9920554660");
  await fill(page, 'textarea[name="address"]', "Flat 101, QA Residency, Mulund East, Mumbai");
  await fill(page, 'input[name="pincode"]', "400081");
  await fill(page, 'input[name="password"]', customer.password);
  await fill(page, 'input[name="confirmPassword"]', customer.password);
  await click(page, 'button:has-text("Create Account")');
  await page.waitForURL("**/login?registered=1", { timeout: 20000 });
  await expectVisible(page, "text=Account created", "signup success");

  await fill(page, 'input[name="email"]', customer.email);
  await fill(page, 'input[name="password"]', customer.password);
  await click(page, 'button:has-text("Login")');
  await page.waitForURL("**/account", { timeout: 20000 });
  await expectVisible(page, "text=Recent Orders", "customer login");

  await goto(page, "/product/persian-rose-pistachio", { timeout: 30000 });
  await expectVisible(page, 'button:has-text("Add to Cart")', "product page");
  await click(page, 'button:has-text("Add to Cart")');
  await page.waitForURL("**/cart", { timeout: 20000 });
  await expectVisible(page, "text=Persian Rose & Pistachio", "cart line item");
  await click(page, 'a:has-text("Proceed to Checkout")');
  await page.waitForURL("**/checkout", { timeout: 20000 });
  await fill(page, 'input[name="firstName"]', "QA");
  await fill(page, 'input[name="lastName"]', "Customer");
  await fill(page, 'input[name="email"]', customer.email);
  await fill(page, 'input[name="phone"]', "9920554660");
  await fill(page, 'input[name="pincode"]', "400081");
  await fill(page, 'input[name="deliveryDate"]', tomorrowIso());
  await fill(page, 'textarea[name="address"]', "Flat 101, QA Residency, Mulund East, Mumbai");
  await click(page, 'button:has-text("Place Order")');
  await page.waitForURL("**/track-order**", { timeout: 20000 });
  const orderUrl = new URL(page.url());
  const orderNumber = orderUrl.searchParams.get("order");
  if (!orderNumber) throw new Error("Missing order number after checkout");
  console.log(`ok: checkout created order ${orderNumber}`);
  await expectVisible(page, `text=${orderNumber}`, "tracking page includes order number");

  await goto(page, "/custom-cakes", { timeout: 30000 });
  await expectVisible(page, 'textarea[name="brief"]', "custom cakes page");
  await fill(page, 'textarea[name="brief"]', "Need a chocolate birthday cake with berries, clean piping, and a minimal celebration look.");
  await page.locator('select[name="occasion"]').selectOption("Birthday");
  await fill(page, 'input[name="eventDate"]', tomorrowIso());
  await fill(page, 'input[name="servings"]', "18");
  await page.locator('select[name="budget"]').selectOption("₹10,000+");
  await fill(page, 'input[name="name"]', customer.name);
  await fill(page, 'input[name="phone"]', "9920554660");
  await fill(page, 'input[name="email"]', customer.email);
  await fill(page, 'input[name="flavorPreferences"]', "Dark chocolate, cherry compote, vanilla sponge");
  await click(page, 'button:has-text("Submit Inquiry")');
  await page.waitForURL("**/custom-cakes?submitted=1", { timeout: 20000 });
  await expectVisible(page, "text=Your custom cake inquiry has been received", "custom request submit");

  const resetContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const resetPage = await resetContext.newPage();
  await goto(resetPage, "/forgot-password", { timeout: 30000 });
  await expectVisible(resetPage, 'input[name="email"]', "forgot password page");
  await fill(resetPage, 'input[name="email"]', customer.email);
  await click(resetPage, 'button:has-text("Send Reset Link")');
  await resetPage.waitForURL("**/forgot-password?sent=1**", { timeout: 20000 });
  const resetHref = await resetPage.locator('a:has-text("open reset form")').getAttribute("href");
  if (!resetHref) throw new Error("Missing reset link");
  await resetPage.goto(appUrl(resetHref), { waitUntil: "domcontentloaded", timeout: 30000 });
  await expectVisible(resetPage, 'input[name="password"]', "reset password page");
  const newPassword = `${customer.password}-new`;
  await fill(resetPage, 'input[name="password"]', newPassword);
  await fill(resetPage, 'input[name="confirmPassword"]', newPassword);
  await click(resetPage, 'button:has-text("Update Password")');
  await resetPage.waitForURL("**/login?reset=1", { timeout: 20000 });
  await expectVisible(resetPage, "text=Password updated", "password reset");
  await fill(resetPage, 'input[name="email"]', customer.email);
  await fill(resetPage, 'input[name="password"]', newPassword);
  await click(resetPage, 'button:has-text("Login")');
  await resetPage.waitForURL("**/account", { timeout: 20000 });
  console.log("ok: login with reset password");
  await resetContext.close();

  const adminContext = await newViewportContext(browser);
  const adminPage = await adminContext.newPage();
  const imagePath = await writeTempPng();
  const productSlug = `qa-brownie-${unique}`;
  const productName = `QA Brownie ${unique}`;

  await goto(adminPage, "/login?callbackUrl=/admin", { timeout: 30000 });
  await expectVisible(adminPage, 'input[name="email"]', "admin login page");
  await fill(adminPage, 'input[name="email"]', "admin@cnc.local");
  await fill(adminPage, 'input[name="password"]', "admin123");
  await click(adminPage, 'button:has-text("Login")');
  await adminPage.waitForURL("**/admin", { timeout: 20000 });
  await expectVisible(adminPage, "text=Admin dashboard.", "admin login");

  await goto(adminPage, "/admin/products/new", { timeout: 30000 });
  await expectVisible(adminPage, 'input[name="name"]', "admin product create page");
  await fill(adminPage, 'input[name="name"]', productName);
  await fill(adminPage, 'input[name="slug"]', productSlug);
  await fill(adminPage, 'input[name="category"]', "Brownies");
  await fill(adminPage, 'input[name="occasion"]', "Chocolate");
  await fill(adminPage, 'input[name="flavor"]', "Dark Chocolate");
  await fill(adminPage, 'input[name="weight"]', "6 pieces");
  await fill(adminPage, 'input[name="priceInr"]', "420");
  await fill(adminPage, 'input[name="badge"]', "Fresh Batch");
  await fill(adminPage, 'input[name="tagline"]', "Dense chocolate brownie squares");
  await fill(adminPage, 'textarea[name="description"]', "A fudgy brownie box for quick gifting and dessert cravings.");
  await fill(adminPage, 'textarea[name="detailBlurb"]', "Hand-cut brownie squares with a rich dark chocolate finish.");
  await fill(adminPage, 'input[name="seoBlurb"]', "Chocolate brownie gift box in Mulund East.");
  await fill(adminPage, 'input[name="imageUrl"]', "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80");
  await fill(adminPage, 'textarea[name="galleryCsv"]', "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80");
  await fill(adminPage, 'input[name="highlightsCsv"]', "Fudgy texture, Fresh batch");
  await fill(adminPage, 'input[name="ingredientsCsv"]', "Chocolate, Butter, Flour");
  await fill(adminPage, 'textarea[name="addOnsJson"]', '[{"name":"Extra dip","priceInr":60}]');
  await adminPage.locator("form").evaluate((form) => form.requestSubmit());
  try {
    await adminPage.waitForURL("**/admin", { timeout: 20000, waitUntil: "domcontentloaded" });
  } catch (error) {
    const url = adminPage.url();
    const errorText = await adminPage.locator(".info-card").first().innerText().catch(() => "");
    throw new Error(`Create product did not redirect. url=${url} error=${errorText} cause=${error instanceof Error ? error.message : String(error)}`);
  }
  await expectVisible(adminPage, `text=${productName}`, "admin product create");

  const createdProductRow = adminPage.locator(`[data-testid="admin-product-${productSlug}"]`).first();
  await createdProductRow.locator('a:has-text("Edit")').click();
  await adminPage.waitForURL("**/edit", { timeout: 20000 });
  await fill(adminPage, 'input[name="priceInr"]', "460");
  await fill(adminPage, 'input[name="badge"]', "Top Seller");
  await click(adminPage, 'button:has-text("Save Product")');
  await adminPage.waitForURL("**/admin", { timeout: 20000, waitUntil: "domcontentloaded" });
  await expectVisible(adminPage, "text=₹460", "admin product edit");

  const productRow = adminPage.locator(`[data-testid="admin-product-${productSlug}"]`).first();
  await productRow.locator('button:has-text("Archive")').click();
  await adminPage.waitForURL("**/admin", { timeout: 20000, waitUntil: "domcontentloaded" });
  await expectVisible(adminPage, `div.summary-row:has-text("${productName}") >> text=Inactive`, "admin archive product");

  const orderRow = adminPage.locator(`[data-testid="admin-order-${orderNumber}"]`).first();
  await orderRow.locator(`[data-testid="admin-order-status-${orderNumber}"]`).selectOption("BAKING");
  await orderRow.locator(`[data-testid="admin-order-update-${orderNumber}"]`).click();
  await adminPage.waitForURL("**/admin", { timeout: 20000, waitUntil: "domcontentloaded" });
  await expectVisible(adminPage, `text=${orderNumber}`, "admin order status update");
  await goto(adminPage, `/track-order?order=${orderNumber}`, { timeout: 30000 });
  await expectVisible(adminPage, `text=${trackingTitles.BAKING}`, "customer tracking updated");
  await expectVisible(adminPage, "text=Current stage", "tracking current stage label");

  await goto(adminPage, "/admin/requests", { timeout: 30000 });
  await expectVisible(adminPage, "section.panel", "admin requests page");
  const requestRow = adminPage.locator(`section.panel:has-text("${customer.name}")`).first();
  const requestId = await requestRow.getAttribute("data-testid");
  if (!requestId) throw new Error("Missing request test id");
  const requestSuffix = requestId.replace("admin-request-", "");
  await adminPage.locator(`[data-testid="admin-request-status-${requestSuffix}"]`).selectOption("CONTACTED");
  await fill(adminPage, `[data-testid="admin-request-notes-${requestSuffix}"]`, "Reached out on WhatsApp for design confirmation.");
  await click(adminPage, `[data-testid="admin-request-save-${requestSuffix}"]`);
  await adminPage.waitForURL("**/admin/requests", { timeout: 20000, waitUntil: "domcontentloaded" });
  await expectVisible(adminPage, `section.panel:has-text("${customer.name}") >> text=CONTACTED`, "admin custom request update");

  await goto(adminPage, "/admin/brand", { timeout: 30000 });
  await expectVisible(adminPage, 'input[name="label"]', "admin brand page");
  await fill(adminPage, 'input[name="label"]', `QA Asset ${unique}`);
  await adminPage.locator('select[name="type"]').selectOption("POSTER");
  await adminPage.locator('input[name="image"]').setInputFiles(imagePath);
  await click(adminPage, 'button:has-text("Upload Asset")');
  await adminPage.waitForURL("**/admin/brand", { timeout: 20000, waitUntil: "domcontentloaded" });
  await expectVisible(adminPage, `text=QA Asset ${unique}`, "admin brand upload");

  await adminContext.close();
  await publicContext.close();
  console.log("full regression completed");
} finally {
  await browser.close();
}
