import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { categoryService } from "@/server/services/CategoryService";
import { productService } from "@/server/services/ProductService";

export const PUT = withAdmin(async (request, context) => {
  const { key } = await context.params;

  if (key === "all") {
    return NextResponse.json({ error: 'لا يمكن تعديل تصنيف "الكل"' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const { ar, en } = body ?? {};
  const patch: { ar?: string; en?: string } = {};
  if (typeof ar === "string" && ar.trim()) patch.ar = ar.trim();
  if (typeof en === "string" && en.trim()) patch.en = en.trim();

  const updated = await categoryService.update(key, patch);
  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
});

export const DELETE = withAdmin(async (_request, context) => {
  const { key } = await context.params;

  if (key === "all") {
    return NextResponse.json({ error: 'لا يمكن حذف تصنيف "الكل"' }, { status: 400 });
  }

  const products = await productService.getAll();
  if (products.some((p) => p.category === key)) {
    return NextResponse.json({ error: "لا يمكن حذف تصنيف مرتبط بمنتجات موجودة" }, { status: 400 });
  }

  const removed = await categoryService.remove(key);
  if (!removed) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
});
