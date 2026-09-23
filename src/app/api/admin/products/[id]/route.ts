import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { deleteImagesFromR2, uploadFileToR2 } from "@/server/r2";
import { productService } from "@/server/services/ProductService";
import type { Product } from "@/lib/types";

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
  const price = formData.get("price");
  const isNew = formData.get("isNew");
  const showInHero = formData.get("showInHero");
  const newImageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  // Final image order (existing URLs interleaved with "__new__" placeholders
  // for each newly-uploaded file, in the admin's chosen order — the first
  // slot is the cover). Anything from existing.images that isn't among the
  // URL entries here was removed by the admin and gets deleted from R2.
  const imageOrderRaw = formData.get("imageOrder");
  let imageOrder: string[] | null = null;
  try {
    const parsed = typeof imageOrderRaw === "string" ? JSON.parse(imageOrderRaw) : null;
    if (Array.isArray(parsed)) imageOrder = parsed.filter((v): v is string => typeof v === "string");
  } catch {
    imageOrder = null;
  }

  const patch: Partial<Product> = {};

  if (typeof category === "string" && category.trim()) patch.category = category.trim();
  if (typeof icon === "string" && icon.trim()) patch.icon = icon.trim();
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

  const uploadedUrls = await Promise.all(newImageFiles.map((file) => uploadFileToR2(file)));

  let finalImages: string[];
  let existingImagesToKeep: string[];
  if (imageOrder) {
    let newIdx = 0;
    finalImages = imageOrder.map((token) => (token === "__new__" ? uploadedUrls[newIdx++] : token));
    existingImagesToKeep = imageOrder.filter((token) => token !== "__new__");
  } else {
    // Fallback for any caller not sending imageOrder: keep all existing, append new.
    existingImagesToKeep = existing.images;
    finalImages = [...existingImagesToKeep, ...uploadedUrls];
  }

  const removedImages = existing.images.filter((url) => !existingImagesToKeep.includes(url));
  patch.images = finalImages;
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
