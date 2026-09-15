import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { requireAdmin } from "./middleware/requireAdmin";

import categoriesRouter from "./routes/categories";
import customOrdersRouter from "./routes/customOrders";
import ordersRouter from "./routes/orders";
import productsRouter from "./routes/products";
import settingsRouter from "./routes/settings";

import adminAuthRouter from "./routes/admin/auth";
import adminCategoriesRouter from "./routes/admin/categories";
import adminCustomOrdersRouter from "./routes/admin/customOrders";
import adminMeRouter from "./routes/admin/me";
import adminOrdersRouter from "./routes/admin/orders";
import adminProductsRouter from "./routes/admin/products";
import adminSettingsRouter from "./routes/admin/settings";
import adminStatsRouter from "./routes/admin/stats";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ---- Public storefront routes ----
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/custom-orders", customOrdersRouter);
app.use("/api/settings", settingsRouter);

// ---- Admin routes ----
// Login/logout must stay public; everything else under /api/admin is gated below.
app.use("/api/admin", adminAuthRouter);
app.use("/api/admin", requireAdmin);
app.use("/api/admin/me", adminMeRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/admin/custom-orders", adminCustomOrdersRouter);
app.use("/api/admin/settings", adminSettingsRouter);
app.use("/api/admin/stats", adminStatsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Aya's Manual backend running on http://localhost:${PORT}`);
});
