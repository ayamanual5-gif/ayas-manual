import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { customOrderService } from "@/server/services/CustomOrderService";

export const GET = withAdmin(async () => {
  const items = await customOrderService.getAll();
  return NextResponse.json(items);
});
