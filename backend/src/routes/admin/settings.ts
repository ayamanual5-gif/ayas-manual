import { Router } from "express";
import { settingsService } from "../../services/SettingsService";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await settingsService.get());
});

router.put("/", async (req, res) => {
  const { instapayHandle, vodafoneCashNumber } = req.body ?? {};

  if (
    typeof instapayHandle !== "string" ||
    !instapayHandle.trim() ||
    typeof vodafoneCashNumber !== "string" ||
    !vodafoneCashNumber.trim()
  ) {
    res.status(400).json({ error: "Missing settings fields" });
    return;
  }

  const updated = await settingsService.update({
    instapayHandle: instapayHandle.trim(),
    vodafoneCashNumber: vodafoneCashNumber.trim(),
  });
  res.json(updated);
});

export default router;
