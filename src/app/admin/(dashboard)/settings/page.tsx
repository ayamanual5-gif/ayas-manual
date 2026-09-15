"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/adminApi";
import { useToast } from "@/context/ToastContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [instapayHandle, setInstapayHandle] = useState("");
  const [vodafoneCashNumber, setVodafoneCashNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminSettings()
      .then((settings) => {
        setInstapayHandle(settings.instapayHandle);
        setVodafoneCashNumber(settings.vodafoneCashNumber);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAdminSettings({ instapayHandle, vodafoneCashNumber });
      showToast("تم حفظ بيانات الدفع");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حفظ البيانات");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
        إعدادات الدفع
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        البيانات دي بتظهر للعميلات في صفحة إتمام الطلب.
      </p>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل الإعدادات — تأكدي إن السيرفر الخلفي شغال.
        </p>
      )}

      {!error && loading && (
        <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
          جاري التحميل...
        </p>
      )}

      {!error && !loading && (
        <form onSubmit={handleSubmit} className="mt-6 card p-6 max-w-lg space-y-4">
          <div className="field">
            <label>حساب إنستاباي</label>
            <input
              value={instapayHandle}
              onChange={(e) => setInstapayHandle(e.target.value)}
              placeholder="ayasmanual@instapay"
              required
            />
          </div>
          <div className="field">
            <label>رقم فودافون كاش</label>
            <input
              value={vodafoneCashNumber}
              onChange={(e) => setVodafoneCashNumber(e.target.value)}
              placeholder="010 0123 4567"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary px-6 py-2.5 disabled:opacity-60" disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </form>
      )}
    </div>
  );
}
