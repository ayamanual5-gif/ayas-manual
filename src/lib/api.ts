import type { Category, OrderPayload, Settings } from "./types";

export function resolveImageUrl(path: string): string {
  // R2-hosted images are already absolute URLs; anything else (shouldn't
  // normally happen) is returned as-is since there's no separate API origin anymore.
  return path;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function submitOrder(payload: OrderPayload, paymentProof?: File | null) {
  const fd = new FormData();
  fd.append("customerName", payload.customerName);
  fd.append("phone", payload.phone);
  fd.append("address", payload.address);
  fd.append("city", payload.city);
  fd.append("paymentMethod", payload.paymentMethod);
  if (payload.paymentReference) fd.append("paymentReference", payload.paymentReference);
  if (payload.notes) fd.append("notes", payload.notes);
  fd.append("subtotal", String(payload.subtotal));
  fd.append("items", JSON.stringify(payload.items));
  if (paymentProof) fd.append("paymentProof", paymentProof);

  const res = await fetch("/api/orders", { method: "POST", body: fd });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to submit order");
  }
  return res.json();
}

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

export async function submitCustomOrder(formData: FormData) {
  const res = await fetch("/api/custom-orders", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to submit custom order");
  }
  return res.json();
}
