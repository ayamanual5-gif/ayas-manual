"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { cssVars } from "@/lib/cssVars";
import ProductCarousel from "./ProductCarousel";
import { EASE, staggerContainer, fadeUp } from "./motion/variants";
import type { Product } from "@/lib/types";

export default function Hero({ products = [] }: { products?: Product[] }) {
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

      <motion.div
        className="hero-grid max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 relative"
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={fadeUp} className="hero-area-label chip inline-block">
          {t("hero.eyebrow")}
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="hero-area-headline font-display mt-5 text-4xl sm:text-5xl xl:text-[3.4rem] leading-[1.15]"
          style={{ color: "var(--teal)" }}
        >
          {t("hero.headline")}
        </motion.h1>

        <motion.p variants={fadeUp} className="hero-area-desc mt-5 text-base sm:text-lg max-w-md" style={{ color: "var(--ink-soft)" }}>
          {t("hero.sub")}
        </motion.p>

        <motion.div
          className="hero-area-visual flex items-center justify-center py-6 lg:py-0"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <ProductCarousel products={products} />
        </motion.div>

        <motion.div variants={fadeUp} className="hero-area-ctas mt-8 flex flex-wrap gap-3">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link href="/shop" className="btn btn-primary px-7 py-3.5">
              {t("hero.cta1")}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link href="/about" className="btn btn-outline px-7 py-3.5">
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="hero-area-badges mt-9 flex flex-wrap gap-2.5">
          <span className="chip">{t("hero.badge1")}</span>
          <span className="chip">{t("hero.badge2")}</span>
          <span className="chip">{t("hero.badge3")}</span>
        </motion.div>
      </motion.div>

      <div className="scallop scallop-down" style={cssVars({ "--edge": "var(--teal)" })} />
    </section>
  );
}
