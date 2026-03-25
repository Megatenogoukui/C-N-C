"use client";

import { getSession, signIn } from "next-auth/react";
import { useState, useTransition } from "react";

export function LoginForm({
  callbackUrl,
  enableGoogle
}: {
  callbackUrl: string;
  enableGoogle: boolean;
}) {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError("Invalid credentials");
      return;
    }

    startTransition(() => {
      void (async () => {
        const session = await getSession();
        const role = (session?.user as { role?: string } | undefined)?.role;
        const fallbackUrl = callbackUrl === "/account" && role === "ADMIN" ? "/admin" : callbackUrl;
        window.location.assign(result?.url || fallbackUrl);
      })();
    });
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 16, marginTop: 24 }}
      >
        <label>
          <span className="field-label">Email</span>
          <input className="input" name="email" type="email" placeholder="customer@cnc.local" />
        </label>
        <label>
          <span className="field-label">Password</span>
          <input className="input" name="password" type="password" placeholder="customer123" />
        </label>
        {error ? <div className="info-card" style={{ color: "#8f2d24" }}>{error}</div> : null}
        <button className="button" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Login"}
        </button>
      </form>
      {enableGoogle ? (
        <button
          className="google-auth-button"
          style={{ marginTop: 12 }}
          onClick={() => signIn("google", { callbackUrl })}
          type="button"
        >
          <span className="google-auth-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M21.35 11.1H12v2.98h5.37c-.23 1.52-1.13 2.81-2.41 3.67v2.44h3.89c2.27-2.09 3.58-5.16 3.58-8.81 0-.76-.07-1.51-.2-2.22Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.97-.89 6.63-2.41l-3.89-2.44c-1.08.73-2.46 1.17-4 1.17-3.07 0-5.67-2.07-6.6-4.86H.12v2.51A9.99 9.99 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M4.14 13.46A5.99 5.99 0 0 1 3.77 12c0-.51.09-1 .24-1.46V8.03H.12A10 10 0 0 0 0 12c0 1.61.39 3.13 1.08 4.46l3.06-2.99Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.68c1.47 0 2.8.5 3.84 1.49l2.88-2.88C16.97 2.67 14.7 2 12 2A9.99 9.99 0 0 0 .12 8.03l3.89 2.51c.93-2.8 3.53-4.86 7.99-4.86Z"
                fill="#EA4335"
              />
            </svg>
          </span>
          Continue with Google
        </button>
      ) : (
        <p className="subtle" style={{ marginTop: 14 }}>
          Google OAuth is ready in code but needs `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
        </p>
      )}
    </>
  );
}
