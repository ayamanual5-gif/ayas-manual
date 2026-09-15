import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { customOrderService } from "@/server/services/CustomOrderService";
import type { CustomOrder, OrderStatus } from "@/lib/types";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped"];

export const PATCH = withAdmin(async (request, context) => {
  const { id: idParam } = await context.params;
  const id = Number(idParam);
  const body = await request.json().catch(() => null);
  const { status, internalNote } = body ?? {};

  const patch: Partial<CustomOrder> = {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = status as OrderStatus;
  }

  if (internalNote !== undefined) {
    if (typeof internalNote !== "string") {
      return NextResponse.json({ error: "Invalid internal note" }, { status: 400 });
    }
    patch.internalNote = internalNote;
  }

  const updated = await customOrderService.update(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Custom order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
});
