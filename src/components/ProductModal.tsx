"use client";

import { useEffect } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ProductVisual from "./ProductVisual";
import type { Product } from "@/lib/types";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const open = product !== null;

  return (
    <div
      className={`backdrop fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 ${
        open ? "" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card max-w-lg w-full p-6 sm:p-7 relative"
        style={{ transform: open ? "scale(1)" : "scale(.95)", transition: "transform .25s ease" }}
      >
        <button
          className="absolute top-4 p-2 rounded-full hover:bg-beige-200/60"
          style={{ insetInlineEnd: "1rem" }}
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {product && (
          <div className="grid gap-4">
            <ProductVisual product={product} className="mx-auto w-32" />
            <div className="text-center">
              {product.isNew && (
                <span
                  className="chip !border-0 text-[10px] mb-2 inline-block"
                  style={{ background: "var(--rose)", color: "#fff" }}
                >
                  {t("product.new")}
                </span>
              )}
              <h3 className="font-display text-2xl" style={{ color: "var(--teal)" }}>
                {product.name[lang]}
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                {product.tag[lang]}
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {product.desc[lang]}
              </p>
              <div className="mt-4 text-xl font-bold" style={{ color: "var(--teal)" }}>
                {product.price} {t("currency")}
              </div>
            </div>
            <button
              className="btn btn-primary w-full py-3"
              onClick={() => {
                addToCart(product);
                showToast(t("toast.added"));
                onClose();
              }}
            >
              {t("modal.add")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
