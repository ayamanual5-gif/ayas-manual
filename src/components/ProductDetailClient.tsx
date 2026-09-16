"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { resolveImageUrl } from "@/lib/api";
import { ProductIcon, tintBgVar, tintColorVar } from "@/lib/icons";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = product.images ?? [];
  const hasImages = images.length > 0;

  function handleAdd() {
    addToCart(product);
    showToast(t("toast.added"));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      <div>
        <div className="card overflow-hidden aspect-square flex items-center justify-center">
          {hasImages ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(images[activeIndex])}
              alt={product.name[lang]}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: tintBgVar[product.tint], color: tintColorVar[product.tint] }}
            >
              <span className="w-1/3 h-1/3 flex items-center justify-center">
                <ProductIcon name={product.icon} />
              </span>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((img, index) => (
              <button
                key={img}
                onClick={() => setActiveIndex(index)}
                className="aspect-square rounded-xl overflow-hidden border-2"
                style={{ borderColor: index === activeIndex ? "var(--teal)" : "var(--beige-200)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.isNew && (
          <span
            className="chip !border-0 inline-block mb-3"
            style={{ background: "var(--rose)", color: "#fff" }}
          >
            {t("product.new")}
          </span>
        )}
        <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
          {product.name[lang]}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
          {product.tag[lang]}
        </p>
        <p className="mt-6 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {product.desc[lang]}
        </p>
        <div className="mt-6 text-2xl font-bold" style={{ color: "var(--teal)" }}>
          {product.price} {t("currency")}
        </div>
        <button className="btn btn-primary w-full sm:w-auto px-10 py-3.5 mt-6" onClick={handleAdd}>
          {t("product.add")}
        </button>
      </div>
    </div>
  );
}
