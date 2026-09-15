import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ email: req.admin?.email });
});

export default router;
