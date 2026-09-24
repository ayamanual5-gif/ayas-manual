"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";

export type ShopViewMode = "compact" | "large";

const options: { mode: ShopViewMode; key: "shop.view.compact" | "shop.view.large" }[] = [
  { mode: "compact", key: "shop.view.compact" },
  { mode: "large", key: "shop.view.large" },
];

function ViewIcon({ mode }: { mode: ShopViewMode }) {
  if (mode === "compact") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="8" rx="1.5" />
      <rect x="3" y="13" width="18" height="8" rx="1.5" />
    </svg>
  );
}

export default function ViewToggle({
  value,
  onChange,
}: {
  value: ShopViewMode;
  onChange: (mode: ShopViewMode) => void;
}) {
  const { t } = useLang();

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-full flex-shrink-0"
      style={{ border: "1px solid var(--beige-200)" }}
      role="group"
    >
      {options.map((opt) => {
        const active = value === opt.mode;
        return (
          <motion.button
            key={opt.mode}
            type="button"
            onClick={() => onChange(opt.mode)}
            whileTap={{ scale: 0.92 }}
            aria-pressed={active}
            aria-label={t(opt.key)}
            title={t(opt.key)}
            className="relative w-9 h-9 rounded-full flex items-center justify-center"
            style={{ color: active ? "var(--beige-100)" : "var(--ink-soft)" }}
          >
            {active && (
              <motion.span
                layoutId="view-toggle-active-bg"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--teal)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center justify-center">
              <ViewIcon mode={opt.mode} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
