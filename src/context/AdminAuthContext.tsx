"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { adminLogin, adminLogout, fetchAdminMe } from "@/lib/adminApi";

interface AdminAuthContextValue {
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function check() {
      fetchAdminMe()
        .then((res) => setEmail(res.email))
        .catch(() => setEmail(null))
        .finally(() => setLoading(false));
    }
    check();

    // The browser can restore this page from bfcache on Back/Forward
    // navigation instead of re-mounting it — which would silently keep
    // whatever email/loading state this component had at the moment it was
    // navigated away from (e.g. "not logged in yet", if that's what it was
    // before the admin logged in). Re-check on restore so login state never
    // goes stale after Back/Forward. Also re-check on tab focus/visibility
    // as a general safety net for the same class of stale-state issue.
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) check();
    }
    function handleVisibility() {
      if (document.visibilityState === "visible") check();
    }
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  async function login(emailInput: string, password: string) {
    try {
      const res = await adminLogin(emailInput, password);
      setEmail(res.email);
      return { ok: true as const };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "Login failed" };
    }
  }

  async function logout() {
    await adminLogout().catch(() => {});
    setEmail(null);
  }

  return (
    <AdminAuthContext.Provider value={{ email, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
