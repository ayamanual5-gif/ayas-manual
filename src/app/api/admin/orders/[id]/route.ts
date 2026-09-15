import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { orderService } from "@/server/services/OrderService";
import type { OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped"];

export const PATCH = withAdmin(async (request, context) => {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const body = await request.json().catch(() => null);
  const { status } = body ?? {};

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await orderService.update(id, { status: status as OrderStatus });
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
});
