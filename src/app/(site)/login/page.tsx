"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { EASE } from "@/components/motion/variants";

export default function LoginPage() {
  const { t } = useLang();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      // Unified login: where you land depends on the account's role, not
      // on which page you happened to log in from.
      router.push(result.user.role === "ADMIN" ? "/admin" : "/");
    } else {
      setError(result.error);
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="card p-7 sm:p-8"
      >
        <h1 className="font-display text-2xl sm:text-3xl text-center" style={{ color: "var(--teal)" }}>
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-2 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
          {t("auth.loginSub")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="field">
            <label>{t("auth.labelEmail")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.phEmail")}
              autoFocus
            />
          </div>
          <div className="field">
            <label>{t("auth.labelPassword")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.phPassword")}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn btn-primary w-full py-3 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? t("auth.loginSubmitting") : t("auth.loginBtn")}
          </motion.button>
        </form>

        <p className="mt-5 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-semibold" style={{ color: "var(--teal)" }}>
            {t("auth.registerLink")}
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
