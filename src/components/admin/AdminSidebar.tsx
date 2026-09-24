"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const navItems = [
  {
    href: "/admin",
    label: "الرئيسية",
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/admin/products",
    label: "المنتجات",
    icon: (
      <>
        <path d="M20 7 12 3 4 7v10l8 4 8-4z" />
        <path d="M4 7l8 4 8-4M12 11v10" />
      </>
    ),
  },
  {
    href: "/admin/categories",
    label: "الفئات",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    icon: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </>
    ),
  },
  {
    href: "/admin/custom-orders",
    label: "الطلبات الخاصة",
    icon: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </>
    ),
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--teal-900)", color: "var(--beige-100)" }}>
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5" onClick={onNavigate}>
        <Logo size={36} />
        <span className="font-semibold">Aya&apos;s Manual</span>
      </Link>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--teal)" : "transparent",
                color: active ? "var(--beige-100)" : "rgba(255,255,255,.75)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mx-3 mb-5 px-3 py-2.5 rounded-xl text-sm font-medium text-center"
        style={{ border: "1px solid rgba(255,255,255,.25)", color: "rgba(255,255,255,.85)" }}
      >
        عرض المتجر
      </Link>
    </div>
  );
}
