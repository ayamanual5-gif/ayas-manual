"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import Reveal from "./motion/Reveal";
import { StaggerContainer, StaggerItem } from "./motion/Stagger";
import SocialIcon from "./SocialIcon";
import type { SocialPlatform } from "./SocialIcon";
import type { Settings } from "@/lib/types";

const FALLBACK_PHONE = "+20 100 123 4567";
const FALLBACK_EMAIL = "hello@ayasmanual.com";

export default function ContactSection({ settings }: { settings: Settings }) {
  const { t } = useLang();

  const cards: {
    label: string;
    value: string;
    href: string | undefined;
    platform?: SocialPlatform;
    icon?: ReactNode;
  }[] = [
    {
      label: "WhatsApp",
      value: settings.whatsappNumber || FALLBACK_PHONE,
      href: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}` : undefined,
      platform: "whatsapp",
    },
    {
      label: "Instagram",
      value: settings.socialInstagram ? "Instagram" : t("contact.notSet"),
      href: settings.socialInstagram || undefined,
      platform: "instagram",
    },
    {
      label: "TikTok",
      value: settings.socialTiktok ? "TikTok" : t("contact.notSet"),
      href: settings.socialTiktok || undefined,
      platform: "tiktok",
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

      <StaggerContainer className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Wrapper = card.href ? motion.a : motion.div;
          return (
            <StaggerItem key={card.label}>
              <Wrapper
                {...(card.href ? { href: card.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                whileHover={card.href ? { y: -3 } : undefined}
                transition={{ duration: 0.2 }}
                className="card p-6 flex flex-col items-start gap-3 h-full"
              >
                <div
                  className="icon-tile w-12 flex items-center justify-center"
                  style={{ background: "rgba(0,80,85,.1)", color: "var(--teal)" }}
                >
                  {card.platform ? (
                    <SocialIcon platform={card.platform} size={22} />
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {card.icon}
                    </svg>
                  )}
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
    </section>
  );
}
