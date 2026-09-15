"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { email, loading } = useAdminAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !email) router.replace("/admin/login");
  }, [loading, email, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--beige)" }}>
        <p style={{ color: "var(--ink-soft)" }}>جاري التحميل...</p>
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--beige)" }}>
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="fixed w-64 h-screen">
          <AdminSidebar />
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute top-0 bottom-0 w-64" style={{ insetInlineStart: 0 }}>
            <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
