import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { orderService } from "@/server/services/OrderService";
import { uploadFileToR2 } from "@/server/r2";
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
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const customerName = formData.get("customerName");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const city = formData.get("city");
  const paymentMethod = formData.get("paymentMethod");
  const paymentReference = formData.get("paymentReference");
  const notes = formData.get("notes");
  const subtotal = formData.get("subtotal");
  const itemsRaw = formData.get("items");
  const proofFile = formData.get("paymentProof");

  let items: unknown;
  try {
    items = typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : null;
  } catch {
    items = null;
  }

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
    const paymentProofUrl =
      proofFile instanceof File && proofFile.size > 0 ? await uploadFileToR2(proofFile) : undefined;

    const order: Order = {
      id: Date.now(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: typeof city === "string" ? city.trim() : "",
      paymentMethod,
      paymentReference:
        typeof paymentReference === "string" ? paymentReference.trim() : undefined,
      paymentProofUrl,
      items,
      subtotal: typeof subtotal === "string" ? Number(subtotal) || 0 : 0,
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
