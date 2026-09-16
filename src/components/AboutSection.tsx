"use client";

import { useLang } from "@/context/LangContext";
import Reveal from "./motion/Reveal";

export default function AboutSection() {
  const { t } = useLang();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
      <Reveal className="order-2 lg:order-1">
        <span className="eyebrow" style={{ color: "var(--rose)" }}>
          {t("about.eyebrow")}
        </span>
        <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {t("about.title")}
        </h2>
        <p className="mt-4 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {t("about.body")}
        </p>
      </Reveal>
      <Reveal delay={0.1} className="order-1 lg:order-2 relative flex justify-center">
        <div className="card w-full max-w-sm aspect-[4/5] flex items-center justify-center relative overflow-hidden">
          <div className="blob hero-orbit" style={{ width: 140, height: 140, background: "var(--rose)", top: -30, insetInlineStart: -30 }} />
          <svg viewBox="0 0 120 120" className="w-2/3 relative" style={{ color: "var(--teal)" }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
            <path
              d="M60 30c-8 0-14 6-14 14 0 12 14 22 14 22s14-10 14-22c0-8-6-14-14-14z"
              fill="var(--rose)"
              opacity=".85"
            />
          </svg>
        </div>
      </Reveal>
    </section>
  );
}
