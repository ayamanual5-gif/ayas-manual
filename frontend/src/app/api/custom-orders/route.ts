import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { customOrderService } from "@/server/services/CustomOrderService";
import { uploadFileToR2 } from "@/server/r2";
import type { CustomOrder } from "@/lib/types";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const name = formData.get("name");
  const phone = formData.get("phone");
  const category = formData.get("category");
  const description = formData.get("description");
  const image = formData.get("image");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return NextResponse.json({ error: "Missing or invalid custom order fields" }, { status: 400 });
  }

  try {
    const imagePath = image instanceof File && image.size > 0 ? await uploadFileToR2(image) : null;

    const customOrder: CustomOrder = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      category: typeof category === "string" ? category : "",
      description: description.trim(),
      imagePath,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const saved = await customOrderService.create(customOrder);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save custom order" }, { status: 500 });
  }
}
