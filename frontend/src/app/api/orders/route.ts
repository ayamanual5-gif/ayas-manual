import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { orderService } from "@/server/services/OrderService";
import type { Order, OrderItem } from "@/lib/types";

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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
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
  } = body ?? {};

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
    return NextResponse.json({ error: "Missing or invalid order fields" }, { status: 400 });
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
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
