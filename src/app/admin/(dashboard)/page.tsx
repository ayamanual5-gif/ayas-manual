"use client";

import { useEffect, useState } from "react";
import { fetchAdminStats } from "@/lib/adminApi";
import type { AdminStats } from "@/lib/adminApi";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
        نظرة عامة
      </h1>
      <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
        أهلاً بيكي في لوحة تحكم Aya&apos;s Manual — إليكِ آخر مستجدات المتجر.
      </p>

      {error && (
        <p className="mt-6 card p-5" style={{ color: "var(--rose-600)" }}>
          تعذر تحميل الإحصائيات — تأكدي إن السيرفر الخلفي شغال.
        </p>
      )}

      {stats && (
        <div className="mt-6 grid sm:grid-cols-3 gap-5">
          <StatCard label="طلبات جديدة" value={stats.newOrdersCount} href="/admin/orders" accent="rose" />
          <StatCard
            label="طلبات خاصة جديدة"
            value={stats.newCustomOrdersCount}
            href="/admin/custom-orders"
            accent="olive"
          />
          <StatCard label="عدد المنتجات" value={stats.productsCount} href="/admin/products" accent="teal" />
        </div>
      )}
    </div>
  );
}
