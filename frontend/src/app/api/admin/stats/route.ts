import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { customOrderService } from "@/server/services/CustomOrderService";
import { orderService } from "@/server/services/OrderService";
import { productService } from "@/server/services/ProductService";

export const GET = withAdmin(async () => {
  const [orders, customOrders, products] = await Promise.all([
    orderService.getAll(),
    customOrderService.getAll(),
    productService.getAll(),
  ]);

  return NextResponse.json({
    newOrdersCount: orders.filter((o) => o.status === "pending").length,
    newCustomOrdersCount: customOrders.filter((c) => c.status === "pending").length,
    productsCount: products.length,
  });
});
