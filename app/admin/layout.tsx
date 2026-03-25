import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/account");
  }

  return (
    <main className="section section-soft">
      <div className="container admin-shell">
        <AdminSidebar />
        <div className="admin-main">{children}</div>
      </div>
    </main>
  );
}
