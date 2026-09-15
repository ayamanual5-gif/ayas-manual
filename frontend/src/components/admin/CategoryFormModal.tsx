"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createAdminCategory, updateAdminCategory } from "@/lib/adminApi";
import type { Category } from "@/lib/types";

export default function CategoryFormModal({
  open,
  category,
  onClose,
  onSaved,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: (category: Category) => void;
}) {
  const isEdit = category !== null;
  const [ar, setAr] = useState("");
  const [en, setEn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setAr(category?.ar ?? "");
    setEn(category?.en ?? "");
    setError("");
  }, [open, category]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!ar.trim() || !en.trim()) {
      setError("من فضلك املي اسم الفئة بالعربي والإنجليزي.");
      return;
    }

    setSubmitting(true);
    try {
      const saved =
        isEdit && category
          ? await updateAdminCategory(category.key, { ar: ar.trim(), en: en.trim() })
          : await createAdminCategory({ ar: ar.trim(), en: en.trim() });
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصل خطأ، جربي تاني.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-sm w-full p-6">
        <h3 className="font-display text-xl mb-5" style={{ color: "var(--teal)" }}>
          {isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label>اسم الفئة (عربي)</label>
            <input value={ar} onChange={(e) => setAr(e.target.value)} required />
          </div>
          <div className="field">
            <label>اسم الفئة (إنجليزي)</label>
            <input value={en} onChange={(e) => setEn(e.target.value)} required />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" className="btn btn-outline flex-1 py-2.5" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary flex-1 py-2.5 disabled:opacity-60" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
