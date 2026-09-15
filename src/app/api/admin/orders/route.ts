import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { orderService } from "@/server/services/OrderService";

export const GET = withAdmin(async () => {
  const orders = await orderService.getAll();
  return NextResponse.json(orders);
});
