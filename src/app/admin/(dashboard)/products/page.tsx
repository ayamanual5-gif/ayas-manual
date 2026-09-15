"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api";
import { deleteAdminProduct, fetchAdminProducts } from "@/lib/adminApi";
import ProductVisual from "@/components/ProductVisual";
import ProductFormModal from "@/components/admin/ProductFormModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Category, Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const categoryLabel = (key: string) => categories.find((c) => c.key === key)?.ar ?? key;

  async function load() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchAdminProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
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

  function openCreateForm() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function handleSaved(saved: Product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
    });
    setFormOpen(false);
    showToast(editingProduct ? "تم تعديل المنتج" : "تم إضافة المنتج");
  }

  async function handleConfirmDelete() {
    if (!deletingProduct) return;
    try {
      await deleteAdminProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      showToast("تم حذف المنتج");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حذف المنتج");
    } finally {
      setDeletingProduct(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
            المنتجات
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            إضافة وتعديل وحذف منتجات المتجر.
          </p>
        </div>
        <button className="btn btn-primary px-5 py-2.5" onClick={openCreateForm}>
          + إضافة منتج
        </button>
      </div>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل المنتجات — تأكدي إن السيرفر الخلفي شغال.
        </p>
      )}

      {!error && loading && (
        <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
          جاري التحميل...
        </p>
      )}

      {!error && !loading && (
        <div className="mt-6 card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-start" style={{ borderColor: "var(--beige-200)" }}>
                <th className="p-3 text-start">الصورة</th>
                <th className="p-3 text-start">الاسم</th>
                <th className="p-3 text-start">الفئة</th>
                <th className="p-3 text-start">السعر</th>
                <th className="p-3 text-start">جديد؟</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0" style={{ borderColor: "var(--beige-200)" }}>
                  <td className="p-3">
                    <ProductVisual product={product} className="w-12 h-12" />
                  </td>
                  <td className="p-3 font-semibold">{product.name.ar}</td>
                  <td className="p-3">{categoryLabel(product.category)}</td>
                  <td className="p-3">{product.price} ج.م</td>
                  <td className="p-3">{product.isNew ? "نعم" : "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline !py-1.5 !px-3 text-xs"
                        onClick={() => openEditForm(product)}
                      >
                        تعديل
                      </button>
                      <button
                        className="btn btn-rose !py-1.5 !px-3 text-xs"
                        onClick={() => setDeletingProduct(product)}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center" style={{ color: "var(--ink-soft)" }}>
                    مفيش منتجات لسه — ابدئي بإضافة أول منتج.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        categories={categories}
        product={editingProduct}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={deletingProduct !== null}
        title="حذف المنتج"
        message={`متأكدة إنك عايزة تحذفي "${deletingProduct?.name.ar ?? ""}"؟ الإجراء ده مش قابل للتراجع.`}
        confirmLabel="حذف"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </div>
  );
}
