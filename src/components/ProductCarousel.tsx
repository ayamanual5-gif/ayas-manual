"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductVisual from "./ProductVisual";
import { useLang } from "@/context/LangContext";
import type { Product } from "@/lib/types";
import { EASE } from "./motion/variants";

const MAX_ITEMS = 6;
const SWIPE_THRESHOLD = 45;
const CARD_WIDTH_RATIO = 0.72;
const STEP_RATIO = 0.8;

export default function ProductCarousel({ products }: { products: Product[] }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const dir = lang === "ar" ? -1 : 1;
  const items = useMemo(() => products.slice(0, MAX_ITEMS), [products]);
  const [active, setActive] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  function step(delta: number) {
    setActive((i) => (i + delta + items.length) % items.length);
  }

  function shortestDiff(i: number) {
    let d = i - active;
    if (d > items.length / 2) d -= items.length;
    if (d < -items.length / 2) d += items.length;
    return d;
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const swipe = info.offset.x * dir;
    if (swipe < -SWIPE_THRESHOLD || info.velocity.x * dir < -400) {
      step(1);
    } else if (swipe > SWIPE_THRESHOLD || info.velocity.x * dir > 400) {
      step(-1);
    }
  }

  if (items.length === 0) return null;

  const cardWidth = width * CARD_WIDTH_RATIO;
  const stepPx = width * STEP_RATIO;

  return (
    <div className="carousel-wrapper">
      <div className="carousel-viewport" ref={viewportRef}>
        <motion.div
          className="carousel-drag-surface"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {items.map((product, i) => {
            const d = shortestDiff(i);
            const abs = Math.abs(d);
            if (abs > 2) return null;
            const isActive = d === 0;

            return (
              <CarouselCard
                key={product.id}
                product={product}
                isActive={isActive}
                x={`calc(-50% + ${dir * d * stepPx}px)`}
                scale={isActive ? 1.05 : 0.82}
                opacity={isActive ? 1 : abs === 1 ? 0.7 : 0}
                zIndex={10 - abs}
                width={cardWidth}
                lang={lang}
                t={t}
                onSelect={() => setActive(i)}
                onOpen={() => router.push(`/shop/${product.id}`)}
              />
            );
          })}
        </motion.div>
      </div>

      {items.length > 1 && (
        <>
          <motion.button
            type="button"
            aria-label="Previous product"
            style={{ y: "-50%" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="carousel-arrow carousel-arrow-prev"
            onClick={() => step(-1)}
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
            aria-label="Next product"
            style={{ y: "-50%" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="carousel-arrow carousel-arrow-next"
            onClick={() => step(1)}
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

      {items.length > 1 && (
        <div className="carousel-dots">
          {items.map((product, i) => (
            <button
              key={product.id}
              type="button"
              aria-label={product.name[lang]}
              className={`carousel-knot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <svg viewBox="0 0 14 14" width="14" height="14">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.6 7c1-1.3 2.4-1.3 3.2-.2s.2 2.1-1 2.1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselCard({
  product,
  isActive,
  x,
  scale,
  opacity,
  zIndex,
  width,
  lang,
  t,
  onSelect,
  onOpen,
}: {
  product: Product;
  isActive: boolean;
  x: string;
  scale: number;
  opacity: number;
  zIndex: number;
  width: number;
  lang: "ar" | "en";
  t: (key: "hero.carouselView" | "currency") => string;
  onSelect: () => void;
  onOpen: () => void;
}) {
  return (
    <motion.div
      className="carousel-card"
      style={{ width, zIndex, left: "50%" }}
      animate={{ x, scale, opacity }}
      transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.7 }}
    >
      <div className="carousel-card-inner">
        {isActive ? (
          <Link href={`/shop/${product.id}`} className="carousel-card-image block" aria-label={product.name[lang]}>
            <ProductVisual product={product} className="w-full h-full" eager={isActive} />
          </Link>
        ) : (
          <button
            type="button"
            className="carousel-card-image"
            aria-label={product.name[lang]}
            onClick={onSelect}
          >
            <ProductVisual product={product} className="w-full h-full" />
          </button>
        )}
        <div className="carousel-card-info">
          <h3 className="carousel-card-name">{product.name[lang]}</h3>
          {isActive && (
            <div className="carousel-card-price">
              {product.price} {t("currency")}
            </div>
          )}
          {isActive && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15, ease: EASE }}>
              <button type="button" className="btn btn-outline w-full !py-2.5 text-sm mt-2" onClick={onOpen}>
                {t("hero.carouselView")}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
