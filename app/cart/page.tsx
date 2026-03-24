import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { updateCart } from "@/app/actions";
import { readCartLines } from "@/lib/cart";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your curated cart, gifting add-ons, and delivery subtotal."
};

export default async function CartPage() {
  const cart = await readCartLines();

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Cart</span>
        <h1 className="page-title">Curated for your celebration.</h1>
        <div className="cart-layout" style={{ marginTop: 28 }}>
          <section className="panel cart-panel">
            {cart.lines.length > 0 ? (
              cart.lines.map((line) => (
                <article className="cart-line" key={line.slug}>
                  <div className="cart-line-image">
                    <Image src={line.product.image} alt={line.product.name} fill sizes="96px" />
                  </div>
                  <div className="cart-line-content">
                    <h3 className="cart-line-title">{line.product.name}</h3>
                    <p className="cart-line-meta">
                      {line.product.flavor} • {line.product.weight}
                    </p>
                    <div className="cart-line-actions">
                      <form action={updateCart}>
                        <input type="hidden" name="slug" value={line.slug} />
                        <input type="hidden" name="action" value="decrease" />
                        <button className="button-small" type="submit">
                          −
                        </button>
                      </form>
                      <span>{line.quantity}</span>
                      <form action={updateCart}>
                        <input type="hidden" name="slug" value={line.slug} />
                        <input type="hidden" name="action" value="increase" />
                        <button className="button-small" type="submit">
                          +
                        </button>
                      </form>
                      <form action={updateCart}>
                        <input type="hidden" name="slug" value={line.slug} />
                        <input type="hidden" name="action" value="remove" />
                        <button className="button-ghost" type="submit">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                  <strong className="price cart-line-price">{formatInr(line.product.priceInr)}</strong>
                </article>
              ))
            ) : (
              <div className="info-card">
                <h3>Your cart is empty.</h3>
                <p style={{ marginTop: 12 }}>
                  Start in the shop, or move into custom cakes if you already know the celebration needs a bespoke centerpiece.
                </p>
                <div className="cta-row" style={{ marginTop: 18 }}>
                  <Link className="button" href="/shop">
                    Browse Cakes
                  </Link>
                  <Link className="button-ghost" href="/custom-cakes">
                    Custom Inquiry
                  </Link>
                </div>
              </div>
            )}
          </section>

          <aside className="summary-card cart-summary-card">
            <h3 style={{ fontSize: 30 }}>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatInr(cart.subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{formatInr(cart.delivery)}</strong>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <strong>-{formatInr(cart.discount)}</strong>
            </div>
            <div className="summary-row" style={{ paddingTop: 18, borderTop: "1px solid rgba(211,195,189,0.5)" }}>
              <span>Total</span>
              <strong className="price">{formatInr(cart.total)}</strong>
            </div>
            <label style={{ display: "block", marginTop: 18 }}>
              <span className="field-label">Coupon</span>
              <input className="input" placeholder="BLOOMFIRST" />
            </label>
            <div className="cta-row" style={{ marginTop: 18 }}>
              <Link className="button" href="/checkout">
                Proceed to Checkout
              </Link>
              <Link className="button-ghost" href="/shop">
                Keep Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
