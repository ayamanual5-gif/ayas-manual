import { Router } from "express";
import { orderService } from "../../services/OrderService";
import type { OrderStatus } from "../../types";

const router = Router();

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped"];

router.get("/", async (_req, res) => {
  const orders = await orderService.getAll();
  const sorted = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body ?? {};

  if (!VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const updated = await orderService.update(id, { status: status as OrderStatus });
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(updated);
});

export default router;
