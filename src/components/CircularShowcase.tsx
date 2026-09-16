"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import ProductVisual from "./ProductVisual";
import { useLang } from "@/context/LangContext";
import type { Product } from "@/lib/types";
import { EASE } from "./motion/variants";

const MAX_ITEMS = 6;
const CYCLE_MS = 3200;

export default function CircularShowcase({ products }: { products: Product[] }) {
  const { lang } = useLang();
  const items = useMemo(() => products.slice(0, MAX_ITEMS), [products]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  function step(delta: number) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  // Re-arms on every index change (manual or automatic), so clicking an
  // arrow resets the countdown instead of the auto-cycle jumping right after.
  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = setTimeout(() => step(1), CYCLE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, paused]);

  if (items.length === 0) {
    return <FallbackArt />;
  }

  const current = items[index];

  return (
    <div className="flex flex-col items-center">
      <div
        className="orbit-wrapper relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <Link href={`/shop/${current.id}`} title={current.name[lang]} className="block w-full h-full">
          <motion.div
            className="orbit-frame hero-orbit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <ProductVisual product={current} className="w-full h-full" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Link>

        {items.length > 1 && (
          <>
            <motion.button
              type="button"
              aria-label="Previous product"
              style={{ y: "-50%" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="orbit-arrow orbit-arrow-prev"
              onClick={(e) => {
                e.preventDefault();
                step(-1);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next product"
              style={{ y: "-50%" }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="orbit-arrow orbit-arrow-next"
              onClick={(e) => {
                e.preventDefault();
                step(1);
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="orbit-dots">
          {items.map((p, i) => (
            <span key={p.id} className={`orbit-dot${i === index ? " active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function FallbackArt() {
  return (
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
  );
}
