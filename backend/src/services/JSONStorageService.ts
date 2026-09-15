import fs from "fs/promises";
import path from "path";
import type { StorageService } from "./StorageService";

/**
 * Generic JSON-file backed implementation of StorageService<T>.
 * Each instance owns one file under backend/data/*.json and treats it as
 * a flat array of records. Reads parse the whole file; writes serialize
 * the whole array back — perfectly fine for a local prototype's data volume.
 */
export class JSONStorageService<T extends { id: number | string }>
  implements StorageService<T>
{
  private readonly filePath: string;

  constructor(fileName: string) {
    this.filePath = path.join(__dirname, "..", "..", "data", fileName);
  }

  private async ensureFile(): Promise<void> {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, "[]", "utf-8");
    }
  }

  async getAll(): Promise<T[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, "utf-8");
    return raw.trim() ? (JSON.parse(raw) as T[]) : [];
  }

  async getById(id: number | string): Promise<T | undefined> {
    const all = await this.getAll();
    return all.find((item) => item.id === id);
  }

  async create(item: T): Promise<T> {
    const all = await this.getAll();
    all.push(item);
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), "utf-8");
    return item;
  }

  async update(id: number | string, patch: Partial<T>): Promise<T | undefined> {
    const all = await this.getAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    all[index] = { ...all[index], ...patch };
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), "utf-8");
    return all[index];
  }

  async remove(id: number | string): Promise<boolean> {
    const all = await this.getAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return false;
    all.splice(index, 1);
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), "utf-8");
    return true;
  }
}
