"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createAdminProduct, updateAdminProduct } from "@/lib/adminApi";
import { resolveImageUrl } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "bag", label: "شنطة" },
  { value: "scarf", label: "اسكارف" },
  { value: "flower", label: "إكسسوار" },
  { value: "plant", label: "نبات / ديكور" },
  { value: "cardigan", label: "كارديجان" },
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
  price: string;
  discountPercent: string;
  isNew: boolean;
  showInHero: boolean;
}

// A single ordered list mixing already-uploaded photos and newly-picked
// files, so admins can reorder across both and pick any of them as the
// cover — not just append new ones after the existing set.
type ImageItem =
  | { id: string; kind: "existing"; url: string }
  | { id: string; kind: "new"; file: File; previewUrl: string };

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
    price: "",
    discountPercent: "",
    isNew: false,
    showInHero: false,
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
    price: String(product.price),
    discountPercent: product.discountPercent ? String(product.discountPercent) : "",
    isNew: product.isNew,
    showInHero: product.showInHero,
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
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setForm(product ? fromProduct(product) : emptyForm(selectableCategories[0]?.key ?? ""));
    setImages((product?.images ?? []).map((url) => ({ id: url, kind: "existing", url })));
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  // Release object URLs created for new-image previews once they're no longer needed.
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.kind === "new") URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  if (!open) return null;

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const accepted: ImageItem[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => {
        const previewUrl = URL.createObjectURL(file);
        return { id: previewUrl, kind: "new", file, previewUrl };
      });
    setImages((prev) => [...prev, ...accepted]);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.kind === "new") URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }

  function makeCover(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;
      return [target, ...prev.filter((img) => img.id !== id)];
    });
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
    if (form.discountPercent) {
      const numericDiscount = Number(form.discountPercent);
      if (!Number.isInteger(numericDiscount) || numericDiscount <= 0 || numericDiscount > 100) {
        setError("نسبة الخصم لازم تكون رقم صحيح من 1 لـ 100.");
        return;
      }
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
      fd.append("price", form.price);
      fd.append("discountPercent", form.discountPercent);
      fd.append("isNew", String(form.isNew));
      fd.append("showInHero", String(form.showInHero));

      // The final order (including which image is the cover) is carried by
      // imageOrder — a per-slot list of either an existing image's URL or
      // the "__new__" placeholder, aligned with the order new files are
      // appended below. The server interleaves them back together.
      const imageOrder = images.map((img) => (img.kind === "existing" ? img.url : "__new__"));
      fd.append("imageOrder", JSON.stringify(imageOrder));
      images.forEach((img) => {
        if (img.kind === "new") fd.append("images", img.file);
      });

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
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-8 sm:pt-12 bg-black/40 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-2xl w-full flex flex-col" style={{ maxHeight: "85vh" }}>
        <div
          className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-4 flex-shrink-0 border-b"
          style={{ borderColor: "var(--beige-200)" }}
        >
          <h3 className="font-display text-xl" style={{ color: "var(--teal)" }}>
            {isEdit ? "تعديل منتج" : "إضافة منتج جديد"}
          </h3>
          <button className="p-2 rounded-full hover:bg-beige-200/60" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-5 space-y-4">
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
            <label>الوصف التفصيلي (عربي) — بيظهر كامل في صفحة المنتج</label>
            <textarea rows={3} value={form.descAr} onChange={(e) => updateField("descAr", e.target.value)} />
          </div>
          <div className="field">
            <label>الوصف التفصيلي (إنجليزي) — بيظهر كامل في صفحة المنتج</label>
            <textarea rows={3} value={form.descEn} onChange={(e) => updateField("descEn", e.target.value)} />
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

          <div className="field sm:max-w-xs">
            <label>نسبة الخصم % (اختياري)</label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={form.discountPercent}
              onChange={(e) => updateField("discountPercent", e.target.value)}
              placeholder="مثلاً 20"
            />
            {form.discountPercent && Number(form.price) > 0 && (
              <p className="mt-1.5 text-xs" style={{ color: "var(--ink-soft)" }}>
                السعر بعد الخصم:{" "}
                <span className="font-bold" style={{ color: "var(--teal)" }}>
                  {Math.round(Number(form.price) * (1 - Number(form.discountPercent) / 100))} ج.م
                </span>
              </p>
            )}
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

          <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ink-soft)" }}>
            <input
              type="checkbox"
              checked={form.showInHero}
              onChange={(e) => updateField("showInHero", e.target.checked)}
              className="w-4 h-4"
            />
            إظهار المنتج في الدائرة الرئيسية (Hero Carousel)
          </label>

          <div className="field">
            <label>صور المنتج — الصورة اللي عليها علامة النجمة هي اللي بتظهر كغلاف في المتجر</label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {images.map((img, index) => {
                  const isCover = index === 0;
                  const src = img.kind === "existing" ? resolveImageUrl(img.url) : img.previewUrl;
                  return (
                    <div key={img.id} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt="صورة المنتج"
                        className="w-full aspect-square object-cover rounded-xl"
                        style={isCover ? { boxShadow: "0 0 0 2px var(--teal)" } : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -end-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "var(--rose)", color: "#fff" }}
                        aria-label="إزالة الصورة"
                      >
                        ×
                      </button>
                      {isCover ? (
                        <span
                          className="absolute bottom-1.5 start-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "var(--teal)", color: "#fff" }}
                          title="الصورة الرئيسية"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makeCover(img.id)}
                          className="absolute bottom-1.5 start-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(251,243,226,.92)", color: "var(--teal)", border: "1px solid var(--beige-200)" }}
                          title="اجعليها الصورة الرئيسية"
                          aria-label="اجعليها الصورة الرئيسية"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="dropzone p-4 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                اضغطي لإضافة صورة أو أكتر
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--rose-600)" }}>
              {error}
            </p>
          )}
        </div>

        <div
          className="flex gap-3 px-6 sm:px-7 py-4 flex-shrink-0 border-t"
          style={{ borderColor: "var(--beige-200)" }}
        >
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
