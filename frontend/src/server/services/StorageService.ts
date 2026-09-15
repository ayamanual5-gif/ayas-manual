export interface StorageService<T extends { id: number | string }> {
  getAll(): Promise<T[]>;
  getById(id: number | string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: number | string, patch: Partial<T>): Promise<T | undefined>;
  remove(id: number | string): Promise<boolean>;
}
