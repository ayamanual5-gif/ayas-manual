"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import ProductVisual from "./ProductVisual";
import { EASE } from "./motion/variants";

export default function CartDrawer() {
  const { lang, t } = useLang();
  const { items, changeQty, subtotal, isOpen, closeCart } = useCart();
  const router = useRouter();

  // The drawer is anchored with a logical inset-inline-end, which flips sides
  // between LTR and RTL — so the "hidden" offset must flip sign too, or the
  // drawer stays on-screen after a language switch.
  const hiddenX = lang === "ar" ? "-100%" : "100%";

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 bottom-0 z-50 w-full max-w-sm bg-beige shadow-2xl flex flex-col"
            style={{ insetInlineEnd: 0 }}
            initial={{ x: hiddenX }}
            animate={{ x: "0%" }}
            exit={{ x: hiddenX }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
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
                <AnimatePresence initial={false}>
                  {items.map(({ product, qty }, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05, ease: EASE } }}
                      exit={{ opacity: 0, x: lang === "ar" ? -30 : 30, transition: { duration: 0.2, ease: EASE } }}
                      className="flex gap-3 items-center"
                    >
                      <ProductVisual product={product} className="w-16 h-16 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{product.name[lang]}</p>
                        <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                          {product.price} {t("currency")}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                            style={{ borderColor: "var(--beige-200)" }}
                            onClick={() => changeQty(product.id, -1)}
                          >
                            −
                          </motion.button>
                          <motion.span
                            key={qty}
                            initial={{ scale: 1.3, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.18, ease: EASE }}
                            className="text-xs w-4 text-center inline-block"
                          >
                            {qty}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            className="w-6 h-6 rounded-full border flex items-center justify-center text-xs"
                            style={{ borderColor: "var(--beige-200)" }}
                            onClick={() => changeQty(product.id, 1)}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="p-5 border-t" style={{ borderColor: "var(--beige-200)" }}>
              <div className="flex items-center justify-between mb-4 font-semibold">
                <span>{t("cart.subtotal")}</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    {subtotal} {t("currency")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary w-full py-3.5 disabled:opacity-50"
                disabled={items.length === 0}
                onClick={handleCheckout}
              >
                {t("cart.checkout")}
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
