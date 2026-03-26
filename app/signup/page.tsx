import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { registerAction } from "@/lib/auth-actions";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a customer account to track orders, save details, and reorder faster."
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = await auth();
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container auth-shell">
        <div className="panel auth-panel">
          <span className="eyebrow">Create Account</span>
          <h1 style={{ fontSize: 42 }}>Sign up for faster ordering.</h1>
          <p style={{ marginTop: 12 }}>
            Save your details, track every order, and reorder without starting from scratch.
          </p>
          {session?.user ? (
            <div className="info-card" style={{ marginTop: 20 }}>
              You are already signed in as {session.user.email}. Go to{" "}
              <Link href={session.user.role === "ADMIN" ? "/admin" : "/account"}>your dashboard</Link>.
            </div>
          ) : null}
          {params.error ? (
            <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
              {params.error}
            </div>
          ) : null}
          <form action={registerAction} style={{ display: "grid", gap: 16, marginTop: 24 }}>
            <label>
              <span className="field-label">Full Name</span>
              <input className="input" name="name" type="text" placeholder="Sunita Kandar" required />
            </label>
            <label>
              <span className="field-label">Email</span>
              <input className="input" name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span className="field-label">Phone</span>
              <input className="input" name="phone" type="tel" placeholder="9920554660" required />
            </label>
            <label>
              <span className="field-label">Address</span>
              <textarea className="textarea" name="address" placeholder="Flat number, building, street, locality" required />
            </label>
            <label>
              <span className="field-label">Pincode</span>
              <input className="input" name="pincode" type="text" placeholder="400081" required />
            </label>
            <label>
              <span className="field-label">Password</span>
              <input className="input" name="password" type="password" placeholder="Minimum 8 characters" required />
            </label>
            <label>
              <span className="field-label">Confirm Password</span>
              <input className="input" name="confirmPassword" type="password" placeholder="Repeat password" required />
            </label>
            <button className="button" type="submit">Create Account</button>
          </form>
          <p className="subtle" style={{ marginTop: 16 }}>
            Already have an account? <Link href="/login">Login here</Link>.
          </p>
        </div>
        <aside className="info-card auth-aside">
          <span className="eyebrow">Account benefits</span>
          <h2 style={{ fontSize: 34 }}>Built for repeat gifting and easier support.</h2>
          <div className="auth-feature-list">
            <div>
              <strong>Saved address details</strong>
              <p>Keep your checkout information ready for the next celebration.</p>
            </div>
            <div>
              <strong>Central order history</strong>
              <p>Track, review, and revisit past orders without searching messages.</p>
            </div>
            <div>
              <strong>Custom request continuity</strong>
              <p>Your bespoke inquiries stay visible alongside normal orders.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
