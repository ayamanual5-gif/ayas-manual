"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { email, logout } = useAdminAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b"
      style={{ background: "var(--beige-100)", borderColor: "var(--beige-200)" }}
    >
      <button
        className="lg:hidden p-2 -ms-2 rounded-full hover:bg-beige-200/60"
        aria-label="Menu"
        onClick={onMenuClick}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <span className="hidden lg:block font-semibold" style={{ color: "var(--teal)" }}>
        لوحة تحكم آية
      </span>

      <div className="flex items-center gap-3">
        <span className="text-sm hidden sm:block" style={{ color: "var(--ink-soft)" }}>
          {email}
        </span>
        <button className="btn btn-outline !py-2 !px-4 text-xs" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
