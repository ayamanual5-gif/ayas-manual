"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./variants";

/**
 * Scroll-triggered fade+rise, used to bring homepage/section content in as the
 * user scrolls to it. Animates once per element (won't re-trigger on scroll-up).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
