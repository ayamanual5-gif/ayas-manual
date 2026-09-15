import { prisma } from "@/server/prisma";
import type { StorageService } from "./StorageService";
import type { CustomOrder, OrderStatus } from "@/lib/types";

function toCustomOrder(row: {
  id: number;
  name: string;
  phone: string;
  category: string;
  description: string;
  imagePath: string | null;
  status: string;
  internalNote: string | null;
  createdAt: Date;
}): CustomOrder {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    category: row.category,
    description: row.description,
    imagePath: row.imagePath,
    status: row.status as OrderStatus,
    internalNote: row.internalNote ?? "",
    createdAt: row.createdAt.toISOString(),
  };
}

class PrismaCustomOrderService implements StorageService<CustomOrder> {
  async getAll(): Promise<CustomOrder[]> {
    const rows = await prisma.customOrder.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toCustomOrder);
  }

  async getById(id: number | string): Promise<CustomOrder | undefined> {
    const row = await prisma.customOrder.findUnique({ where: { id: Number(id) } });
    return row ? toCustomOrder(row) : undefined;
  }

  async create(item: CustomOrder): Promise<CustomOrder> {
    const row = await prisma.customOrder.create({
      data: {
        name: item.name,
        phone: item.phone,
        category: item.category,
        description: item.description,
        imagePath: item.imagePath,
        status: item.status,
        internalNote: item.internalNote ?? "",
        createdAt: new Date(item.createdAt),
      },
    });
    return toCustomOrder(row);
  }

  async update(id: number | string, patch: Partial<CustomOrder>): Promise<CustomOrder | undefined> {
    try {
      const row = await prisma.customOrder.update({
        where: { id: Number(id) },
        data: {
          status: patch.status as OrderStatus | undefined,
          internalNote: patch.internalNote,
        },
      });
      return toCustomOrder(row);
    } catch {
      return undefined;
    }
  }

  async remove(id: number | string): Promise<boolean> {
    try {
      await prisma.customOrder.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const customOrderService = new PrismaCustomOrderService();
