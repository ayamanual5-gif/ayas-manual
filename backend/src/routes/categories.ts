import { Router } from "express";
import { categoryService } from "../services/CategoryService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

export default router;
