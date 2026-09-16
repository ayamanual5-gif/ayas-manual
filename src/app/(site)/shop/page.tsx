import { productService } from "@/server/services/ProductService";
import { categoryService } from "@/server/services/CategoryService";
import ShopSection from "@/components/ShopSection";
import type { Category, Product } from "@/lib/types";

const fallbackCategories: Category[] = [{ key: "all", ar: "الكل", en: "All" }];

// Products/categories come straight from the database — always render fresh
// so new items or edits from the admin panel show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: Product[] = [];
  let categories: Category[] = fallbackCategories;
  let loadError = false;

  try {
    [products, categories] = await Promise.all([productService.getAll(), categoryService.getAll()]);
  } catch {
    loadError = true;
  }

  return <ShopSection products={products} categories={categories} loadError={loadError} />;
}
