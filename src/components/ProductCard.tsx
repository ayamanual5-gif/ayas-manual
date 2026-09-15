"use client";

import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ProductVisual from "./ProductVisual";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  onView,
}: {
  product: Product;
  onView: (product: Product) => void;
}) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product);
    showToast(t("toast.added"));
  };

  return (
    <div className="card p-4 flex flex-col group">
      <div className="relative">
        <ProductVisual product={product} />
        {product.isNew && (
          <span
            className="absolute top-2 chip !border-0 !py-1 !px-2.5 text-[10px]"
            style={{ insetInlineStart: ".5rem", background: "var(--rose)", color: "#fff" }}
          >
            {t("product.new")}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold leading-snug">{product.name[lang]}</h3>
      <p className="mt-1 text-xs" style={{ color: "var(--ink-soft)" }}>
        {product.tag[lang]}
      </p>
      <div className="mt-3 font-bold" style={{ color: "var(--teal)" }}>
        {product.price} {t("currency")}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-outline flex-1 !py-2 text-xs" onClick={() => onView(product)}>
          {t("product.view")}
        </button>
        <button className="btn btn-primary flex-1 !py-2 text-xs" onClick={handleAdd}>
          {t("product.add")}
        </button>
      </div>
    </div>
  );
}
