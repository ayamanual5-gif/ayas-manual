"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import ProductVisual from "./ProductVisual";
import { staggerItem } from "./motion/Stagger";
import { EASE } from "./motion/variants";
import type { Product } from "@/lib/types";

/**
 * A deliberately lighter card for the homepage teaser — image, name, price
 * only, whole card tappable. The full Shop grid uses ProductCard (with
 * View/Add-to-cart buttons); this one exists so the homepage doesn't read
 * like a catalogue, just a hook into the real store.
 */
export default function TeaserProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();

  return (
    <motion.div variants={staggerItem}>
      <Link href={`/shop/${product.id}`} className="group block">
        <motion.div className="relative overflow-hidden rounded-[18px]" initial="rest" whileHover="hover" animate="rest">
          <motion.div variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.5, ease: EASE }}>
            <ProductVisual product={product} />
          </motion.div>
          {product.isNew && (
            <span
              className="absolute top-2 start-2 chip !border-0 !py-1 !px-2.5 text-[10px]"
              style={{ background: "var(--rose)", color: "#fff" }}
            >
              {t("product.new")}
            </span>
          )}
          <motion.span
            variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.25, ease: EASE }}
            className="hidden sm:flex absolute bottom-2 start-2 chip !border-0 !py-1.5 !px-3 text-[11px] items-center gap-1"
            style={{ background: "var(--beige-100)", color: "var(--teal)" }}
          >
            {t("product.discover")}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={lang === "ar" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
            </svg>
          </motion.span>
        </motion.div>
        <motion.div variants={{ rest: { y: 0 }, hover: { y: -2 } }} transition={{ duration: 0.25, ease: EASE }} className="mt-3">
          <h3 className="font-semibold text-sm sm:text-base leading-snug group-hover:text-[var(--rose)] transition-colors">
            {product.name[lang]}
          </h3>
          <div className="mt-1 font-bold text-sm sm:text-base" style={{ color: "var(--teal)" }}>
            {product.price} {t("currency")}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
