"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { cssVars } from "@/lib/cssVars";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="text-beige-100" style={{ background: "var(--teal-900)" }}>
      <div className="scallop scallop-down" style={cssVars({ "--edge": "var(--teal-900)" })} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo size={40} />
            <span className="font-display text-2xl">Aya&apos;s Manual</span>
          </div>
          <p className="mt-3 opacity-80 leading-relaxed">{t("footer.about")}</p>
        </div>
        <div>
          <p className="font-semibold opacity-90">{t("footer.linksTitle")}</p>
          <div className="mt-3 flex flex-col gap-2 opacity-80">
            <Link href="/#shop">{t("nav.shop")}</Link>
            <Link href="/#custom">{t("nav.custom")}</Link>
            <Link href="/#about">{t("nav.about")}</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold opacity-90">{t("footer.contactTitle")}</p>
          <div className="mt-3 flex flex-col gap-2 opacity-80">
            <span>+20 100 123 4567</span>
            <span>hello@ayasmanual.com</span>
            <span>{t("footer.location")}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold opacity-90">{t("footer.followTitle")}</p>
          <div className="mt-3 flex gap-3">
            {["Instagram", "WhatsApp", "Pinterest"].map((label) => (
              <a
                key={label}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,235,215,.12)" }}
                aria-label={label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        className="border-t py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs opacity-70"
        style={{ borderColor: "rgba(245,235,215,.15)" }}
      >
        <span>{t("footer.rights")}</span>
        <span className="hidden sm:inline opacity-50">•</span>
        <Link href="/admin/login" className="underline underline-offset-2 hover:opacity-100">
          تسجيل دخول الأدمين
        </Link>
      </div>
    </footer>
  );
}
