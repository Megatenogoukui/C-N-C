"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm({
  callbackUrl,
  enableGoogle
}: {
  callbackUrl: string;
  enableGoogle: boolean;
}) {
  const router = useRouter();
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
      router.replace(result?.url || callbackUrl);
      router.refresh();
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
          className="button-ghost"
          style={{ marginTop: 12 }}
          onClick={() => signIn("google", { callbackUrl })}
          type="button"
        >
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
