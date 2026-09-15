import { Router } from "express";
import { orderService } from "../services/OrderService";
import type { Order, OrderItem } from "../types";

const router = Router();

function isValidItem(item: unknown): item is OrderItem {
  if (typeof item !== "object" || item === null) return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.productId === "number" &&
    typeof i.name === "string" &&
    typeof i.price === "number" &&
    typeof i.qty === "number" &&
    i.qty > 0
  );
}

router.post("/", async (req, res) => {
  const {
    customerName,
    phone,
    address,
    city,
    paymentMethod,
    paymentReference,
    items,
    subtotal,
    notes,
  } = req.body ?? {};

  if (
    typeof customerName !== "string" ||
    !customerName.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof address !== "string" ||
    !address.trim() ||
    typeof paymentMethod !== "string" ||
    !paymentMethod.trim() ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !items.every(isValidItem)
  ) {
    res.status(400).json({ error: "Missing or invalid order fields" });
    return;
  }

  try {
    const order: Order = {
      id: Date.now(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: typeof city === "string" ? city.trim() : "",
      paymentMethod,
      paymentReference:
        typeof paymentReference === "string" ? paymentReference.trim() : undefined,
      items,
      subtotal: typeof subtotal === "number" ? subtotal : 0,
      notes: typeof notes === "string" ? notes.trim() : undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const saved = await orderService.create(order);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

export default router;
