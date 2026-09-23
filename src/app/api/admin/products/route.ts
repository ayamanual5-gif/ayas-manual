import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { uploadFileToR2 } from "@/server/r2";
import { productService } from "@/server/services/ProductService";
import type { Product } from "@/lib/types";

function toBool(value: unknown): boolean {
  return value === true || value === "true" || value === "1" || value === "on";
}

/** Returns null for empty/"0", the parsed 1-100 integer otherwise, or `undefined` if invalid. */
function parseDiscountPercent(value: FormDataEntryValue | null): number | null | undefined {
  if (value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n)) return undefined;
  if (n <= 0) return null;
  if (n > 100) return undefined;
  return n;
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
  const price = formData.get("price");
  const discountPercentRaw = formData.get("discountPercent");
  const isNew = formData.get("isNew");
  const showInHero = formData.get("showInHero");
  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  const numericPrice = Number(price);
  const discountPercent = parseDiscountPercent(discountPercentRaw);

  if (
    typeof nameAr !== "string" ||
    !nameAr.trim() ||
    typeof nameEn !== "string" ||
    !nameEn.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof icon !== "string" ||
    !icon.trim() ||
    Number.isNaN(numericPrice) ||
    numericPrice <= 0 ||
    discountPercent === undefined
  ) {
    return NextResponse.json({ error: "Missing or invalid product fields" }, { status: 400 });
  }

  // A brand-new product has no existing images to interleave with, so the
  // files are already in the admin's chosen order (cover first) as sent.
  const images = await Promise.all(imageFiles.map((file) => uploadFileToR2(file)));

  const product: Product = {
    id: Date.now(),
    category: category.trim(),
    icon: icon.trim(),
    tint: "teal",
    price: numericPrice,
    discountPercent,
    isNew: toBool(isNew),
    showInHero: toBool(showInHero),
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
