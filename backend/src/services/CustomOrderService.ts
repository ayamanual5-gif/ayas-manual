import { JSONStorageService } from "./JSONStorageService";
import type { CustomOrder } from "../types";

export const customOrderService = new JSONStorageService<CustomOrder>(
  "custom-orders.json"
);
