import type { Metadata } from "next";
import { submitCheckout } from "@/app/actions";
import { businessConfig } from "@/lib/business";
import { readCartLines } from "@/lib/cart";
import { formatInr } from "@/lib/storefront-data";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure guest or account checkout with COD and prepaid options."
};

type CheckoutPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const cart = await readCartLines();
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container">
        <span className="eyebrow">Checkout</span>
        <h1 style={{ fontSize: 64 }}>Luxury checkout, without friction.</h1>
        <div className="custom-layout" style={{ marginTop: 28 }}>
          <section className="panel">
            {params.error ? (
              <div className="info-card" style={{ marginBottom: 18, color: "#8f2d24" }}>
                {params.error}
              </div>
            ) : null}
            <form action={submitCheckout} style={{ display: "grid", gap: 18 }}>
              <div className="field-grid two">
                <label><span className="field-label">First Name</span><input className="input" name="firstName" required /></label>
                <label><span className="field-label">Last Name</span><input className="input" name="lastName" required /></label>
                <label><span className="field-label">Email</span><input className="input" name="email" type="email" required /></label>
                <label><span className="field-label">Phone</span><input className="input" name="phone" required /></label>
                <label><span className="field-label">Pincode</span><input className="input" name="pincode" placeholder="400081" required /></label>
                <label><span className="field-label">Delivery Date</span><input className="input" name="deliveryDate" type="date" /></label>
                <label>
                  <span className="field-label">Delivery Slot</span>
                  <select className="select" name="slot" defaultValue={businessConfig.deliverySlots[2]}>
                    {businessConfig.deliverySlots.map((slot) => <option key={slot}>{slot}</option>)}
                  </select>
                </label>
                <label>
                  <span className="field-label">Order Type</span>
                  <select className="select" defaultValue="Guest checkout">
                    <option>Guest checkout</option>
                    <option>Login later</option>
                  </select>
                </label>
              </div>
              <label>
                <span className="field-label">Delivery Address</span>
                <textarea className="textarea" name="address" required placeholder="House number, street, locality, landmark" />
              </label>
              <div className="info-card">
                <h3 style={{ fontSize: 22 }}>Payment Mode</h3>
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input defaultChecked type="radio" name="payment" value="COD" />
                    Cash on Delivery
                  </label>
                  <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input type="radio" name="payment" value="ONLINE" disabled={!businessConfig.onlinePaymentsEnabled} />
                    Pay Online {!businessConfig.onlinePaymentsEnabled ? "(coming after gateway setup)" : ""}
                  </label>
                </div>
                <p style={{ marginTop: 10 }}>
                  We currently deliver only to {businessConfig.serviceablePincodes.join(", ")} in {businessConfig.city}.
                </p>
              </div>
              <label>
                <span className="field-label">Delivery Instructions</span>
                <textarea className="textarea" name="instructions" placeholder="Call on arrival, front gate security note, etc." />
              </label>
              <button className="button" type="submit">
                Place Order
              </button>
            </form>
          </section>

          <aside className="summary-card">
            <h3 style={{ fontSize: 28 }}>Checkout Summary</h3>
            {cart.lines.map((line) => (
              <div className="summary-row" key={line.slug}>
                <span>
                  {line.product.name} × {line.quantity}
                </span>
                <strong>{formatInr(line.product.priceInr * line.quantity)}</strong>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatInr(cart.subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{formatInr(cart.delivery)}</strong>
            </div>
            <div className="summary-row" style={{ paddingTop: 18, borderTop: "1px solid rgba(211,195,189,0.5)" }}>
              <span>Total</span>
              <strong className="price">{formatInr(cart.total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
