import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getBrandAssets } from "@/lib/brand";
import { businessConfig, getWhatsAppUrl } from "@/lib/business";
import { readCartLines } from "@/lib/cart";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" }
];

export async function SiteChrome({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cart = await readCartLines();
  const assets = await getBrandAssets();

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container site-nav">
          <nav className="nav-links desktop-only">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <details className="mobile-menu mobile-only">
            <summary>Menu</summary>
            <div className="mobile-menu-panel">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href={getWhatsAppUrl("Hello C N C, I need help with an order.")}>WhatsApp Support</Link>
              {session?.user ? (
                <Link href={session.user.role === "ADMIN" ? "/admin" : "/account"}>
                  {session.user.role === "ADMIN" ? "Admin" : "Account"}
                </Link>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/signup">Sign Up</Link>
                </>
              )}
            </div>
          </details>
          <Link href="/" className="brand-mark">
            {assets.logo ? (
              <Image src={assets.logo.imageUrl} alt='C "N" C logo' width={72} height={72} style={{ width: "auto", height: 52 }} />
            ) : (
              <span className="brand">C "N" C</span>
            )}
            <span className="brand-subtitle">Cakes "N" Chocolates</span>
          </Link>
          <div className="nav-actions desktop-only">
            <Link className="button-small" href={getWhatsAppUrl("Hello C N C, I need help with an order.")}>
              WhatsApp Support
            </Link>
            {session?.user ? <Link className="button-small" href={session.user.role === "ADMIN" ? "/admin" : "/account"}>{session.user.role === "ADMIN" ? "Admin" : "Account"}</Link> : (
              <>
                <Link className="button-small" href="/login">Login</Link>
                <Link className="button-small" href="/signup">Sign Up</Link>
              </>
            )}
            <Link className="button-small" href="/cart">
              Cart{cart.count ? ` (${cart.count})` : ""}
            </Link>
            {session?.user ? <LogoutButton /> : null}
          </div>
          <div className="mobile-header-actions mobile-only">
            <Link className="button-small" href="/cart">
              Cart{cart.count ? ` (${cart.count})` : ""}
            </Link>
          </div>
        </div>
      </header>
      {children}
      <Link href={getWhatsAppUrl("Hello C N C, I want to order cakes or chocolates.")} className="whatsapp-fab" aria-label="WhatsApp support">
        WA
      </Link>
      <nav className="mobile-nav">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/custom-cakes">Custom</Link>
        <Link href="/cart">Cart</Link>
      </nav>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="brand-mark" style={{ alignItems: "flex-start" }}>
              {assets.logo ? <Image src={assets.logo.imageUrl} alt='C "N" C logo' width={60} height={60} style={{ width: "auto", height: 42 }} /> : <span className="brand" style={{ fontSize: 26 }}>C "N" C</span>}
              <span className="brand-subtitle">Cakes "N" Chocolates</span>
            </div>
            <p style={{ marginTop: 16, maxWidth: 320 }}>
              Homemade treats, cakes, brownies, cupcakes, and chocolates crafted for celebrations in {businessConfig.city}.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18 }}>Collections</h4>
            <p style={{ marginTop: 14 }}>
              <Link href="/shop?occasion=Birthday">Birthday</Link>
            </p>
            <p>
              <Link href="/shop?occasion=Anniversary">Anniversary</Link>
            </p>
            <p>
              <Link href="/shop?eggless=1">Eggless</Link>
            </p>
            <p>
              <Link href="/shop?occasion=Chocolate">Chocolate</Link>
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18 }}>Boutique</h4>
            <p style={{ marginTop: 14 }}>
              <Link href="/about">Our Story</Link>
            </p>
            <p>
              <Link href="/custom-cakes">Custom Cakes</Link>
            </p>
            <p>
              <Link href="/faq">FAQ</Link>
            </p>
            <p>
              <Link href="/track-order">Track Order</Link>
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18 }}>Support</h4>
            <p style={{ marginTop: 14 }}>WhatsApp concierge</p>
            <p>COD and prepaid checkout</p>
            <p>Single-city managed delivery</p>
            <p>SEO-ready editorial content</p>
          </div>
        </div>
        <div className="container footer-note">
          © 2026 C "N" C Cakes "N" Chocolates. Homemade treats for you.
        </div>
      </footer>
    </div>
  );
}
