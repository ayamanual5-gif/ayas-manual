"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ProductVisual from "./ProductVisual";
import { staggerItem } from "./motion/Stagger";
import { EASE } from "./motion/variants";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product);
    showToast(t("toast.added"));
  };

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="card p-4 flex flex-col group"
    >
      <Link href={`/shop/${product.id}`} className="relative block overflow-hidden rounded-[18px]">
        <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.4, ease: EASE }}>
          <ProductVisual product={product} />
        </motion.div>
        {product.isNew && (
          <span
            className="absolute top-2 chip !border-0 !py-1 !px-2.5 text-[10px]"
            style={{ insetInlineStart: ".5rem", background: "var(--rose)", color: "#fff" }}
          >
            {t("product.new")}
          </span>
        )}
      </Link>
      <Link href={`/shop/${product.id}`}>
        <h3 className="mt-4 font-semibold leading-snug hover:text-[var(--rose)] transition-colors">
          {product.name[lang]}
        </h3>
      </Link>
      <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>
        {product.tag[lang]}
      </p>
      <div className="mt-3 font-bold" style={{ color: "var(--teal)" }}>
        {product.price} {t("currency")}
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/shop/${product.id}`} className="btn btn-outline flex-1 !py-2 text-xs">
          {t("product.view")}
        </Link>
        <motion.button
          whileTap={{ scale: 0.94 }}
          className="btn btn-primary flex-1 !py-2 text-xs"
          onClick={handleAdd}
        >
          {t("product.add")}
        </motion.button>
      </div>
    </motion.div>
  );
}
