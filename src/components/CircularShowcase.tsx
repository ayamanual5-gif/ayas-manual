"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import ProductVisual from "./ProductVisual";
import { useLang } from "@/context/LangContext";
import type { Product } from "@/lib/types";
import { cssVars } from "@/lib/cssVars";

const MAX_ITEMS = 6;
const ORBIT_DURATION = 34; // seconds for one full rotation — slow and calm, not distracting

export default function CircularShowcase({ products }: { products: Product[] }) {
  const { lang } = useLang();
  const items = useMemo(() => products.slice(0, MAX_ITEMS), [products]);

  if (items.length === 0) {
    return <FallbackArt />;
  }

  const angleStep = 360 / items.length;

  return (
    <div className="orbit-wrapper relative mx-auto" aria-label="Featured products">
      <div className="orbit-hub hero-orbit" />
      <div className="orbit-track" aria-hidden="true" />

      {items.map((product, i) => {
        const angle = i * angleStep;
        const phaseDelay = -(i / items.length) * ORBIT_DURATION;
        const isNear = i % 2 === 0;

        return (
          <div
            key={product.id}
            className="orbit-item"
            style={cssVars({
              "--orbit-duration": `${ORBIT_DURATION}s`,
              "--phase-delay": `${phaseDelay}s`,
              "--static-angle": `${angle}deg`,
            })}
          >
            <Link href={`/shop/${product.id}`} className="block w-full h-full" title={product.name[lang]}>
              <motion.div
                className={`orbit-thumb ${isNear ? "orbit-thumb-near" : "orbit-thumb-far"}`}
                whileHover={{ scale: 1.22 }}
                whileFocus={{ scale: 1.22 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <ProductVisual product={product} className="w-full h-full" />
              </motion.div>
            </Link>
          </div>
        );
      })}
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
