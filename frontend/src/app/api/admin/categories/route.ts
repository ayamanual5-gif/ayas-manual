import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { categoryService } from "@/server/services/CategoryService";
import { slugify } from "@/server/slugify";

export const GET = withAdmin(async () => {
  const categories = await categoryService.getAll();
  return NextResponse.json(categories);
});

export const POST = withAdmin(async (request) => {
  const body = await request.json().catch(() => null);
  const { ar, en } = body ?? {};

  if (typeof ar !== "string" || !ar.trim() || typeof en !== "string" || !en.trim()) {
    return NextResponse.json({ error: "Missing category name (ar/en)" }, { status: 400 });
  }

  const existing = await categoryService.getAll();
  const base = slugify(en);
  let key = base;
  let suffix = 1;
  while (existing.some((c) => c.key === key)) {
    key = `${base}-${suffix++}`;
  }

  const saved = await categoryService.create({ id: key, key, ar: ar.trim(), en: en.trim() });
  return NextResponse.json(saved, { status: 201 });
});
