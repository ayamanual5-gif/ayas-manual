import { categoryService } from "@/server/services/CategoryService";
import CustomOrderSection from "@/components/CustomOrderSection";
import type { Category } from "@/lib/types";

const fallbackCategories: Category[] = [{ key: "all", ar: "الكل", en: "All" }];

export const dynamic = "force-dynamic";

export default async function CustomOrderPage() {
  let categories: Category[] = fallbackCategories;

  try {
    categories = await categoryService.getAll();
  } catch {
    // CustomOrderSection falls back gracefully to an empty category list
  }

  return <CustomOrderSection categories={categories} />;
}
