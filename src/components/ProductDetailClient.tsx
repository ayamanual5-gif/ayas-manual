"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { resolveImageUrl } from "@/lib/api";
import { ProductIcon, tintBgVar, tintColorVar } from "@/lib/icons";
import type { Product } from "@/lib/types";
import { EASE, staggerContainer, fadeUp } from "./motion/variants";

const SWIPE_THRESHOLD = 60;

export default function ProductDetailClient({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaInView = useInView(ctaRef, { margin: "-80px 0px 0px 0px" });

  const images = product.images ?? [];
  const hasImages = images.length > 0;

  function goTo(index: number) {
    if (images.length === 0) return;
    setActiveIndex((index + images.length) % images.length);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    if (images.length < 2) return;
    const swipe = info.offset.x;
    if (swipe < -SWIPE_THRESHOLD || info.velocity.x < -500) {
      goTo(lang === "ar" ? activeIndex - 1 : activeIndex + 1);
    } else if (swipe > SWIPE_THRESHOLD || info.velocity.x > 500) {
      goTo(lang === "ar" ? activeIndex + 1 : activeIndex - 1);
    }
  }

  function handleAdd() {
    addToCart(product);
    showToast(t("toast.added"));
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  return (
    <motion.div
      className="grid lg:grid-cols-2 gap-10"
      variants={staggerContainer(0.1)}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <div className="card overflow-hidden aspect-square flex items-center justify-center relative">
          {hasImages ? (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeIndex}
                className="w-full h-full"
                drag={images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImageUrl(images[activeIndex])}
                    alt={product.name[lang]}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: tintBgVar[product.tint], color: tintColorVar[product.tint] }}
            >
              <span className="w-1/3 h-1/3 flex items-center justify-center">
                <ProductIcon name={product.icon} />
              </span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <motion.button
                type="button"
                aria-label="Previous image"
                style={{ y: "-50%" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="gallery-arrow gallery-arrow-prev"
                onClick={() => goTo(activeIndex - 1)}
              >
                <svg
                  width="18"
                  height="18"
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
                aria-label="Next image"
                style={{ y: "-50%" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="gallery-arrow gallery-arrow-next"
                onClick={() => goTo(activeIndex + 1)}
              >
                <svg
                  width="18"
                  height="18"
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

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((img, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={img}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative aspect-square rounded-xl overflow-hidden border-2"
                  style={{ borderColor: isActive ? "var(--teal)" : "var(--beige-200)" }}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  {isActive && (
                    <motion.span
                      layoutId="thumb-active-ring"
                      className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: "inset 0 0 0 2px var(--teal)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      <div>
        {product.isNew && (
          <motion.span
            variants={fadeUp}
            className="chip !border-0 inline-block mb-3"
            style={{ background: "var(--rose)", color: "#fff" }}
          >
            {t("product.new")}
          </motion.span>
        )}
        <motion.h1 variants={fadeUp} className="font-display text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {product.name[lang]}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
          {product.tag[lang]}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-6 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {product.desc[lang]}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
          className="mt-6 text-2xl font-bold"
          style={{ color: "var(--teal)" }}
        >
          {product.price} {t("currency")}
        </motion.div>
        <motion.button
          ref={ctaRef}
          variants={fadeUp}
          whileTap={{ scale: 0.96 }}
          className="btn btn-primary w-full sm:w-auto px-10 py-3.5 mt-6 relative overflow-hidden"
          onClick={handleAdd}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="inline-flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t("toast.added")}
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {t("product.add")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {!ctaInView && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center gap-3 px-4 py-3"
            style={{
              background: "var(--beige-100)",
              borderTop: "1px solid var(--beige-200)",
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
            }}
          >
            <div className="font-bold text-lg shrink-0" style={{ color: "var(--teal)" }}>
              {product.price} {t("currency")}
            </div>
            <motion.button whileTap={{ scale: 0.96 }} className="btn btn-primary flex-1 py-3" onClick={handleAdd}>
              {added ? t("toast.added") : t("product.add")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
