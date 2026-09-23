"use client";

import { useEffect, useState } from "react";
import { fetchAdminOrders, updateAdminOrderStatus } from "@/lib/adminApi";
import StatusSelect from "@/components/admin/StatusSelect";
import { useToast } from "@/context/ToastContext";
import type { Order, OrderStatus } from "@/lib/types";

const paymentLabels: Record<string, string> = {
  instapay: "إنستاباي",
  vodafone_cash: "فودافون كاش",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminOrders()
      .then(setOrders)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdatingId(order.id);
    try {
      const updated = await updateAdminOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      showToast("تم تحديث حالة الطلب");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "تعذر تحديث الحالة");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
        الطلبات
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        كل طلبات الشراء من المتجر، الأحدث أولاً.
      </p>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل الطلبات — تأكدي إن السيرفر الخلفي شغال.
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
                <th className="p-3 text-start">التاريخ</th>
                <th className="p-3 text-start">العميلة</th>
                <th className="p-3 text-start">المنتجات</th>
                <th className="p-3 text-start">الإجمالي</th>
                <th className="p-3 text-start">الدفع</th>
                <th className="p-3 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 align-top" style={{ borderColor: "var(--beige-200)" }}>
                  <td className="p-3 whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {order.phone}
                    </p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {order.city} — {order.address}
                    </p>
                  </td>
                  <td className="p-3">
                    <ul className="space-y-0.5">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-xs">
                          {item.name} × {item.qty}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 font-bold whitespace-nowrap" style={{ color: "var(--teal)" }}>
                    {order.subtotal} ج.م
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <p>{paymentLabels[order.paymentMethod] ?? order.paymentMethod}</p>
                    {order.paymentReference && (
                      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                        رقم العملية: {order.paymentReference}
                      </p>
                    )}
                    {order.paymentProofUrl && (
                      <a
                        href={order.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={order.paymentProofUrl}
                          alt="إثبات التحويل"
                          className="w-12 h-12 rounded-lg object-cover border"
                          style={{ borderColor: "var(--beige-200)" }}
                        />
                      </a>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusSelect
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(status) => handleStatusChange(order, status)}
                    />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center" style={{ color: "var(--ink-soft)" }}>
                    مفيش طلبات لسه.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
