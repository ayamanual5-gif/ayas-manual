import type { Product } from "./types";

/** True when the product has an active discount (discountPercent between 1-100). */
export function hasDiscount(product: Pick<Product, "discountPercent">): boolean {
  return typeof product.discountPercent === "number" && product.discountPercent > 0;
}

/** The actual price a customer pays — `price` minus the discount, rounded to the nearest whole unit. */
export function getEffectivePrice(product: Pick<Product, "price" | "discountPercent">): number {
  if (!hasDiscount(product)) return product.price;
  return Math.round(product.price * (1 - (product.discountPercent as number) / 100));
}
