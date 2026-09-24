"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { cssVars } from "@/lib/cssVars";
import { fetchSettings } from "@/lib/api";
import Logo from "./Logo";
import Reveal from "./motion/Reveal";
import SocialIcon from "./SocialIcon";
import type { Settings } from "@/lib/types";

const FALLBACK_PHONE = "+20 100 123 4567";
const FALLBACK_EMAIL = "hello@ayasmanual.com";

const emptySettings: Settings = {
  instapayHandle: "",
  vodafoneCashNumber: "",
  whatsappNumber: "",
  contactEmail: "",
  socialInstagram: "",
  socialTiktok: "",
  aboutImageUrl: "",
};

export default function Footer() {
  const { lang, t } = useLang();
  const [settings, setSettings] = useState<Settings>(emptySettings);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {
        // keep the empty/fallback settings — the footer still renders fine either way
      });
  }, []);

  const socials = [
    { label: "Instagram", platform: "instagram" as const, href: settings.socialInstagram },
    { label: "TikTok", platform: "tiktok" as const, href: settings.socialTiktok },
    {
      label: "WhatsApp",
      platform: "whatsapp" as const,
      href: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}` : "",
    },
  ].filter((s) => s.href);

  return (
    <footer className="text-beige-100" style={{ background: "var(--teal-900)" }}>
      <div className="scallop scallop-down" style={cssVars({ "--edge": "var(--teal-900)" })} />
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
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
            <Link href="/shop">{t("nav.shop")}</Link>
            <Link href="/custom-order">{t("nav.custom")}</Link>
            <Link href="/about">{t("nav.about")}</Link>
            <Link href="/contact">{t("nav.contact")}</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold opacity-90">{t("footer.contactTitle")}</p>
          <div className="mt-3 flex flex-col gap-2 opacity-80">
            {/* dir="ltr" keeps the digits/plus-sign in the right order in Arabic
                mode, but that alone also flips which edge the text hugs — pin
                it back to the same side as the sibling lines with an explicit
                (physical, not logical) text-align. */}
            <span dir="ltr" style={{ display: "block", textAlign: lang === "ar" ? "right" : "left" }}>
              {settings.whatsappNumber || FALLBACK_PHONE}
            </span>
            <span>{settings.contactEmail || FALLBACK_EMAIL}</span>
          </div>
        </div>
        {socials.length > 0 && (
          <div>
            <p className="font-semibold opacity-90">{t("footer.followTitle")}</p>
            <div className="mt-3 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(245,235,215,.12)" }}
                  aria-label={s.label}
                >
                  <SocialIcon platform={s.platform} />
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </Reveal>
      <div
        className="border-t py-5 text-center text-xs opacity-70"
        style={{ borderColor: "rgba(245,235,215,.15)" }}
      >
        <span>{t("footer.rights")}</span>
      </div>
    </footer>
  );
}
