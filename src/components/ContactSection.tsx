"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import Reveal from "./motion/Reveal";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";

const socialLabels = ["Instagram", "WhatsApp", "Pinterest"];

export default function ContactSection() {
  const { t } = useLang();

  const cards = [
    {
      label: t("contact.phoneLabel"),
      value: "+20 100 123 4567",
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      ),
    },
    {
      label: t("contact.emailLabel"),
      value: "hello@ayasmanual.com",
      icon: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </>
      ),
    },
    {
      label: t("contact.locationLabel"),
      value: t("footer.location"),
      icon: (
        <>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
  ];

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

      <StaggerContainer className="mt-10 grid sm:grid-cols-3 gap-5">
        {cards.map((card) => (
          <StaggerItem key={card.label} className="card p-6 flex flex-col items-start gap-3">
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
          </StaggerItem>
        ))}
      </StaggerContainer>

      <Reveal delay={0.1} className="mt-10 flex items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
          {t("footer.followTitle")}
        </span>
        <div className="flex gap-3">
          {socialLabels.map((label) => (
            <motion.a
              key={label}
              href="#"
              whileHover={{ y: -3, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--beige-100)", border: "1px solid var(--beige-200)", color: "var(--teal)" }}
              aria-label={label}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </motion.a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
