"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const { email, loading, login } = useAdminAuth();
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && email) router.replace("/admin");
  }, [loading, email, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(inputEmail, password);
    setSubmitting(false);
    if (result.ok) {
      router.push("/admin");
    } else {
      setError(result.error);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--beige)" }}
    >
      <div className="card w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Logo size={56} />
          <div className="text-center">
            <h1 className="font-display text-2xl" style={{ color: "var(--teal)" }}>
              لوحة تحكم Aya&apos;s Manual
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
              سجّلي دخولك لإدارة المتجر
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="admin@ayasmanual.com"
              autoFocus
            />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full py-3 disabled:opacity-60" disabled={submitting}>
            {submitting ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
