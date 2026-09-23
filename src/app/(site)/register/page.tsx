"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import { EASE } from "@/components/motion/variants";

export default function RegisterPage() {
  const { t } = useLang();
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);
    if (result.ok) {
      // Registration always creates a customer account.
      router.push("/");
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
          {t("auth.registerTitle")}
        </h1>
        <p className="mt-2 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
          {t("auth.registerSub")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="field">
            <label>{t("auth.labelName")}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.phName")}
              autoFocus
            />
          </div>
          <div className="field">
            <label>{t("auth.labelEmail")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.phEmail")}
            />
          </div>
          <div className="field">
            <label>{t("auth.labelPassword")}</label>
            <input
              type="password"
              required
              minLength={6}
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
            {submitting ? t("auth.registerSubmitting") : t("auth.registerBtn")}
          </motion.button>
        </form>

        <p className="mt-5 text-sm text-center" style={{ color: "var(--ink-soft)" }}>
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold" style={{ color: "var(--teal)" }}>
            {t("auth.loginLink")}
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
