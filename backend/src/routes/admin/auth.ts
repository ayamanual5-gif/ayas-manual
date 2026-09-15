import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ADMIN_COOKIE_NAME, JWT_SECRET } from "../../middleware/requireAdmin";

const router = Router();
const isProd = process.env.NODE_ENV === "production";

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    res.status(500).json({ error: "Admin account is not configured on the server" });
    return;
  }

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ email: adminEmail }, JWT_SECRET, { expiresIn: "7d" });

  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ email: adminEmail });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

export default router;
