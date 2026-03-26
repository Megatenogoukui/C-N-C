import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getBrandAssets } from "@/lib/brand";
import { businessConfig, getWhatsAppUrl } from "@/lib/business";
import { readCartCount } from "@/lib/cart";
import { MenuDrawer } from "@/components/menu-drawer";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/about", label: "Our Story" },
  { href: "/blog", label: "Journal" }
];

const adminNavItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/requests", label: "Custom Requests" },
  { href: "/admin/story", label: "Story" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/brand", label: "Brand Assets" }
];

export async function SiteChrome({
  children
}: {
  children: React.ReactNode;
}) {
  const [session, cartCount, assets] = await Promise.all([
    auth(),
    readCartCount(),
    getBrandAssets()
  ]);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="announcement-bar">
          <div className="container announcement-bar-inner">
            <p>Freshly baked in {businessConfig.city} • Delivery across {businessConfig.serviceablePincodes.length} local pincodes</p>
            <div className="announcement-links">
              <Link href="/track-order">Track order</Link>
              <Link href={getWhatsAppUrl("Hello C N C, I need help choosing a cake.")}>WhatsApp concierge</Link>
            </div>
          </div>
        </div>
        <div className="container site-nav">
          <MenuDrawer
            accountHref={session?.user ? (isAdmin ? "/admin" : "/account") : undefined}
            accountLabel={session?.user ? (isAdmin ? "Admin" : "Account") : undefined}
            cartCount={cartCount}
            navItems={isAdmin ? adminNavItems : navItems}
            supportHref={getWhatsAppUrl("Hello C N C, I need help with an order.")}
            variant={isAdmin ? "admin" : "store"}
          />
          <Link href="/" className="brand-mark site-brand">
            {assets.logo ? (
              <Image src={assets.logo.imageUrl} alt='C "N" C logo' width={72} height={72} style={{ width: "auto", height: 52 }} />
            ) : (
              <span className="brand">C "N" C</span>
            )}
            <span className="brand-subtitle">Cakes "N" Chocolates</span>
          </Link>
          <div className="header-spacer">
            {isAdmin ? null : (
              <Link href="/cart" className="header-cart-link" aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
                Cart
                <span>{cartCount}</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
      {isAdmin ? null : (
        <>
          <Link href={getWhatsAppUrl("Hello C N C, I want to order cakes or chocolates.")} className="whatsapp-fab" aria-label="WhatsApp support">
            WA
          </Link>
          <nav className="mobile-nav">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/custom-cakes">Custom</Link>
            <Link href="/cart">Cart</Link>
          </nav>
        </>
      )}
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
            <div className="footer-highlight-list">
              <span>Birthday preorders</span>
              <span>WhatsApp support</span>
              <span>Tracked delivery</span>
            </div>
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
