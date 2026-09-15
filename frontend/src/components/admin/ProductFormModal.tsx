"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createAdminProduct, updateAdminProduct } from "@/lib/adminApi";
import { resolveImageUrl } from "@/lib/api";
import type { Category, Product, ProductTint } from "@/lib/types";

const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "bag", label: "شنطة" },
  { value: "scarf", label: "اسكارف" },
  { value: "flower", label: "إكسسوار" },
  { value: "plant", label: "نبات / ديكور" },
  { value: "cardigan", label: "كارديجان" },
];

const TINT_OPTIONS: { value: ProductTint; label: string; color: string }[] = [
  { value: "teal", label: "تركواز", color: "var(--teal)" },
  { value: "rose", label: "وردي", color: "var(--rose)" },
  { value: "olive", label: "زيتي", color: "var(--olive)" },
];

interface FormState {
  nameAr: string;
  nameEn: string;
  tagAr: string;
  tagEn: string;
  descAr: string;
  descEn: string;
  category: string;
  icon: string;
  tint: ProductTint;
  price: string;
  isNew: boolean;
}

function emptyForm(defaultCategory: string): FormState {
  return {
    nameAr: "",
    nameEn: "",
    tagAr: "",
    tagEn: "",
    descAr: "",
    descEn: "",
    category: defaultCategory,
    icon: "bag",
    tint: "teal",
    price: "",
    isNew: false,
  };
}

function fromProduct(product: Product): FormState {
  return {
    nameAr: product.name.ar,
    nameEn: product.name.en,
    tagAr: product.tag.ar,
    tagEn: product.tag.en,
    descAr: product.desc.ar,
    descEn: product.desc.en,
    category: product.category,
    icon: product.icon,
    tint: product.tint,
    price: String(product.price),
    isNew: product.isNew,
  };
}

export default function ProductFormModal({
  open,
  categories,
  product,
  onClose,
  onSaved,
}: {
  open: boolean;
  categories: Category[];
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product) => void;
}) {
  const isEdit = product !== null;
  const selectableCategories = categories.filter((c) => c.key !== "all");

  const [form, setForm] = useState<FormState>(() =>
    product ? fromProduct(product) : emptyForm(selectableCategories[0]?.key ?? "")
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(product ? fromProduct(product) : emptyForm(selectableCategories[0]?.key ?? ""));
    setImageFile(null);
    setImagePreview(product?.image ? resolveImageUrl(product.image) : null);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  if (!open) return null;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nameAr.trim() || !form.nameEn.trim() || !form.category || !form.price) {
      setError("من فضلك املي الاسم بالعربي والإنجليزي، الفئة، والسعر.");
      return;
    }
    const numericPrice = Number(form.price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("السعر لازم يكون رقم أكبر من صفر.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("nameAr", form.nameAr.trim());
      fd.append("nameEn", form.nameEn.trim());
      fd.append("tagAr", form.tagAr.trim());
      fd.append("tagEn", form.tagEn.trim());
      fd.append("descAr", form.descAr.trim());
      fd.append("descEn", form.descEn.trim());
      fd.append("category", form.category);
      fd.append("icon", form.icon);
      fd.append("tint", form.tint);
      fd.append("price", form.price);
      fd.append("isNew", String(form.isNew));
      if (imageFile) fd.append("image", imageFile);

      const saved =
        isEdit && product ? await updateAdminProduct(product.id, fd) : await createAdminProduct(fd);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصل خطأ، جربي تاني.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-2xl w-full p-6 sm:p-7 my-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl" style={{ color: "var(--teal)" }}>
            {isEdit ? "تعديل منتج" : "إضافة منتج جديد"}
          </h3>
          <button className="p-2 rounded-full hover:bg-beige-200/60" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="field">
              <label>اسم المنتج (عربي)</label>
              <input value={form.nameAr} onChange={(e) => updateField("nameAr", e.target.value)} required />
            </div>
            <div className="field">
              <label>اسم المنتج (إنجليزي)</label>
              <input value={form.nameEn} onChange={(e) => updateField("nameEn", e.target.value)} required />
            </div>
            <div className="field">
              <label>وصف قصير (عربي)</label>
              <input value={form.tagAr} onChange={(e) => updateField("tagAr", e.target.value)} />
            </div>
            <div className="field">
              <label>وصف قصير (إنجليزي)</label>
              <input value={form.tagEn} onChange={(e) => updateField("tagEn", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>الوصف التفصيلي (عربي)</label>
            <textarea rows={2} value={form.descAr} onChange={(e) => updateField("descAr", e.target.value)} />
          </div>
          <div className="field">
            <label>الوصف التفصيلي (إنجليزي)</label>
            <textarea rows={2} value={form.descEn} onChange={(e) => updateField("descEn", e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="field">
              <label>الفئة</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)} required>
                {selectableCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.ar}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>الشكل الأيقوني</label>
              <select value={form.icon} onChange={(e) => updateField("icon", e.target.value)}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>السعر (ج.م)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>اللون المميز (يظهر لو مفيش صورة حقيقية)</label>
            <div className="flex gap-3">
              {TINT_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => updateField("tint", opt.value)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold border-2"
                  style={{
                    borderColor: form.tint === opt.value ? opt.color : "var(--beige-200)",
                    color: "var(--ink)",
                  }}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: opt.color }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => updateField("isNew", e.target.checked)}
              className="w-4 h-4"
            />
            وسم المنتج بـ &quot;جديد&quot;
          </label>

          <div className="field">
            <label>صورة المنتج (اختياري — لو مفيش، هيظهر شكل أيقوني بدلها)</label>
            <div
              className="dropzone p-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="preview" className="mx-auto rounded-xl max-h-40 object-cover" />
              ) : (
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  اضغطي لاختيار صورة
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
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
