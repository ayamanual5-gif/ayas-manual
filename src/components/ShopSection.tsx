"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";
import { StaggerContainer } from "./motion/Stagger";
import ViewToggle, { type ShopViewMode } from "./ViewToggle";
import SortSelect, { type SortMode } from "./SortSelect";
import { getEffectivePrice } from "@/lib/pricing";
import type { Category, Product } from "@/lib/types";

const VIEW_STORAGE_KEY = "shop-view-mode";

const gridClass: Record<ShopViewMode, string> = {
  compact: "grid-cols-2 lg:grid-cols-4",
  large: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function ShopSection({
  products,
  categories,
  loadError,
}: {
  products: Product[];
  categories: Category[];
  loadError: boolean;
}) {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ShopViewMode>("compact");
  const [sortMode, setSortMode] = useState<SortMode>("default");

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "compact" || stored === "large") {
      setViewMode(stored);
    }
  }, []);

  const handleViewChange = (mode: ShopViewMode) => {
    setViewMode(mode);
    window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
  };

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  const sorted = useMemo(() => {
    if (sortMode === "default") return filtered;
    const copy = [...filtered];
    if (sortMode === "priceAsc") copy.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    else if (sortMode === "priceDesc") copy.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    else if (sortMode === "newest") copy.sort((a, b) => b.id - a.id);
    return copy;
  }, [filtered, sortMode]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal className="max-w-xl">
        <span className="eyebrow" style={{ color: "var(--rose)" }}>
          {t("shop.eyebrow")}
        </span>
        <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {t("shop.title")}
        </h2>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("shop.sub")}
        </p>
      </Reveal>

      {loadError ? (
        <p className="mt-10 card p-6 text-center" style={{ color: "var(--rose-600)" }}>
          {t("shop.loadError")}
        </p>
      ) : (
        <>
          <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <SortSelect value={sortMode} onChange={setSortMode} />
              <ViewToggle value={viewMode} onChange={handleViewChange} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-center" style={{ color: "var(--ink-soft)" }}>
              {t("shop.empty")}
            </p>
          ) : (
            <StaggerContainer
              key={`${activeCategory}-${viewMode}-${sortMode}`}
              className={`mt-8 grid ${gridClass[viewMode]} gap-5 transition-[grid-template-columns] duration-300 ease-in-out`}
            >
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} size={viewMode} />
              ))}
            </StaggerContainer>
          )}
        </>
      )}
    </section>
  );
}
