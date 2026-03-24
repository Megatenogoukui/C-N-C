import type { Metadata } from "next";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/auth-actions";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Choose a new password for your C N C account."
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="panel">
          <span className="eyebrow">Set New Password</span>
          <h1 style={{ fontSize: 42 }}>Choose a new password.</h1>
          {params.error ? (
            <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
              {params.error}
            </div>
          ) : null}
          {!params.token ? (
            <div className="info-card" style={{ marginTop: 20 }}>
              Reset token missing. Request a new link from <Link href="/forgot-password">forgot password</Link>.
            </div>
          ) : (
            <form action={resetPasswordAction} style={{ display: "grid", gap: 16, marginTop: 24 }}>
              <input type="hidden" name="token" value={params.token} />
              <label>
                <span className="field-label">New Password</span>
                <input className="input" name="password" type="password" placeholder="Minimum 8 characters" required />
              </label>
              <label>
                <span className="field-label">Confirm Password</span>
                <input className="input" name="confirmPassword" type="password" placeholder="Repeat password" required />
              </label>
              <button className="button" type="submit">Update Password</button>
            </form>
          )}
          <p className="subtle" style={{ marginTop: 16 }}>
            <Link href="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
