import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; callbackUrl?: string; registered?: string; reset?: string }>;
};

export const metadata: Metadata = {
  title: "Login",
  description: "Customer and admin login with credentials and optional Google OAuth."
};

const authErrorMessages: Record<string, string> = {
  OAuthCallback: "Google sign-in could not be completed. Please try again.",
  OAuthSignin: "Google sign-in could not be started. Please try again.",
  AccessDenied: "Access was denied for that sign-in attempt.",
  Configuration: "Authentication is temporarily unavailable. Please try again later."
};

function normalizeCallbackUrl(value: string | undefined) {
  if (!value) return "/account";

  try {
    if (value.startsWith("/")) {
      return value;
    }

    const parsed = new URL(value);
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return path || "/account";
  } catch {
    return "/account";
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = normalizeCallbackUrl(params.callbackUrl);

  if (params.callbackUrl && params.callbackUrl !== callbackUrl) {
    const nextParams = new URLSearchParams();
    nextParams.set("callbackUrl", callbackUrl);
    if (params.error) nextParams.set("error", params.error);
    if (params.registered) nextParams.set("registered", params.registered);
    if (params.reset) nextParams.set("reset", params.reset);
    redirect(`/login?${nextParams.toString()}`);
  }

  const errorMessage = params.error ? authErrorMessages[params.error] || "Sign-in failed. Please try again." : "";

  return (
    <main className="section section-soft">
      <div className="container auth-shell">
        <div className="panel auth-panel">
          <span className="eyebrow">Login</span>
          <h1 style={{ fontSize: 42 }}>Sign in to continue.</h1>
          <p style={{ marginTop: 12 }}>
            Customers can track orders and admins can manage products, logos, images, and order states from the dashboard.
          </p>
          {session?.user ? (
            <div className="info-card" style={{ marginTop: 20 }}>
              You are already signed in as {session.user.email}. Go to{" "}
              <Link href={session.user.role === "ADMIN" ? "/admin" : "/account"}>your dashboard</Link>.
            </div>
          ) : null}
          {errorMessage ? (
            <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
              {errorMessage}
            </div>
          ) : null}
          {params.registered ? (
            <div className="info-card" style={{ marginTop: 20, color: "#21543d" }}>
              Account created. Log in with your new credentials.
            </div>
          ) : null}
          {params.reset ? (
            <div className="info-card" style={{ marginTop: 20, color: "#21543d" }}>
              Password updated. Log in with your new password.
            </div>
          ) : null}
          <LoginForm callbackUrl={callbackUrl} enableGoogle={Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)} />
          <p className="subtle" style={{ marginTop: 16 }}>
            New here? <Link href="/signup">Create an account</Link>.
          </p>
          <p className="subtle" style={{ marginTop: 8 }}>
            Forgot your password? <Link href="/forgot-password">Reset it</Link>.
          </p>
          <div className="info-card" style={{ marginTop: 20 }}>
            <strong>Demo credentials</strong>
            <p style={{ marginTop: 8 }}>Customer: `customer@cnc.local` / `customer123`</p>
            <p>Admin: `admin@cnc.local` / `admin123`</p>
          </div>
        </div>
        <aside className="info-card auth-aside">
          <span className="eyebrow">Why sign in</span>
          <h2 style={{ fontSize: 34 }}>Keep the entire order lifecycle in one place.</h2>
          <div className="auth-feature-list">
            <div>
              <strong>Track live progress</strong>
              <p>Jump straight into order status updates after checkout.</p>
            </div>
            <div>
              <strong>Save checkout details</strong>
              <p>Reduce repeat form filling for future orders.</p>
            </div>
            <div>
              <strong>Manage reviews</strong>
              <p>Delivered products can be rated from your order history.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
