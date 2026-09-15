"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import ProductVisual from "./ProductVisual";

export default function CartDrawer() {
  const { lang, t } = useLang();
  const { items, changeQty, subtotal, isOpen, closeCart } = useCart();
  const router = useRouter();

  // The drawer is anchored with a logical inset-inline-end, which flips sides
  // between LTR and RTL — so the "hidden" offset must flip sign too, or the
  // drawer stays on-screen after a language switch.
  const hiddenTransform = lang === "ar" ? "translateX(-100%)" : "translateX(100%)";

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <div
        className={`backdrop fixed inset-0 bg-black/40 z-50 ${
          isOpen ? "" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />
      <aside
        className="drawer fixed top-0 bottom-0 z-50 w-full max-w-sm bg-beige shadow-2xl flex flex-col"
        style={{ insetInlineEnd: 0, transform: isOpen ? "translateX(0)" : hiddenTransform }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--beige-200)" }}>
          <h3 className="font-display text-xl" style={{ color: "var(--teal)" }}>
            {t("cart.title")}
          </h3>
          <button className="p-2 rounded-full hover:bg-beige-200/60" aria-label="Close" onClick={closeCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "var(--ink-soft)" }}>
              {t("cart.empty")}
            </p>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 items-center">
                <ProductVisual product={product} className="w-16 h-16 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{product.name[lang]}</p>
                  <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                    {product.price} {t("currency")}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button
                      className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                      style={{ borderColor: "var(--beige-200)" }}
                      onClick={() => changeQty(product.id, -1)}
                    >
                      −
                    </button>
                    <span className="text-xs w-4 text-center">{qty}</span>
                    <button
                      className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                      style={{ borderColor: "var(--beige-200)" }}
                      onClick={() => changeQty(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t" style={{ borderColor: "var(--beige-200)" }}>
          <div className="flex items-center justify-between mb-4 font-semibold">
            <span>{t("cart.subtotal")}</span>
            <span>
              {subtotal} {t("currency")}
            </span>
          </div>
          <button
            className="btn btn-primary w-full py-3.5 disabled:opacity-50"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            {t("cart.checkout")}
          </button>
        </div>
      </aside>
    </>
  );
}
