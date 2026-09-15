import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { StorageService } from "./StorageService";
import type { Order, OrderItem, OrderStatus } from "../types";

function toOrder(row: {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  paymentReference: string | null;
  items: unknown;
  subtotal: number;
  notes: string | null;
  status: string;
  createdAt: Date;
}): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    phone: row.phone,
    address: row.address,
    city: row.city,
    paymentMethod: row.paymentMethod,
    paymentReference: row.paymentReference ?? undefined,
    items: row.items as OrderItem[],
    subtotal: row.subtotal,
    notes: row.notes ?? undefined,
    status: row.status as OrderStatus,
    createdAt: row.createdAt.toISOString(),
  };
}

class PrismaOrderService implements StorageService<Order> {
  async getAll(): Promise<Order[]> {
    const rows = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toOrder);
  }

  async getById(id: number | string): Promise<Order | undefined> {
    const row = await prisma.order.findUnique({ where: { id: Number(id) } });
    return row ? toOrder(row) : undefined;
  }

  async create(item: Order): Promise<Order> {
    const row = await prisma.order.create({
      data: {
        customerName: item.customerName,
        phone: item.phone,
        address: item.address,
        city: item.city,
        paymentMethod: item.paymentMethod,
        paymentReference: item.paymentReference,
        items: item.items as unknown as Prisma.InputJsonValue,
        subtotal: item.subtotal,
        notes: item.notes,
        status: item.status,
        createdAt: new Date(item.createdAt),
      },
    });
    return toOrder(row);
  }

  async update(id: number | string, patch: Partial<Order>): Promise<Order | undefined> {
    try {
      const row = await prisma.order.update({
        where: { id: Number(id) },
        data: { status: patch.status as OrderStatus | undefined },
      });
      return toOrder(row);
    } catch {
      return undefined;
    }
  }

  async remove(id: number | string): Promise<boolean> {
    try {
      await prisma.order.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const orderService = new PrismaOrderService();
