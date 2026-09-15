import { Router } from "express";
import { customOrderService } from "../../services/CustomOrderService";
import type { CustomOrder, OrderStatus } from "../../types";

const router = Router();

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped"];

router.get("/", async (_req, res) => {
  const items = await customOrderService.getAll();
  const sorted = items
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status, internalNote } = req.body ?? {};

  const patch: Partial<CustomOrder> = {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    patch.status = status as OrderStatus;
  }

  if (internalNote !== undefined) {
    if (typeof internalNote !== "string") {
      res.status(400).json({ error: "Invalid internal note" });
      return;
    }
    patch.internalNote = internalNote;
  }

  const updated = await customOrderService.update(id, patch);
  if (!updated) {
    res.status(404).json({ error: "Custom order not found" });
    return;
  }
  res.json(updated);
});

export default router;
