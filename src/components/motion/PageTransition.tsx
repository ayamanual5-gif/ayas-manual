"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "./variants";

/**
 * Fades/rises each route's content in and out on navigation so page changes
 * read as one continuous app instead of a hard cut. Routing itself is already
 * client-side (next/link + router.push everywhere) — this only adds the
 * transition on top, it doesn't change how navigation works.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
