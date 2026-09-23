"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/adminApi";
import { useToast } from "@/context/ToastContext";
import type { Settings } from "@/lib/types";

const emptySettings: Settings = {
  instapayHandle: "",
  vodafoneCashNumber: "",
  whatsappNumber: "",
  contactEmail: "",
  socialInstagram: "",
  socialTiktok: "",
};

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminSettings()
      .then(setForm)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await updateAdminSettings(form);
      setForm(saved);
      showToast("تم حفظ الإعدادات");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حفظ البيانات");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
        الإعدادات
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        بيانات الدفع وبيانات التواصل بتظهر للعميلات في الموقع.
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
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-lg">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              بيانات الدفع
            </h2>
            <div className="field">
              <label>حساب إنستاباي</label>
              <input
                value={form.instapayHandle}
                onChange={(e) => updateField("instapayHandle", e.target.value)}
                placeholder="ayasmanual@instapay"
                required
              />
            </div>
            <div className="field">
              <label>رقم فودافون كاش</label>
              <input
                value={form.vodafoneCashNumber}
                onChange={(e) => updateField("vodafoneCashNumber", e.target.value)}
                placeholder="010 0123 4567"
                required
              />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              بيانات التواصل
            </h2>
            <p className="text-xs -mt-2" style={{ color: "var(--ink-soft)" }}>
              رقم الواتساب ده هو نفسه اللي بيظهر زر التواصل بعد إتمام الطلب.
            </p>
            <div className="field">
              <label>رقم الواتساب</label>
              <input
                value={form.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                placeholder="+20 100 123 4567"
              />
            </div>
            <div className="field">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="hello@ayasmanual.com"
              />
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
              روابط التواصل الاجتماعي
            </h2>
            <div className="field">
              <label>إنستجرام (رابط كامل)</label>
              <input
                value={form.socialInstagram}
                onChange={(e) => updateField("socialInstagram", e.target.value)}
                placeholder="https://instagram.com/ayasmanual"
              />
            </div>
            <div className="field">
              <label>تيك توك (رابط كامل)</label>
              <input
                value={form.socialTiktok}
                onChange={(e) => updateField("socialTiktok", e.target.value)}
                placeholder="https://tiktok.com/@ayasmanual"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary px-6 py-2.5 disabled:opacity-60" disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </form>
      )}
    </div>
  );
}
