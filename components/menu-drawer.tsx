"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "@/components/logout-button";

type MenuItem = {
  href: string;
  label: string;
};

type MenuDrawerProps = {
  cartCount: number;
  navItems: MenuItem[];
  supportHref: string;
  accountHref?: string;
  accountLabel?: string;
};

export function MenuDrawer({
  cartCount,
  navItems,
  supportHref,
  accountHref,
  accountLabel
}: MenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="menu-drawer" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-label="Open menu"
        className="menu-drawer-trigger"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="hamburger-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      {open ? <button aria-label="Close menu" className="menu-drawer-backdrop" onClick={() => setOpen(false)} type="button" /> : null}
      <div className={`menu-drawer-panel ${open ? "menu-drawer-panel-open" : ""}`}>
        <div className="menu-drawer-header">
          <strong>Menu</strong>
          <span>{cartCount ? `${cartCount} item(s) in cart` : "Freshly homemade treats"}</span>
        </div>
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/cart" onClick={() => setOpen(false)}>
          Cart{cartCount ? ` (${cartCount})` : ""}
        </Link>
        <Link href="/track-order" onClick={() => setOpen(false)}>
          Track Order
        </Link>
        <Link href={supportHref} onClick={() => setOpen(false)}>
          WhatsApp Support
        </Link>
        {accountHref && accountLabel ? (
          <Link href={accountHref} onClick={() => setOpen(false)}>
            {accountLabel}
          </Link>
        ) : (
          <>
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
        {accountHref ? <LogoutButton /> : null}
      </div>
    </div>
  );
}
