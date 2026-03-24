import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3001";

async function expectVisible(page, selector, label) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout: 15000 });
  console.log(`ok: ${label}`);
}

const browser = await chromium.launch({ headless: false, slowMo: 150 });
const customerContext = await browser.newContext({ viewport: { width: 1440, height: 920 } });
const page = await customerContext.newPage();

try {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 30000 });
  await expectVisible(page, 'text=C "N" C', "home brand");

  await page.goto(`${baseUrl}/shop`, { waitUntil: "networkidle", timeout: 30000 });
  await expectVisible(page, "h1", "shop heading");
  await page.goto(`${baseUrl}/product/persian-rose-pistachio`, { waitUntil: "networkidle", timeout: 30000 });

  await expectVisible(page, 'button:has-text("Add to Cart")', "product CTA");
  await page.locator('button:has-text("Add to Cart")').first().click();

  await page.waitForURL("**/cart", { timeout: 15000 });
  await expectVisible(page, "h1", "cart heading");
  await page.locator('a:has-text("Proceed to Checkout")').click();

  await page.waitForURL("**/checkout", { timeout: 15000 });
  await expectVisible(page, 'button:has-text("Place Order")', "checkout CTA");
  await page.locator('input[required]').first().fill("Test");
  const requiredInputs = page.locator('input[required]');
  await requiredInputs.nth(1).fill("User");
  await requiredInputs.nth(2).fill("test@example.com");
  await requiredInputs.nth(3).fill("9999999999");
  await page.locator("textarea").first().fill("Mulund East, Mumbai");
  await page.locator('button:has-text("Place Order")').click();

  await page.waitForURL("**/track-order**", { timeout: 15000 });
  await expectVisible(page, "text=Order", "tracking page");

  await page.goto(`${baseUrl}/custom-cakes`, { waitUntil: "networkidle", timeout: 30000 });
  await expectVisible(page, 'text=Design Consultation', "custom cake form");

  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator('input[name="email"]').fill("customer@cnc.local");
  await page.locator('input[name="password"]').fill("customer123");
  await page.locator('button:has-text("Login")').click();
  await page.waitForURL("**/account", { timeout: 15000 });
  await expectVisible(page, "text=Recent Orders", "account page");

  await page.locator('button:has-text("Logout")').click();
  await page.waitForURL(baseUrl + "/", { timeout: 15000 });
  await expectVisible(page, 'a:has-text("Login")', "logout state");

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 920 } });
  const adminPage = await adminContext.newPage();

  await adminPage.goto(`${baseUrl}/login?callbackUrl=/admin`, { waitUntil: "networkidle", timeout: 30000 });
  await adminPage.locator('input[name="email"]').fill("admin@cnc.local");
  await adminPage.locator('input[name="password"]').fill("admin123");
  await adminPage.locator('button:has-text("Login")').click();
  await adminPage.waitForURL("**/admin", { timeout: 15000 });
  await expectVisible(adminPage, "text=Control products, brand assets, and orders.", "admin page");
  await expectVisible(adminPage, 'button:has-text("Accept")', "admin order controls");
  await adminPage.goto(`${baseUrl}/admin/products/new`, { waitUntil: "networkidle", timeout: 30000 });
  await expectVisible(adminPage, "text=Create a product", "admin new product page");
  await adminContext.close();

  console.log("smoke run completed");
} finally {
  await page.waitForTimeout(1000);
  await customerContext.close();
  await browser.close();
}
