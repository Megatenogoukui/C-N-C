import { click, expectVisible, fill, goto, launchBrowser, newViewportContext } from "./e2e-helpers.mjs";

const browser = await launchBrowser();
const customerContext = await newViewportContext(browser);
const page = await customerContext.newPage();

try {
  await goto(page, "/", { waitUntil: "networkidle" });
  await expectVisible(page, 'text=C "N" C', "home brand");
  await expectVisible(page, "h1", "home hero");

  await goto(page, "/shop", { waitUntil: "networkidle" });
  await expectVisible(page, "h1", "shop heading");
  await goto(page, "/product/persian-rose-pistachio", { waitUntil: "networkidle" });

  await expectVisible(page, 'button:has-text("Add to Cart")', "product CTA");
  await click(page, 'button:has-text("Add to Cart")');

  await page.waitForURL("**/cart", { timeout: 15000 });
  await expectVisible(page, "h1", "cart heading");
  await expectVisible(page, "text=Persian Rose & Pistachio", "cart line item");
  await click(page, 'a:has-text("Proceed to Checkout")');

  await page.waitForURL("**/checkout", { timeout: 15000 });
  await expectVisible(page, 'button:has-text("Place Order")', "checkout CTA");
  await fill(page, 'input[name="firstName"]', "Test");
  await fill(page, 'input[name="lastName"]', "User");
  await fill(page, 'input[name="email"]', "test@example.com");
  await fill(page, 'input[name="phone"]', "9999999999");
  await fill(page, 'input[name="pincode"]', "400081");
  await fill(page, 'input[name="deliveryDate"]', "2026-03-27");
  await fill(page, 'textarea[name="address"]', "Flat 101, Mulund East, Mumbai");
  await click(page, 'button:has-text("Place Order")');

  await page.waitForURL("**/track-order**", { timeout: 15000 });
  await expectVisible(page, "text=Order", "tracking page");
  await expectVisible(page, "text=Current stage", "tracking current stage");

  await goto(page, "/custom-cakes", { waitUntil: "networkidle" });
  await expectVisible(page, 'text=Design Consultation', "custom cake form");
  await fill(page, 'textarea[name="brief"]', "Need a chocolate birthday cake with berries and minimal piping.");
  await page.locator('select[name="occasion"]').selectOption("Birthday");
  await fill(page, 'input[name="eventDate"]', "2026-03-27");
  await fill(page, 'input[name="servings"]', "18");
  await page.locator('select[name="budget"]').selectOption("₹10,000+");
  await fill(page, 'input[name="name"]', "Test User");
  await fill(page, 'input[name="phone"]', "9999999999");
  await fill(page, 'input[name="email"]', "test@example.com");
  await fill(page, 'input[name="flavorPreferences"]', "Dark chocolate, berry compote, vanilla sponge");
  await click(page, 'button:has-text("Submit Inquiry")');
  await page.waitForURL("**/custom-cakes?submitted=1", { timeout: 15000 });
  await expectVisible(page, "text=Your custom cake inquiry has been received", "custom cake submit");

  await goto(page, "/login", { waitUntil: "networkidle" });
  await fill(page, 'input[name="email"]', "customer@cnc.local");
  await fill(page, 'input[name="password"]', "customer123");
  await click(page, 'button:has-text("Login")');
  await page.waitForURL("**/account", { timeout: 15000 });
  await expectVisible(page, "text=Recent Orders", "account page");
  await customerContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 920 } });
  const adminPage = await adminContext.newPage();

  await goto(adminPage, "/login?callbackUrl=/admin", { waitUntil: "networkidle" });
  await fill(adminPage, 'input[name="email"]', "admin@cnc.local");
  await fill(adminPage, 'input[name="password"]', "admin123");
  await click(adminPage, 'button:has-text("Login")');
  await adminPage.waitForURL("**/admin", { timeout: 15000 });
  await expectVisible(adminPage, "text=Admin dashboard.", "admin page");
  await expectVisible(adminPage, 'button:has-text("Update")', "admin order controls");
  await goto(adminPage, "/admin/products/new", { waitUntil: "networkidle" });
  await expectVisible(adminPage, "text=Create a product", "admin new product page");
  await adminContext.close();

  console.log("smoke run completed");
} finally {
  if (customerContext.pages().length > 0) {
    await page.waitForTimeout(1000).catch(() => {});
  }
  await customerContext.close().catch(() => {});
  await browser.close();
}
