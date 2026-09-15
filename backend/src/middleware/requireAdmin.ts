import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AdminTokenPayload } from "../types";

export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
export const ADMIN_COOKIE_NAME = "admin_token";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
