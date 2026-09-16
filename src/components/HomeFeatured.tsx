"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function HomeFeatured({ products }: { products: Product[] }) {
  const { t } = useLang();
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="eyebrow" style={{ color: "var(--rose)" }}>
            {t("home.shopTeaserEyebrow")}
          </span>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
            {t("home.shopTeaserTitle")}
          </h2>
        </div>
        <Link href="/shop" className="btn btn-outline px-6 py-3 whitespace-nowrap">
          {t("home.shopTeaserCta")}
        </Link>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
