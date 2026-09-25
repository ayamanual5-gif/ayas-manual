"use client";

import { useLang } from "@/context/LangContext";

export type SortMode = "default" | "priceAsc" | "priceDesc" | "newest";

const options: { value: SortMode; key: "shop.sort.default" | "shop.sort.priceAsc" | "shop.sort.priceDesc" | "shop.sort.newest" }[] = [
  { value: "default", key: "shop.sort.default" },
  { value: "newest", key: "shop.sort.newest" },
  { value: "priceAsc", key: "shop.sort.priceAsc" },
  { value: "priceDesc", key: "shop.sort.priceDesc" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}) {
  const { t } = useLang();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortMode)}
      aria-label={t("shop.sort.default")}
      className="rounded-full px-4 py-2 text-sm font-semibold border cursor-pointer flex-shrink-0"
      style={{ borderColor: "var(--beige-200)", background: "var(--beige-100)", color: "var(--ink-soft)" }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ color: "var(--ink)", background: "var(--beige-100)" }}>
          {t(opt.key)}
        </option>
      ))}
    </select>
  );
}
