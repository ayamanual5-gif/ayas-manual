"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/lib/types";

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

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-xl">
        <span className="eyebrow" style={{ color: "var(--rose)" }}>
          {t("shop.eyebrow")}
        </span>
        <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {t("shop.title")}
        </h2>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("shop.sub")}
        </p>
      </div>

      {loadError ? (
        <p className="mt-10 card p-6 text-center" style={{ color: "var(--rose-600)" }}>
          {t("shop.loadError")}
        </p>
      ) : (
        <>
          <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />

          {filtered.length === 0 ? (
            <p className="mt-10 text-center" style={{ color: "var(--ink-soft)" }}>
              {t("shop.empty")}
            </p>
          ) : (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
