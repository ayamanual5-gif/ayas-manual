import Link from "next/link";
import { notFound } from "next/navigation";
import { productService } from "@/server/services/ProductService";
import ProductDetailClient from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await productService.getById(id);

  if (!product) {
    notFound();
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
      <nav className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        <Link href="/shop" className="hover:text-[var(--rose)] transition-colors">
          المتجر
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name.ar}</span>
      </nav>

      <ProductDetailClient product={product} />
    </section>
  );
}
