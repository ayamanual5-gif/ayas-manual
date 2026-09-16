import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { uploadFileToR2 } from "@/server/r2";
import { productService } from "@/server/services/ProductService";
import type { Product, ProductTint } from "@/lib/types";

const VALID_TINTS: ProductTint[] = ["teal", "rose", "olive"];

function toBool(value: unknown): boolean {
  return value === true || value === "true" || value === "1" || value === "on";
}

export const GET = withAdmin(async () => {
  const products = await productService.getAll();
  return NextResponse.json(products);
});

export const POST = withAdmin(async (request) => {
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
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  const numericPrice = Number(price);

  if (
    typeof nameAr !== "string" ||
    !nameAr.trim() ||
    typeof nameEn !== "string" ||
    !nameEn.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof icon !== "string" ||
    !icon.trim() ||
    !VALID_TINTS.includes(tint as ProductTint) ||
    Number.isNaN(numericPrice) ||
    numericPrice <= 0
  ) {
    return NextResponse.json({ error: "Missing or invalid product fields" }, { status: 400 });
  }

  const images = await Promise.all(imageFiles.map((file) => uploadFileToR2(file)));

  const product: Product = {
    id: Date.now(),
    category: category.trim(),
    icon: icon.trim(),
    tint: tint as ProductTint,
    price: numericPrice,
    isNew: toBool(isNew),
    name: { ar: nameAr.trim(), en: nameEn.trim() },
    tag: {
      ar: typeof tagAr === "string" ? tagAr.trim() : "",
      en: typeof tagEn === "string" ? tagEn.trim() : "",
    },
    desc: {
      ar: typeof descAr === "string" ? descAr.trim() : "",
      en: typeof descEn === "string" ? descEn.trim() : "",
    },
    images,
  };

  const saved = await productService.create(product);
  return NextResponse.json(saved, { status: 201 });
});
