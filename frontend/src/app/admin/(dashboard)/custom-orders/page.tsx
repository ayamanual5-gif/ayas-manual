"use client";

import { useEffect, useState } from "react";
import { fetchAdminCustomOrders, updateAdminCustomOrder } from "@/lib/adminApi";
import { resolveImageUrl } from "@/lib/api";
import StatusSelect from "@/components/admin/StatusSelect";
import { useToast } from "@/context/ToastContext";
import type { CustomOrder, OrderStatus } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

function CustomOrderCard({
  item,
  onUpdated,
}: {
  item: CustomOrder;
  onUpdated: (updated: CustomOrder) => void;
}) {
  const { showToast } = useToast();
  const [note, setNote] = useState(item.internalNote ?? "");
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const noteChanged = note !== (item.internalNote ?? "");

  async function handleStatusChange(status: OrderStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateAdminCustomOrder(item.id, { status });
      onUpdated(updated);
      showToast("تم تحديث الحالة");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر تحديث الحالة");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleSaveNote() {
    setSavingNote(true);
    try {
      const updated = await updateAdminCustomOrder(item.id, { internalNote: note });
      onUpdated(updated);
      showToast("تم حفظ الملاحظة");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر حفظ الملاحظة");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
            {item.phone}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
            {formatDate(item.createdAt)}
          </p>
        </div>
        <StatusSelect value={item.status} disabled={updatingStatus} onChange={handleStatusChange} />
      </div>

      {item.imagePath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageUrl(item.imagePath)}
          alt="صورة مرجعية من العميلة"
          className="w-full max-h-72 object-cover rounded-2xl"
        />
      )}

      <p className="text-sm leading-relaxed">{item.description}</p>

      <div className="field mb-0">
        <label>ملاحظة داخلية (مش هتظهر للعميلة)</label>
        <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {noteChanged && (
        <button
          className="btn btn-outline self-start !py-1.5 !px-4 text-xs disabled:opacity-60"
          onClick={handleSaveNote}
          disabled={savingNote}
        >
          {savingNote ? "جاري الحفظ..." : "حفظ الملاحظة"}
        </button>
      )}
    </div>
  );
}

export default function AdminCustomOrdersPage() {
  const [items, setItems] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminCustomOrders()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  function handleUpdated(updated: CustomOrder) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
        الطلبات الخاصة
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        طلبات القطع المخصصة اللي بترفع فيها العميلات صور مرجعية.
      </p>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل الطلبات الخاصة — تأكدي إن السيرفر الخلفي شغال.
        </p>
      )}

      {!error && loading && (
        <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
          جاري التحميل...
        </p>
      )}

      {!error && !loading && (
        <div className="mt-6 grid lg:grid-cols-2 gap-5">
          {items.map((item) => (
            <CustomOrderCard key={item.id} item={item} onUpdated={handleUpdated} />
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center py-6" style={{ color: "var(--ink-soft)" }}>
              مفيش طلبات خاصة لسه.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
