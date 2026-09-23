"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";
import { EASE } from "./motion/variants";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
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
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useBodyScrollLock(mobileOpen);

  // Defensive close on route change (e.g. browser Back/Forward), in addition
  // to each link's own onClick handler.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 320);
      prevCount.current = count;
      return () => clearTimeout(id);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <header
      className="sticky top-0 z-40 bg-beige/95 backdrop-blur border-b"
      style={{ borderColor: "var(--beige-200)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-3">
          <button
            className="lg:hidden relative p-2 -ms-2 rounded-full hover:bg-beige-200/60"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="relative block w-[22px] h-[22px]">
              <motion.span
                className="absolute top-1/2 left-1/2 block w-[18px] h-[2px] rounded-full"
                style={{ background: "currentColor", x: "-50%" }}
                animate={mobileOpen ? { rotate: 45, y: "-50%" } : { rotate: 0, y: "calc(-50% - 5px)" }}
                transition={{ duration: 0.22, ease: EASE }}
              />
              <motion.span
                className="absolute top-1/2 left-1/2 block w-[18px] h-[2px] rounded-full"
                style={{ background: "currentColor", x: "-50%", y: "-50%" }}
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.18, ease: EASE }}
              />
              <motion.span
                className="absolute top-1/2 left-1/2 block w-[18px] h-[2px] rounded-full"
                style={{ background: "currentColor", x: "-50%" }}
                animate={mobileOpen ? { rotate: -45, y: "-50%" } : { rotate: 0, y: "calc(-50% + 5px)" }}
                transition={{ duration: 0.22, ease: EASE }}
              />
            </span>
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
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="relative py-1.5 hover:text-[var(--rose)] transition-colors"
                  style={{ color: active ? "var(--rose)" : undefined }}
                >
                  {t(link.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full"
                      style={{ background: "var(--rose)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              className="chip !py-2 !px-3.5 hover:border-[var(--teal)]"
              aria-label="Language"
              onClick={toggleLang}
              whileTap={{ scale: 0.92 }}
            >
              {lang === "ar" ? "EN" : "AR"}
            </motion.button>
            {user ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex p-2.5 rounded-full hover:bg-beige-200/60"
                aria-label={t("nav.logout")}
                title={user.name ?? user.email}
                onClick={() => logout()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 12H9M15 8l4 4-4 4" />
                  <path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
                </svg>
              </motion.button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex p-2.5 rounded-full hover:bg-beige-200/60"
                aria-label={t("nav.login")}
                title={t("nav.login")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                </svg>
              </Link>
            )}
            <motion.button
              className="relative p-2.5 rounded-full hover:bg-beige-200/60"
              aria-label="Cart"
              onClick={openCart}
              whileTap={{ scale: 0.9 }}
              animate={bump ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <AnimatePresence mode="wait">
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "var(--rose)", color: "#fff" }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.nav
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pb-4 flex flex-col gap-1 text-sm font-medium">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: lang === "ar" ? 12 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.04, ease: EASE }}
                  >
                    <Link
                      href={link.href}
                      className="block py-2 px-2 rounded-lg hover:bg-beige-200/60"
                      style={{ color: pathname === link.href ? "var(--rose)" : undefined }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <button
                    type="button"
                    className="text-start py-2 px-2 rounded-lg hover:bg-beige-200/60 sm:hidden"
                    style={{ color: "var(--ink-soft)" }}
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                  >
                    {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="py-2 px-2 rounded-lg hover:bg-beige-200/60 sm:hidden"
                    style={{ color: "var(--ink-soft)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
