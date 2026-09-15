import { Router } from "express";
import { productService } from "../services/ProductService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

export default router;
