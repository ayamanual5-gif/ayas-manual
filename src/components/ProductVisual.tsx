import { resolveImageUrl } from "@/lib/api";
import { ProductIcon, tintBgVar, tintColorVar } from "@/lib/icons";
import type { Product } from "@/lib/types";

/**
 * Renders a product's real photo when the admin uploaded one, otherwise falls
 * back to the illustrated icon tile used throughout the storefront.
 */
export default function ProductVisual({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const cover = product.images?.[0];

  if (cover) {
    return (
      <div className={`icon-tile overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveImageUrl(cover)}
          alt={product.name.ar}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`icon-tile ${className}`}
      style={{ background: tintBgVar[product.tint], color: tintColorVar[product.tint] }}
    >
      <ProductIcon name={product.icon} />
    </div>
  );
}
