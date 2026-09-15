"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { cssVars } from "@/lib/cssVars";

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="blob hero-orbit"
        style={{ width: 260, height: 260, background: "var(--rose)", top: -60, insetInlineEnd: -60 }}
      />
      <div
        className="blob"
        style={{
          width: 180,
          height: 180,
          background: "var(--olive)",
          bottom: 20,
          insetInlineStart: -70,
          animation: "floaty 9s ease-in-out infinite",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 relative grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="chip">{t("hero.eyebrow")}</span>
          <h1
            className="font-display mt-5 text-4xl sm:text-5xl xl:text-[3.4rem] leading-[1.15]"
            style={{ color: "var(--teal)" }}
          >
            {t("hero.headline")}
          </h1>
          <p className="mt-5 text-base sm:text-lg max-w-md" style={{ color: "var(--ink-soft)" }}>
            {t("hero.sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#shop" className="btn btn-primary px-7 py-3.5">
              {t("hero.cta1")}
            </Link>
            <Link href="/#custom" className="btn btn-outline px-7 py-3.5">
              {t("hero.cta2")}
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <span className="chip">{t("hero.badge1")}</span>
            <span className="chip">{t("hero.badge2")}</span>
            <span className="chip">{t("hero.badge3")}</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center py-6">
          <svg viewBox="0 0 320 320" className="w-full max-w-sm hero-orbit" aria-hidden="true">
            <circle cx="160" cy="160" r="150" fill="var(--beige-100)" stroke="var(--beige-200)" strokeWidth="2" />
            <circle cx="120" cy="130" r="54" fill="none" stroke="var(--teal)" strokeWidth="4" />
            <circle cx="120" cy="130" r="54" fill="var(--teal)" opacity=".08" />
            <path d="M120 76v-14M174 130h14" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="205" cy="195" r="38" fill="none" stroke="var(--rose)" strokeWidth="4" />
            <circle cx="205" cy="195" r="38" fill="var(--rose)" opacity=".12" />
            <path
              d="M120 130c30 20 55 45 85 65"
              fill="none"
              stroke="var(--olive)"
              strokeWidth="3"
              strokeDasharray="1 9"
              strokeLinecap="round"
            />
            <circle cx="95" cy="225" r="24" fill="none" stroke="var(--olive)" strokeWidth="4" />
            <circle cx="95" cy="225" r="24" fill="var(--olive)" opacity=".15" />
          </svg>
        </div>
      </div>

      <div className="scallop scallop-down" style={cssVars({ "--edge": "var(--teal)" })} />
    </section>
  );
}
