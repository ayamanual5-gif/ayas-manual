import { JSONStorageService } from "./JSONStorageService";
import type { Product } from "../types";

export const productService = new JSONStorageService<Product>("products.json");
