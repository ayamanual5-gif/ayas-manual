import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { deleteImagesFromR2, uploadFileToR2 } from "@/server/r2";
import { productService } from "@/server/services/ProductService";
import type { Product, ProductTint } from "@/lib/types";

const VALID_TINTS: ProductTint[] = ["teal", "rose", "olive"];

function toBool(value: unknown): boolean {
  return value === true || value === "true" || value === "1" || value === "on";
}

export const PUT = withAdmin(async (request, context) => {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const existing = await productService.getById(id);

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const nameAr = formData.get("nameAr");
  const nameEn = formData.get("nameEn");
  const tagAr = formData.get("tagAr");
  const tagEn = formData.get("tagEn");
  const descAr = formData.get("descAr");
  const descEn = formData.get("descEn");
  const category = formData.get("category");
  const icon = formData.get("icon");
  const tint = formData.get("tint");
  const price = formData.get("price");
  const isNew = formData.get("isNew");
  const showInHero = formData.get("showInHero");
  const newImageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  // Which of the product's CURRENT images the admin chose to keep — anything
  // in `existing.images` but not in this list gets deleted from R2.
  const existingImagesToKeep = formData.getAll("existingImages").filter(
    (v): v is string => typeof v === "string"
  );

  const patch: Partial<Product> = {};

  if (typeof category === "string" && category.trim()) patch.category = category.trim();
  if (typeof icon === "string" && icon.trim()) patch.icon = icon.trim();
  if (VALID_TINTS.includes(tint as ProductTint)) patch.tint = tint as ProductTint;
  if (price !== null) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    patch.price = numericPrice;
  }
  if (isNew !== null) patch.isNew = toBool(isNew);
  if (showInHero !== null) patch.showInHero = toBool(showInHero);
  if (typeof nameAr === "string" || typeof nameEn === "string") {
    patch.name = {
      ar: typeof nameAr === "string" ? nameAr : existing.name.ar,
      en: typeof nameEn === "string" ? nameEn : existing.name.en,
    };
  }
  if (typeof tagAr === "string" || typeof tagEn === "string") {
    patch.tag = {
      ar: typeof tagAr === "string" ? tagAr : existing.tag.ar,
      en: typeof tagEn === "string" ? tagEn : existing.tag.en,
    };
  }
  if (typeof descAr === "string" || typeof descEn === "string") {
    patch.desc = {
      ar: typeof descAr === "string" ? descAr : existing.desc.ar,
      en: typeof descEn === "string" ? descEn : existing.desc.en,
    };
  }

  const removedImages = existing.images.filter((url) => !existingImagesToKeep.includes(url));
  const uploadedUrls = await Promise.all(newImageFiles.map((file) => uploadFileToR2(file)));
  patch.images = [...existingImagesToKeep, ...uploadedUrls];
  await deleteImagesFromR2(removedImages);

  const updated = await productService.update(id, patch);
  return NextResponse.json(updated);
});

export const DELETE = withAdmin(async (_request, context) => {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const existing = await productService.getById(id);

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await deleteImagesFromR2(existing.images);
  await productService.remove(id);
  return NextResponse.json({ ok: true });
});
