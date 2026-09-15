import { Router } from "express";
import { upload } from "../../middleware/upload";
import { productService } from "../../services/ProductService";
import { deleteUploadedFile } from "../../utils/fileCleanup";
import type { Product, ProductTint } from "../../types";

const router = Router();

const VALID_TINTS: ProductTint[] = ["teal", "rose", "olive"];

function toBool(value: unknown): boolean {
  return value === true || value === "true" || value === "1" || value === "on";
}

router.get("/", async (_req, res) => {
  const products = await productService.getAll();
  res.json(products);
});

router.post("/", upload.single("image"), async (req, res) => {
  const { nameAr, nameEn, tagAr, tagEn, descAr, descEn, category, icon, tint, price, isNew } =
    req.body ?? {};

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
    res.status(400).json({ error: "Missing or invalid product fields" });
    return;
  }

  const product: Product = {
    id: Date.now(),
    category: category.trim(),
    icon: icon.trim(),
    tint: tint as ProductTint,
    price: numericPrice,
    isNew: toBool(isNew),
    name: { ar: nameAr.trim(), en: nameEn.trim() },
    tag: { ar: typeof tagAr === "string" ? tagAr.trim() : "", en: typeof tagEn === "string" ? tagEn.trim() : "" },
    desc: { ar: typeof descAr === "string" ? descAr.trim() : "", en: typeof descEn === "string" ? descEn.trim() : "" },
    image: req.file ? `/uploads/${req.file.filename}` : null,
  };

  const saved = await productService.create(product);
  res.status(201).json(saved);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await productService.getById(id);

  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const { nameAr, nameEn, tagAr, tagEn, descAr, descEn, category, icon, tint, price, isNew } =
    req.body ?? {};

  const patch: Partial<Product> = {};

  if (typeof category === "string" && category.trim()) patch.category = category.trim();
  if (typeof icon === "string" && icon.trim()) patch.icon = icon.trim();
  if (VALID_TINTS.includes(tint as ProductTint)) patch.tint = tint as ProductTint;
  if (price !== undefined) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ error: "Invalid price" });
      return;
    }
    patch.price = numericPrice;
  }
  if (isNew !== undefined) patch.isNew = toBool(isNew);
  if (nameAr !== undefined || nameEn !== undefined) {
    patch.name = { ar: nameAr ?? existing.name.ar, en: nameEn ?? existing.name.en };
  }
  if (tagAr !== undefined || tagEn !== undefined) {
    patch.tag = { ar: tagAr ?? existing.tag.ar, en: tagEn ?? existing.tag.en };
  }
  if (descAr !== undefined || descEn !== undefined) {
    patch.desc = { ar: descAr ?? existing.desc.ar, en: descEn ?? existing.desc.en };
  }

  if (req.file) {
    patch.image = `/uploads/${req.file.filename}`;
    await deleteUploadedFile(existing.image);
  }

  const updated = await productService.update(id, patch);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = await productService.getById(id);

  if (!existing) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await deleteUploadedFile(existing.image);
  await productService.remove(id);
  res.json({ ok: true });
});

export default router;
