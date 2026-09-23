import { prisma } from "@/server/prisma";
import type { StorageService } from "./StorageService";
import type { Category } from "@/lib/types";

type CategoryWithId = Category & { id: string };

function toCategory(row: { key: string; ar: string; en: string }): CategoryWithId {
  return { id: row.key, key: row.key, ar: row.ar, en: row.en };
}

class PrismaCategoryService implements StorageService<CategoryWithId> {
  async getAll(): Promise<CategoryWithId[]> {
    const rows = await prisma.category.findMany({ orderBy: { key: "asc" } });
    const categories = rows.map(toCategory);
    // "all" sorts alphabetically wherever its letters happen to land (e.g.
    // after "accessories") — it should always be the first tab regardless.
    categories.sort((a, b) => (a.key === "all" ? -1 : b.key === "all" ? 1 : 0));
    return categories;
  }

  async getById(id: number | string): Promise<CategoryWithId | undefined> {
    const row = await prisma.category.findUnique({ where: { key: String(id) } });
    return row ? toCategory(row) : undefined;
  }

  async create(item: CategoryWithId): Promise<CategoryWithId> {
    const row = await prisma.category.create({
      data: { key: item.key, ar: item.ar, en: item.en },
    });
    return toCategory(row);
  }

  async update(
    id: number | string,
    patch: Partial<CategoryWithId>
  ): Promise<CategoryWithId | undefined> {
    try {
      const row = await prisma.category.update({
        where: { key: String(id) },
        data: { ar: patch.ar, en: patch.en },
      });
      return toCategory(row);
    } catch {
      return undefined;
    }
  }

  async remove(id: number | string): Promise<boolean> {
    try {
      await prisma.category.delete({ where: { key: String(id) } });
      return true;
    } catch {
      return false;
    }
  }
}

export const categoryService = new PrismaCategoryService();
