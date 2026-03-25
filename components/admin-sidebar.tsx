"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/requests", label: "Custom Requests" },
  { href: "/admin/products/new", label: "Add Product" },
  { href: "/admin/brand", label: "Brand Assets" },
  { href: "/admin/story", label: "Story" },
  { href: "/admin/journal", label: "Journal" }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-card">
        <span className="eyebrow">Admin Console</span>
        <h2>Manage the storefront from one place.</h2>
      </div>
      <nav className="admin-sidebar-nav" aria-label="Admin">
        {adminLinks.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));
          return (
            <Link className={`admin-sidebar-link ${active ? "admin-sidebar-link-active" : ""}`} href={link.href} key={link.href}>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-card admin-sidebar-note">
        <p>Customer-facing pages stay separate. Admin navigation only shows management tools.</p>
      </div>
    </aside>
  );
}
