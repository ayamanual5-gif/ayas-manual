"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { fetchSettings, submitOrder } from "@/lib/api";
import ProductVisual from "@/components/ProductVisual";
import type { OrderItem } from "@/lib/types";

type PaymentMethod = "instapay" | "vodafone_cash";

const FALLBACK_INSTAPAY_HANDLE = "ayasmanual@instapay";
const FALLBACK_VODAFONE_CASH_NUMBER = "010 0123 4567";

export default function CheckoutPage() {
  const { lang, t } = useLang();
  const { items, subtotal, clearCart } = useCart();

  const [instapayHandle, setInstapayHandle] = useState(FALLBACK_INSTAPAY_HANDLE);
  const [vodafoneCashNumber, setVodafoneCashNumber] = useState(FALLBACK_VODAFONE_CASH_NUMBER);

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        setInstapayHandle(settings.instapayHandle);
        setVodafoneCashNumber(settings.vodafoneCashNumber);
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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
      await submitOrder({
        customerName,
        phone,
        address,
        city,
        paymentMethod,
        paymentReference,
        items: orderItems,
        subtotal,
        notes,
      });
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "var(--teal)" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--beige-100)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-display mt-5 text-3xl" style={{ color: "var(--teal)" }}>
          {t("checkout.successTitle")}
        </h1>
        <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
          {t("checkout.successMsg")}
        </p>
        <Link href="/" className="btn btn-primary mt-8 px-7 py-3.5 inline-flex">
          {t("checkout.backHome")}
        </Link>
      </section>
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
                <button
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
                </button>
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
          </div>

          {status === "error" && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {t("checkout.errorMsg")}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full py-3.5 disabled:opacity-60" disabled={status === "submitting"}>
            {status === "submitting" ? t("checkout.submitting") : t("checkout.submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
