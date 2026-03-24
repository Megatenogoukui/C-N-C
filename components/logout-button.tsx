"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="button-small"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Logout
    </button>
  );
}
