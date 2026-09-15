export interface LocalizedText {
  ar: string;
  en: string;
}

export type ProductTint = "teal" | "rose" | "olive";

export interface Product {
  id: number;
  category: string;
  icon: string;
  tint: ProductTint;
  price: number;
  isNew: boolean;
  name: LocalizedText;
  tag: LocalizedText;
  desc: LocalizedText;
  /** Optional real product photo uploaded by the admin. Falls back to the icon tile when absent. */
  image?: string | null;
}

export interface Category {
  key: string;
  ar: string;
  en: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped";

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  paymentReference?: string;
  items: OrderItem[];
  subtotal: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CustomOrder {
  id: number;
  name: string;
  phone: string;
  category: string;
  description: string;
  imagePath: string | null;
  status: OrderStatus;
  /** Private note the shop owner leaves for herself — never shown to the customer. */
  internalNote?: string;
  createdAt: string;
}

export interface AdminTokenPayload {
  email: string;
}
