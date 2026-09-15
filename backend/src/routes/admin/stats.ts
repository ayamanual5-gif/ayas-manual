import { Router } from "express";
import { customOrderService } from "../../services/CustomOrderService";
import { orderService } from "../../services/OrderService";
import { productService } from "../../services/ProductService";

const router = Router();

router.get("/", async (_req, res) => {
  const [orders, customOrders, products] = await Promise.all([
    orderService.getAll(),
    customOrderService.getAll(),
    productService.getAll(),
  ]);

  res.json({
    newOrdersCount: orders.filter((o) => o.status === "pending").length,
    newCustomOrdersCount: customOrders.filter((c) => c.status === "pending").length,
    productsCount: products.length,
  });
});

export default router;
