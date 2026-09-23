"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import Reveal from "./motion/Reveal";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import type { Settings } from "@/lib/types";

const FALLBACK_PHONE = "+20 100 123 4567";
const FALLBACK_EMAIL = "hello@ayasmanual.com";

export default function ContactSection({ settings }: { settings: Settings }) {
  const { t } = useLang();

  const cards = [
    {
      label: t("contact.phoneLabel"),
      value: settings.contactPhone || FALLBACK_PHONE,
      href: `tel:${(settings.contactPhone || FALLBACK_PHONE).replace(/\s/g, "")}`,
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      ),
    },
    {
      label: "WhatsApp",
      value: settings.whatsappNumber || FALLBACK_PHONE,
      href: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}` : undefined,
      icon: (
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      ),
    },
    {
      label: t("contact.emailLabel"),
      value: settings.contactEmail || FALLBACK_EMAIL,
      href: `mailto:${settings.contactEmail || FALLBACK_EMAIL}`,
      icon: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </>
      ),
    },
    {
      label: t("contact.locationLabel"),
      value: settings.contactAddress || t("footer.location"),
      href: undefined,
      icon: (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
  ];

  const socials = [
    { label: "Instagram", href: settings.socialInstagram },
    { label: "WhatsApp", href: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}` : "" },
    { label: "Pinterest", href: settings.socialPinterest },
  ].filter((s) => s.href);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal className="max-w-xl">
        <span className="eyebrow" style={{ color: "var(--rose)" }}>
          {t("contact.eyebrow")}
        </span>
        <h1 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {t("contact.title")}
        </h1>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("contact.sub")}
        </p>
      </Reveal>

      <StaggerContainer className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Wrapper = card.href ? motion.a : motion.div;
          return (
            <StaggerItem key={card.label}>
              <Wrapper
                {...(card.href ? { href: card.href } : {})}
                whileHover={card.href ? { y: -3 } : undefined}
                transition={{ duration: 0.2 }}
                className="card p-6 flex flex-col items-start gap-3 h-full"
              >
                <div
                  className="icon-tile w-12 flex items-center justify-center"
                  style={{ background: "rgba(0,80,85,.1)", color: "var(--teal)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {card.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
                    {card.label}
                  </p>
                  <p className="mt-1 font-bold" style={{ color: "var(--teal)" }}>
                    {card.value}
                  </p>
                </div>
              </Wrapper>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {socials.length > 0 && (
        <Reveal delay={0.1} className="mt-10 flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
            {t("footer.followTitle")}
          </span>
          <div className="flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-200)", color: "var(--teal)" }}
                aria-label={s.label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </motion.a>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
