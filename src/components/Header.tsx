"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import type { TranslationKey } from "@/lib/i18n";

const navLinks: { href: string; key: TranslationKey }[] = [
  { href: "/shop", key: "nav.shop" },
  { href: "/custom-order", key: "nav.custom" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

export default function Header() {
  const { lang, toggleLang, t } = useLang();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-beige/95 backdrop-blur border-b"
      style={{ borderColor: "var(--beige-200)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-3">
          <button
            className="lg:hidden p-2 -ms-2 rounded-full hover:bg-beige-200/60"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <Link
            href="/"
            className="flex-1 lg:flex-none flex items-center gap-2.5 justify-center lg:justify-start"
          >
            <Logo size={44} />
            <span className="flex flex-col leading-tight items-start">
              <span className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
                Aya&apos;s Manual
              </span>
              <span className="hidden sm:block text-[11px] tracking-wide" style={{ color: "var(--ink-soft)" }}>
                {t("header.slogan")}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.key} href={link.href} className="hover:text-[var(--rose)] transition-colors">
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="chip !py-2 !px-3.5 hover:border-[var(--teal)]"
              aria-label="Language"
              onClick={toggleLang}
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
            <Link
              href="/admin/login"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-beige-200/60"
              aria-label="تسجيل دخول الأدمين"
              title="تسجيل دخول الأدمين"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </Link>
            <button className="relative p-2.5 rounded-full hover:bg-beige-200/60" aria-label="Cart" onClick={openCart}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span
                className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: "var(--rose)", color: "#fff" }}
              >
                {count}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="py-2 px-2 rounded-lg hover:bg-beige-200/60"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="py-2 px-2 rounded-lg hover:bg-beige-200/60 sm:hidden"
              style={{ color: "var(--ink-soft)" }}
              onClick={() => setMobileOpen(false)}
            >
              تسجيل دخول الأدمين
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
