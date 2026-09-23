import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Unified session for BOTH admin and customer accounts, backed by the User
 * table. `withAdmin` additionally checks role === "ADMIN" — any signed-in
 * customer has a perfectly valid session cookie too, so route protection
 * must check the role, not just "is there a session".
 */
export const SESSION_COOKIE_NAME = "session_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const isProd = process.env.NODE_ENV === "production";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

export type Role = "ADMIN" | "CUSTOMER";

export interface SessionPayload {
  userId: number;
  email: string;
  role: Role;
  name: string | null;
}

// Kept as an alias so the one existing consumer (api/admin/me) doesn't need
// a separate type name.
export type AdminTokenPayload = SessionPayload;

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// Back-compat alias used by a couple of routes before this file was unified.
export const getAdminSession = getSession;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

type RouteContext = { params: Promise<Record<string, string>> };
type AdminHandler = (
  request: NextRequest,
  context: RouteContext,
  session: SessionPayload
) => Promise<Response>;

/** Wraps a Route Handler so it 401s automatically unless the session belongs to an ADMIN. */
export function withAdmin(handler: AdminHandler) {
  return async (request: NextRequest, context: RouteContext) => {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context, session);
  };
}
