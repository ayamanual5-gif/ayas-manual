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
  /** Percentage off `price` (0-100). Null/0 means no discount. */
  discountPercent: number | null;
  isNew: boolean;
  showInHero: boolean;
  name: LocalizedText;
  tag: LocalizedText;
  desc: LocalizedText;
  /** Real product photos uploaded from the admin panel (first = cover) — falls back to the icon tile when empty. */
  images: string[];
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
  paymentProofUrl?: string;
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
  internalNote?: string;
  createdAt: string;
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  paymentReference?: string;
  items: OrderItem[];
  subtotal: number;
  notes?: string;
}

export interface Settings {
  instapayHandle: string;
  vodafoneCashNumber: string;
  whatsappNumber: string;
  contactEmail: string;
  socialInstagram: string;
  socialTiktok: string;
  aboutImageUrl: string;
}

export type Lang = "ar" | "en";
