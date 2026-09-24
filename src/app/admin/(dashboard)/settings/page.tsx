"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { fetchAdminSettings, removeAboutImage, updateAdminSettings, uploadAboutImage } from "@/lib/adminApi";
import { resolveImageUrl } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { Settings } from "@/lib/types";

const emptySettings: Settings = {
  instapayHandle: "",
  vodafoneCashNumber: "",
  whatsappNumber: "",
  contactEmail: "",
  socialInstagram: "",
  socialTiktok: "",
  aboutImageUrl: "",
};

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);

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

  async function handleAboutImageSelect(file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageBusy(true);
    try {
      const saved = await uploadAboutImage(file);
      setForm(saved);
      showToast("تم رفع الصورة");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setImageBusy(false);
    }
  }

  async function handleAboutImageRemove() {
    setImageBusy(true);
    try {
      const saved = await removeAboutImage();
      setForm(saved);
      showToast("تم حذف الصورة");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف الصورة");
    } finally {
      setImageBusy(false);
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

      {!error && !loading && (
        <div className="card p-6 space-y-4 mt-6 max-w-lg">
          <h2 className="font-semibold" style={{ color: "var(--teal)" }}>
            صورة صفحة &quot;من نحن&quot;
          </h2>
          <p className="text-xs -mt-2" style={{ color: "var(--ink-soft)" }}>
            بتظهر جنب قصتنا في صفحة &quot;من نحن&quot;. لو مفيش صورة، هيظهر شكل تجميلي بدالها.
          </p>

          {form.aboutImageUrl && (
            <div className="relative w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(form.aboutImageUrl)}
                alt="صورة من نحن"
                className="w-full aspect-[4/5] object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleAboutImageRemove}
                disabled={imageBusy}
                className="absolute -top-2 -end-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold disabled:opacity-60"
                style={{ background: "var(--rose)", color: "#fff" }}
                aria-label="إزالة الصورة"
              >
                ×
              </button>
            </div>
          )}

          <div
            className="dropzone p-4 text-center cursor-pointer"
            onClick={() => aboutImageInputRef.current?.click()}
          >
            <input
              ref={aboutImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleAboutImageSelect(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {imageBusy
                ? "جاري الرفع..."
                : form.aboutImageUrl
                  ? "اضغطي لتغيير الصورة"
                  : "اضغطي لرفع صورة"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
