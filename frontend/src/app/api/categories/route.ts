import { NextResponse } from "next/server";
import { categoryService } from "@/server/services/CategoryService";

export async function GET() {
  const categories = await categoryService.getAll();
  return NextResponse.json(categories);
}
