"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ProductVisual from "./ProductVisual";
import { staggerItem } from "./motion/Stagger";
import { EASE } from "./motion/variants";
import { getEffectivePrice, hasDiscount } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  size = "compact",
}: {
  product: Product;
  size?: "compact" | "large";
}) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const discounted = hasDiscount(product);
  const large = size === "large";

  const handleAdd = () => {
    addToCart(product);
    showToast(t("toast.added"));
  };

  return (
    <motion.div
      layout
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="card p-4 flex flex-col group"
    >
      <Link href={`/shop/${product.id}`} className="relative block overflow-hidden rounded-[18px]">
        <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4, ease: EASE }}>
          <ProductVisual product={product} className={large ? "w-full h-64 sm:h-80 md:h-96" : ""} />
        </motion.div>
        {product.isNew && (
          <span
            className="absolute top-2 chip !border-0 !py-1 !px-2.5 text-[10px]"
            style={{ insetInlineStart: ".5rem", background: "var(--rose)", color: "#fff" }}
          >
            {t("product.new")}
          </span>
        )}
        {discounted && (
          <span
            className="absolute top-2 chip !border-0 !py-1 !px-2.5 text-[10px] font-bold"
            style={{ insetInlineEnd: ".5rem", background: "var(--olive)", color: "#fff" }}
          >
            -{product.discountPercent}%
          </span>
        )}
      </Link>
      <Link href={`/shop/${product.id}`}>
        <h3
          className={`mt-4 font-semibold leading-snug hover:text-[var(--rose)] transition-colors ${
            large ? "text-lg" : ""
          }`}
        >
          {product.name[lang]}
        </h3>
      </Link>
      <p className={`mt-1 ${large ? "text-sm" : "text-xs"}`} style={{ color: "var(--ink-soft)" }}>
        {product.tag[lang]}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {discounted && (
          <span className={`line-through ${large ? "text-sm" : "text-xs"}`} style={{ color: "var(--ink-soft)" }}>
            {product.price} {t("currency")}
          </span>
        )}
        <span className={`font-bold ${large ? "text-lg" : ""}`} style={{ color: discounted ? "var(--rose)" : "var(--teal)" }}>
          {getEffectivePrice(product)} {t("currency")}
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/shop/${product.id}`}
          className={`btn btn-outline flex-1 ${large ? "!py-2.5 text-sm" : "!py-2 text-xs"}`}
        >
          {t("product.view")}
        </Link>
        <motion.button
          whileTap={{ scale: 0.94 }}
          className={`btn btn-primary flex-1 ${large ? "!py-2.5 text-sm" : "!py-2 text-xs"}`}
          onClick={handleAdd}
        >
          {t("product.add")}
        </motion.button>
      </div>
    </motion.div>
  );
}
