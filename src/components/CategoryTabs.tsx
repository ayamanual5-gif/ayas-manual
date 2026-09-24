"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import type { Category } from "@/lib/types";

export default function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (key: string) => void;
}) {
  const { lang } = useLang();

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
      {categories.map((c) => {
        const isActive = active === c.key;
        return (
          <motion.button
            key={c.key}
            className={`tab-btn relative${isActive ? " active" : ""}`}
            style={isActive ? { background: "transparent", boxShadow: "none" } : undefined}
            onClick={() => onChange(c.key)}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.span
                layoutId="tab-active-bg"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--teal)", boxShadow: "0 6px 16px -8px rgba(0,80,85,.6)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{c[lang]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
