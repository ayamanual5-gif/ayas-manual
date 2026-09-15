import { JSONStorageService } from "./JSONStorageService";
import type { Category } from "../types";

export const categoryService = new JSONStorageService<Category & { id: string }>(
  "categories.json"
);
