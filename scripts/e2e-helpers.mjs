import { chromium } from "playwright";

export const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";

const headlessValue = String(process.env.HEADLESS || "").toLowerCase();
export const headless = !["0", "false", "no"].includes(headlessValue);
export const slowMo = headless ? 0 : Number(process.env.SLOW_MO || 120);

export function appUrl(path = "/") {
  return new URL(path, baseUrl).toString();
}

export async function launchBrowser() {
  return chromium.launch({ headless, slowMo });
}

export async function newViewportContext(browser) {
  return browser.newContext({ viewport: { width: 1440, height: 920 } });
}

export async function goto(page, path, options = {}) {
  await page.goto(appUrl(path), {
    waitUntil: options.waitUntil || "domcontentloaded",
    timeout: options.timeout || 30000
  });
}

export async function expectVisible(page, selector, label, timeout = 15000) {
  await page.locator(selector).first().waitFor({ state: "visible", timeout });
  console.log(`ok: ${label}`);
}

export async function fill(page, selector, value) {
  await page.locator(selector).first().fill(value);
}

export async function click(page, selector) {
  await page.locator(selector).first().click();
}
