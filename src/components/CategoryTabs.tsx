"use client";

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
    <div className="mt-8 flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1">
      {categories.map((c) => (
        <button
          key={c.key}
          className={`tab-btn${active === c.key ? " active" : ""}`}
          onClick={() => onChange(c.key)}
        >
          {c[lang]}
        </button>
      ))}
    </div>
  );
}
