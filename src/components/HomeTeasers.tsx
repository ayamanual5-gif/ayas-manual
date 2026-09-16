"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

export default function HomeTeasers() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-20" style={{ background: "var(--beige-100)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-6">
        <div className="card p-8 flex flex-col justify-between">
          <div>
            <span className="eyebrow" style={{ color: "var(--rose)" }}>
              {t("about.eyebrow")}
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
              {t("about.title")}
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {t("about.body")}
            </p>
          </div>
          <Link href="/about" className="btn btn-outline px-6 py-3 mt-6 self-start">
            {t("home.aboutTeaserCta")}
          </Link>
        </div>

        <div className="card p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="blob" style={{ width: 140, height: 140, background: "var(--olive)", top: -30, insetInlineEnd: -30 }} />
          <div className="relative">
            <span className="eyebrow" style={{ color: "var(--rose)" }}>
              {t("home.customTeaserEyebrow")}
            </span>
            <h2 className="font-display mt-2 text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
              {t("home.customTeaserTitle")}
            </h2>
            <p className="mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              {t("home.customTeaserBody")}
            </p>
          </div>
          <Link href="/custom-order" className="btn btn-rose px-6 py-3 mt-6 self-start relative">
            {t("home.customTeaserCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
