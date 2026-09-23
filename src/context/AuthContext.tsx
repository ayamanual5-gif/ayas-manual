"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  role: "ADMIN" | "CUSTOMER";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function check() {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
    check();

    // Re-check when the browser restores this page from bfcache (Back/
    // Forward) instead of re-mounting it, so login/logout state can't go
    // stale after navigating with the browser buttons. Also re-check on tab
    // focus/visibility as a general safety net for the same class of issue.
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

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const authUser = await parseOrThrow<AuthUser>(res);
      setUser(authUser);
      return { ok: true as const, user: authUser };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "فشل تسجيل الدخول" };
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const authUser = await parseOrThrow<AuthUser>(res);
      setUser(authUser);
      return { ok: true as const, user: authUser };
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : "فشل إنشاء الحساب" };
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
