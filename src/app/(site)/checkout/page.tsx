"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { fetchSettings, submitOrder } from "@/lib/api";
import ProductVisual from "@/components/ProductVisual";
import { EASE } from "@/components/motion/variants";
import type { OrderItem } from "@/lib/types";

type PaymentMethod = "instapay" | "vodafone_cash";

const FALLBACK_INSTAPAY_HANDLE = "ayasmanual@instapay";
const FALLBACK_VODAFONE_CASH_NUMBER = "010 0123 4567";

export default function CheckoutPage() {
  const { lang, t } = useLang();
  const { items, subtotal, clearCart } = useCart();

  const [instapayHandle, setInstapayHandle] = useState(FALLBACK_INSTAPAY_HANDLE);
  const [vodafoneCashNumber, setVodafoneCashNumber] = useState(FALLBACK_VODAFONE_CASH_NUMBER);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        setInstapayHandle(settings.instapayHandle);
        setVodafoneCashNumber(settings.vodafoneCashNumber);
        setWhatsappNumber(settings.whatsappNumber);
      })
      .catch(() => {
        // keep the fallback values — the checkout flow still works either way
      });
  }, []);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("instapay");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [orderId, setOrderId] = useState<number | null>(null);

  function handleProofChange(file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setPaymentProof(file);
    const reader = new FileReader();
    reader.onload = (e) => setProofPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const orderItems: OrderItem[] = items.map(({ product, qty }) => ({
      productId: product.id,
      name: product.name[lang],
      price: product.price,
      qty,
    }));

    try {
      const saved = await submitOrder(
        {
          customerName,
          phone,
          address,
          city,
          paymentMethod,
          paymentReference,
          items: orderItems,
          subtotal,
          notes,
        },
        paymentProof
      );
      setOrderId(saved.id);
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const whatsappHref =
    whatsappNumber && orderId
      ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
          `${t("checkout.whatsappMessage")} #${orderId}`
        )}`
      : null;

  if (status === "success") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "var(--teal)" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--beige-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>
        <h1 className="font-display mt-5 text-3xl" style={{ color: "var(--teal)" }}>
          {t("checkout.successTitle")}
        </h1>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("checkout.successMsg")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {whatsappHref && (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn px-7 py-3.5 inline-flex items-center gap-2"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11a16.5 16.5 0 0 1-1.6-.6c-2.83-1.22-4.67-4.06-4.81-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 1.99.89 2.13.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
              </svg>
              {t("checkout.whatsappBtn")}
            </motion.a>
          )}
          <Link href="/" className="btn btn-primary px-7 py-3.5 inline-flex">
            {t("checkout.backHome")}
          </Link>
        </div>
      </motion.section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-3xl" style={{ color: "var(--teal)" }}>
          {t("checkout.emptyTitle")}
        </h1>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("checkout.emptyMsg")}
        </p>
        <Link href="/shop" className="btn btn-primary mt-8 px-7 py-3.5 inline-flex">
          {t("cart.continueShopping")}
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
        {t("checkout.title")}
      </h1>

      <div className="mt-10 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="card p-5">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              {t("checkout.itemsTitle")}
            </h2>
            <div className="mt-4 space-y-4">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <ProductVisual product={product} className="w-14 h-14 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{product.name[lang]}</p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {qty} × {product.price} {t("currency")}
                    </p>
                  </div>
                  <div className="text-sm font-bold" style={{ color: "var(--teal)" }}>
                    {qty * product.price} {t("currency")}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t flex items-center justify-between font-bold" style={{ borderColor: "var(--beige-200)" }}>
              <span>{t("cart.subtotal")}</span>
              <span style={{ color: "var(--teal)" }}>
                {subtotal} {t("currency")}
              </span>
            </div>
          </div>
        </div>

        <form className="lg:col-span-3 order-1 lg:order-2 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              {t("checkout.customerTitle")}
            </h2>
            <div className="field">
              <label>{t("custom.labelName")}</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={t("custom.phName")} />
            </div>
            <div className="field">
              <label>{t("custom.labelPhone")}</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("custom.phPhone")} />
            </div>
            <div className="field">
              <label>{t("checkout.labelAddress")}</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("checkout.phAddress")} />
            </div>
            <div className="field">
              <label>{t("checkout.labelCity")}</label>
              <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("checkout.phCity")} />
            </div>
            <div className="field">
              <label>{t("checkout.labelNotes")}</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("checkout.phNotes")} />
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              {t("checkout.paymentTitle")}
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {(["instapay", "vodafone_cash"] as PaymentMethod[]).map((method) => (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className="tab-btn justify-center"
                  style={{
                    background: paymentMethod === method ? "var(--teal)" : "var(--beige-100)",
                    color: paymentMethod === method ? "var(--beige-100)" : "var(--ink-soft)",
                    border: "1.5px solid var(--beige-200)",
                  }}
                >
                  {method === "instapay" ? t("checkout.paymentInstaPay") : t("checkout.paymentVodafone")}
                </motion.button>
              ))}
            </div>

            <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--beige-100)", border: "1px solid var(--beige-200)" }}>
              <p style={{ color: "var(--ink-soft)" }}>
                {paymentMethod === "instapay" ? t("checkout.instapayHandle") : t("checkout.vodafoneNumber")}
              </p>
              <p className="mt-1 font-bold text-lg" style={{ color: "var(--teal)" }}>
                {paymentMethod === "instapay" ? instapayHandle : vodafoneCashNumber}
              </p>
              <p className="mt-3 text-xs" style={{ color: "var(--ink-soft)" }}>
                {t("checkout.paymentNote")}
              </p>
            </div>

            <div className="field">
              <label>{t("checkout.labelPaymentRef")}</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder={t("checkout.phPaymentRef")}
              />
            </div>

            <div className="field">
              <label>{t("checkout.labelPaymentProof")}</label>
              <div
                className="dropzone p-4 text-center cursor-pointer"
                onClick={() => document.getElementById("payment-proof-input")?.click()}
              >
                <input
                  id="payment-proof-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProofChange(e.target.files?.[0])}
                />
                {proofPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={proofPreview} alt="" className="mx-auto rounded-xl max-h-40 object-cover" />
                ) : (
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    {t("checkout.uploadProofHint")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {status === "error" && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {t("checkout.errorMsg")}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn btn-primary w-full py-3.5 disabled:opacity-60"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? t("checkout.submitting") : t("checkout.submit")}
          </motion.button>
        </form>
      </div>
    </section>
  );
}
