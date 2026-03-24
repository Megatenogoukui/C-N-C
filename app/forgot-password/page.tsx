import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordResetAction } from "@/lib/auth-actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string; sent?: string; token?: string }>;
};

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a secure password reset link."
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="panel">
          <span className="eyebrow">Password Reset</span>
          <h1 style={{ fontSize: 42 }}>Reset your password.</h1>
          <p style={{ marginTop: 12 }}>
            Enter the email linked to your account. In production this should email a reset link.
          </p>
          {params.error ? (
            <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
              {params.error}
            </div>
          ) : null}
          {params.sent ? (
            <div className="info-card" style={{ marginTop: 20, color: "#21543d" }}>
              Reset instructions have been generated.
              {params.token ? (
                <p style={{ marginTop: 8 }}>
                  Dev reset link: <Link href={`/reset-password?token=${params.token}`}>open reset form</Link>
                </p>
              ) : null}
            </div>
          ) : null}
          <form action={requestPasswordResetAction} style={{ display: "grid", gap: 16, marginTop: 24 }}>
            <label>
              <span className="field-label">Email</span>
              <input className="input" name="email" type="email" placeholder="you@example.com" required />
            </label>
            <button className="button" type="submit">Send Reset Link</button>
          </form>
          <p className="subtle" style={{ marginTop: 16 }}>
            Remembered it? <Link href="/login">Back to login</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
