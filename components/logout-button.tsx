"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="button-small"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void signOut({ callbackUrl: "/" });
        });
      }}
      type="button"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
