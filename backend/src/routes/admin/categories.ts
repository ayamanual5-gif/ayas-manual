import { Router } from "express";
import { categoryService } from "../../services/CategoryService";
import { productService } from "../../services/ProductService";
import { slugify } from "../../utils/slugify";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await categoryService.getAll());
});

router.post("/", async (req, res) => {
  const { ar, en } = req.body ?? {};

  if (typeof ar !== "string" || !ar.trim() || typeof en !== "string" || !en.trim()) {
    res.status(400).json({ error: "Missing category name (ar/en)" });
    return;
  }

  const existing = await categoryService.getAll();
  const base = slugify(en);
  let key = base;
  let suffix = 1;
  while (existing.some((c) => c.key === key)) {
    key = `${base}-${suffix++}`;
  }

  const category = { id: key, key, ar: ar.trim(), en: en.trim() };
  const saved = await categoryService.create(category);
  res.status(201).json(saved);
});

router.put("/:key", async (req, res) => {
  const { key } = req.params;

  if (key === "all") {
    res.status(400).json({ error: 'لا يمكن تعديل تصنيف "الكل"' });
    return;
  }

  const { ar, en } = req.body ?? {};
  const patch: { ar?: string; en?: string } = {};
  if (typeof ar === "string" && ar.trim()) patch.ar = ar.trim();
  if (typeof en === "string" && en.trim()) patch.en = en.trim();

  const updated = await categoryService.update(key, patch);
  if (!updated) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json(updated);
});

router.delete("/:key", async (req, res) => {
  const { key } = req.params;

  if (key === "all") {
    res.status(400).json({ error: 'لا يمكن حذف تصنيف "الكل"' });
    return;
  }

  const products = await productService.getAll();
  if (products.some((p) => p.category === key)) {
    res.status(400).json({ error: "لا يمكن حذف تصنيف مرتبط بمنتجات موجودة" });
    return;
  }

  const removed = await categoryService.remove(key);
  if (!removed) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json({ ok: true });
});

export default router;
