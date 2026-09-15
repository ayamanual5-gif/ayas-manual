import { Router } from "express";
import { upload } from "../middleware/upload";
import { customOrderService } from "../services/CustomOrderService";
import type { CustomOrder } from "../types";

const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  const { name, phone, category, description } = req.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    res.status(400).json({ error: "Missing or invalid custom order fields" });
    return;
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const customOrder: CustomOrder = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      category: typeof category === "string" ? category : "",
      description: description.trim(),
      imagePath,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const saved = await customOrderService.create(customOrder);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save custom order" });
  }
});

export default router;
