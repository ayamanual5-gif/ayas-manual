"use client";

import { useEffect, useState } from "react";
import { deleteAdminCategory, fetchAdminCategories } from "@/lib/adminApi";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    try {
      setCategories(await fetchAdminCategories());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visibleCategories = categories.filter((c) => c.key !== "all");

  function openCreateForm() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleSaved(saved: Category) {
    setCategories((prev) => {
      const exists = prev.some((c) => c.key === saved.key);
      return exists ? prev.map((c) => (c.key === saved.key ? saved : c)) : [...prev, saved];
    });
    setFormOpen(false);
    showToast(editingCategory ? "تم تعديل الفئة" : "تم إضافة الفئة");
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return;
    try {
      await deleteAdminCategory(deletingCategory.key);
      setCategories((prev) => prev.filter((c) => c.key !== deletingCategory.key));
      showToast("تم حذف الفئة");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف الفئة");
    } finally {
      setDeletingCategory(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
            الفئات
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            الفئات اللي بتظهر في المتجر وفورم الطلب الخاص.
          </p>
        </div>
        <button className="btn btn-primary px-5 py-2.5" onClick={openCreateForm}>
          + إضافة فئة
        </button>
      </div>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل الفئات — تأكدي إن السيرفر الخلفي شغال.
        </p>
      )}

      {!error && loading && (
        <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
          جاري التحميل...
        </p>
      )}

      {!error && !loading && (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCategories.map((category) => (
            <div key={category.key} className="card p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{category.ar}</p>
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  {category.en}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline !py-1.5 !px-3 text-xs" onClick={() => openEditForm(category)}>
                  تعديل
                </button>
                <button
                  className="btn btn-rose !py-1.5 !px-3 text-xs"
                  onClick={() => setDeletingCategory(category)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
          {visibleCategories.length === 0 && (
            <p className="col-span-full text-center py-6" style={{ color: "var(--ink-soft)" }}>
              مفيش فئات لسه.
            </p>
          )}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        category={editingCategory}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={deletingCategory !== null}
        title="حذف الفئة"
        message={`متأكدة إنك عايزة تحذفي فئة "${deletingCategory?.ar ?? ""}"؟`}
        confirmLabel="حذف"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  );
}
