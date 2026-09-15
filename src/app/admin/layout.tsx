"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // The admin panel is always Arabic/RTL, regardless of whatever language the
  // storefront was last switched to — force it on every entry into /admin.
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.body.classList.add("lang-ar");
    document.body.classList.remove("lang-en");
  }, []);

  return (
    <div dir="rtl" lang="ar">
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </div>
  );
}
