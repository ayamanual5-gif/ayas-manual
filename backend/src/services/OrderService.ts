import { JSONStorageService } from "./JSONStorageService";
import type { Order } from "../types";

export const orderService = new JSONStorageService<Order>("orders.json");
