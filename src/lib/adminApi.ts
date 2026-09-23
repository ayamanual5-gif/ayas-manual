import type { Category, CustomOrder, Order, OrderStatus, Product, Settings } from "./types";

async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(path, {
    ...options,
    cache: "no-store",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  return res;
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// ---- Auth ----

export async function adminLogin(email: string, password: string): Promise<{ email: string }> {
  const res = await adminFetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return parseOrThrow(res);
}

export async function adminLogout(): Promise<void> {
  await adminFetch("/api/admin/logout", { method: "POST" });
}

export async function fetchAdminMe(): Promise<{ email: string | null }> {
  const res = await adminFetch("/api/admin/me");
  return parseOrThrow(res);
}

// ---- Stats ----

export interface AdminStats {
  newOrdersCount: number;
  newCustomOrdersCount: number;
  productsCount: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await adminFetch("/api/admin/stats");
  return parseOrThrow(res);
}

// ---- Products ----

export async function fetchAdminProducts(): Promise<Product[]> {
  const res = await adminFetch("/api/admin/products");
  return parseOrThrow(res);
}

export async function createAdminProduct(formData: FormData): Promise<Product> {
  const res = await adminFetch("/api/admin/products", { method: "POST", body: formData });
  return parseOrThrow(res);
}

export async function updateAdminProduct(id: number, formData: FormData): Promise<Product> {
  const res = await adminFetch(`/api/admin/products/${id}`, { method: "PUT", body: formData });
  return parseOrThrow(res);
}

export async function deleteAdminProduct(id: number): Promise<void> {
  const res = await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
  await parseOrThrow(res);
}

// ---- Categories ----

export async function fetchAdminCategories(): Promise<Category[]> {
  const res = await adminFetch("/api/admin/categories");
  return parseOrThrow(res);
}

export async function createAdminCategory(data: { ar: string; en: string }): Promise<Category> {
  const res = await adminFetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(res);
}

export async function updateAdminCategory(
  key: string,
  data: { ar?: string; en?: string }
): Promise<Category> {
  const res = await adminFetch(`/api/admin/categories/${key}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseOrThrow(res);
}

export async function deleteAdminCategory(key: string): Promise<void> {
  const res = await adminFetch(`/api/admin/categories/${key}`, { method: "DELETE" });
  await parseOrThrow(res);
}

// ---- Orders ----

export async function fetchAdminOrders(): Promise<Order[]> {
  const res = await adminFetch("/api/admin/orders");
  return parseOrThrow(res);
}

export async function updateAdminOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const res = await adminFetch(`/api/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return parseOrThrow(res);
}

// ---- Custom orders ----

export async function fetchAdminCustomOrders(): Promise<CustomOrder[]> {
  const res = await adminFetch("/api/admin/custom-orders");
  return parseOrThrow(res);
}

export async function updateAdminCustomOrder(
  id: number,
  patch: { status?: OrderStatus; internalNote?: string }
): Promise<CustomOrder> {
  const res = await adminFetch(`/api/admin/custom-orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  return parseOrThrow(res);
}

// ---- Settings ----

export async function fetchAdminSettings(): Promise<Settings> {
  const res = await adminFetch("/api/admin/settings");
  return parseOrThrow(res);
}

export async function updateAdminSettings(data: Settings): Promise<Settings> {
  const res = await adminFetch("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return parseOrThrow(res);
}
