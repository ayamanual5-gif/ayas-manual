"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLang } from "@/context/LangContext";
import { useToast } from "@/context/ToastContext";

export default function NewsletterSection() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    showToast(t("toast.news"));
    setEmail("");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="card p-8 sm:p-10 grid sm:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
            {t("news.title")}
          </h3>
          <p className="mt-2" style={{ color: "var(--ink-soft)" }}>
            {t("news.sub")}
          </p>
        </div>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("news.ph")}
            className="flex-1 rounded-full px-5 py-3 border"
            style={{ background: "var(--beige-100)", borderColor: "var(--beige-200)" }}
          />
          <button className="btn btn-primary px-6 py-3">{t("news.btn")}</button>
        </form>
      </div>
    </section>
  );
}
