"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import ProductVisual from "./ProductVisual";
import { useLang } from "@/context/LangContext";
import type { Product } from "@/lib/types";
import { EASE } from "./motion/variants";

const MAX_ITEMS = 6;
const DRAW_MS = 1500;
const STITCH_MS = 350;
const REVEAL_HOLD_MS = 2400;
const EXIT_MS = 450;

// A soft rounded-square outline — the "thread" that draws itself before the
// real product photo is revealed inside it. Framer's pathLength prop handles
// the draw-on animation (internally stroke-dasharray/offset), so this is a
// single cheap SVG stroke animation, not a custom trace per product.
const FRAME_PATH = "M70 30 H130 A20 20 0 0 1 150 50 V150 A20 20 0 0 1 130 170 H70 A20 20 0 0 1 50 150 V50 A20 20 0 0 1 70 30 Z";
const STITCH_X = [64, 82, 100, 118, 136];

type Phase = "draw" | "stitch" | "reveal" | "exit";

export default function HandmadeShowcase({ products }: { products: Product[] }) {
  const { lang } = useLang();
  const reduceMotion = useReducedMotion();
  const items = useMemo(() => products.slice(0, MAX_ITEMS), [products]);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "reveal" : "draw");
  const [paused, setPaused] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  const index = items.length > 0 ? tick % items.length : 0;
  const current = items[index];

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(mq.matches);
    const handler = () => setFinePointer(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (items.length === 0 || paused) return;

    if (reduceMotion) {
      setPhase("reveal");
      if (items.length < 2) return;
      const id = setTimeout(() => setTick((t) => t + 1), REVEAL_HOLD_MS + DRAW_MS);
      return () => clearTimeout(id);
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms)
      );
    };

    setPhase("draw");
    schedule(() => setPhase("stitch"), DRAW_MS);
    schedule(() => setPhase("reveal"), DRAW_MS + STITCH_MS);
    schedule(() => setPhase("exit"), DRAW_MS + STITCH_MS + REVEAL_HOLD_MS);
    schedule(() => setTick((t) => t + 1), DRAW_MS + STITCH_MS + REVEAL_HOLD_MS + EXIT_MS);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, items.length, paused, reduceMotion]);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 20 });

  function handlePointerMove(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (!finePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * 6);
    rawRotateX.set(py * -6);
  }
  function handlePointerLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  if (items.length === 0) return null;

  const showPhoto = phase === "reveal";

  return (
    <div
      className="hero-visual"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-visual-backdrop" />

      <Link
        href={current ? `/shop/${current.id}` : "/shop"}
        title={current?.name[lang]}
        className="hero-visual-frame"
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
      >
        <svg viewBox="0 0 200 200" className="hero-thread-svg" aria-hidden="true">
          <motion.path
            key={tick}
            d={FRAME_PATH}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduceMotion ? 0 : DRAW_MS / 1000, ease: EASE }}
          />
          {STITCH_X.map((x, i) => (
            <motion.line
              key={x}
              x1={x}
              y1={24}
              x2={x}
              y2={36}
              stroke="var(--rose)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={false}
              animate={{
                opacity: phase === "draw" ? 0 : 1,
                scale: phase === "draw" ? 0.4 : 1,
              }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: EASE }}
              style={{ transformOrigin: `${x}px 30px` }}
            />
          ))}
        </svg>

        <motion.div
          className="hero-photo"
          style={{ rotateX, rotateY }}
          initial={false}
          animate={{
            opacity: showPhoto ? 1 : 0,
            scale: showPhoto ? 1 : 0.92,
          }}
          transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: EASE }}
        >
          {current && <ProductVisual product={current} className="w-full h-full" />}
        </motion.div>
      </Link>
    </div>
  );
}
