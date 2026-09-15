import type { OrderStatus } from "@/lib/types";

const statusLabels: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  shipped: "تم الشحن",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "var(--olive)",
  confirmed: "var(--teal)",
  shipped: "var(--rose)",
};

export default function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className="rounded-full px-3 py-1.5 text-xs font-semibold border-0 cursor-pointer disabled:opacity-50"
      style={{ background: statusColors[value], color: "var(--beige-100)" }}
    >
      {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
        <option key={status} value={status} style={{ color: "var(--ink)", background: "var(--beige-100)" }}>
          {statusLabels[status]}
        </option>
      ))}
    </select>
  );
}
