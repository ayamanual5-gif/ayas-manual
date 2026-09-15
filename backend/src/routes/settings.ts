import { Router } from "express";
import { settingsService } from "../services/SettingsService";

const router = Router();

// Public, read-only — the storefront checkout page needs the live
// InstaPay/Vodafone Cash details without requiring admin auth.
router.get("/", async (_req, res) => {
  res.json(await settingsService.get());
});

export default router;
