/**
 * Abstraction every data service depends on. Today `JSONStorageService` is the
 * only implementation (reads/writes a local JSON file). Swapping to a real
 * database later means writing a new class that implements this interface
 * (e.g. `PrismaStorageService`) — routes and controllers never change.
 */
export interface StorageService<T extends { id: number | string }> {
  getAll(): Promise<T[]>;
  getById(id: number | string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: number | string, patch: Partial<T>): Promise<T | undefined>;
  remove(id: number | string): Promise<boolean>;
}
