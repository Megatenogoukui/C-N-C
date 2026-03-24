import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; callbackUrl?: string; registered?: string; reset?: string }>;
};

export const metadata: Metadata = {
  title: "Login",
  description: "Customer and admin login with credentials and optional Google OAuth."
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;

  return (
    <main className="section section-soft">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="panel">
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
          {params.error ? (
            <div className="info-card" style={{ marginTop: 20, color: "#8f2d24" }}>
              {params.error}
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
          <LoginForm callbackUrl={params.callbackUrl || "/account"} enableGoogle={Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)} />
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
      </div>
    </main>
  );
}
