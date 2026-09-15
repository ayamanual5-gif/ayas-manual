import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { StorageService } from "./StorageService";
import type { LocalizedText, Product, ProductTint } from "../types";

function toProduct(row: {
  id: number;
  category: string;
  icon: string;
  tint: string;
  price: number;
  isNew: boolean;
  name: unknown;
  tag: unknown;
  desc: unknown;
  image: string | null;
}): Product {
  return {
    id: row.id,
    category: row.category,
    icon: row.icon,
    tint: row.tint as ProductTint,
    price: row.price,
    isNew: row.isNew,
    name: row.name as LocalizedText,
    tag: row.tag as LocalizedText,
    desc: row.desc as LocalizedText,
    image: row.image,
  };
}

class PrismaProductService implements StorageService<Product> {
  async getAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany({ orderBy: { id: "asc" } });
    return rows.map(toProduct);
  }

  async getById(id: number | string): Promise<Product | undefined> {
    const row = await prisma.product.findUnique({ where: { id: Number(id) } });
    return row ? toProduct(row) : undefined;
  }

  async create(item: Product): Promise<Product> {
    // `item.id` is a caller-side placeholder (e.g. Date.now()) — Postgres
    // assigns the real autoincrement id, so we drop it here.
    const { id: _ignored, ...data } = item;
    const row = await prisma.product.create({
      data: data as unknown as Prisma.ProductCreateInput,
    });
    return toProduct(row);
  }

  async update(id: number | string, patch: Partial<Product>): Promise<Product | undefined> {
    const { id: _ignored, ...data } = patch;
    try {
      const row = await prisma.product.update({
        where: { id: Number(id) },
        data: data as unknown as Prisma.ProductUpdateInput,
      });
      return toProduct(row);
    } catch {
      return undefined;
    }
  }

  async remove(id: number | string): Promise<boolean> {
    try {
      await prisma.product.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const productService = new PrismaProductService();
