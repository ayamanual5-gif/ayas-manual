import { NextResponse } from "next/server";
import { productService } from "@/server/services/ProductService";

export async function GET() {
  const products = await productService.getAll();
  return NextResponse.json(products);
}
