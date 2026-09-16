"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "./variants";

/**
 * Fades/rises each route's content in on navigation so page changes read as
 * one continuous app instead of a hard cut. Deliberately entrance-only (no
 * AnimatePresence/exit): these routes are force-dynamic and refetch from the
 * database on every navigation, so gating the new page's mount behind an
 * exit animation (mode="wait") only adds latency on top of that fetch, and
 * AnimatePresence's unmount-tracking doesn't play well with a child that can
 * suspend mid-transition. New content renders the instant it's ready and
 * just animates itself in.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
