import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "admin_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const isProd = process.env.NODE_ENV === "production";

// Everything (pages + API) is served from the same Next.js app/origin now,
// so a plain same-site cookie is all that's needed — no CORS, no SameSite=None.
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

export interface AdminTokenPayload {
  email: string;
}

export function signAdminToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
}

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

type RouteContext = { params: Promise<Record<string, string>> };
type AdminHandler = (
  request: NextRequest,
  context: RouteContext,
  admin: AdminTokenPayload
) => Promise<Response>;

/** Wraps a Route Handler so it 401s automatically when there's no valid admin session. */
export function withAdmin(handler: AdminHandler) {
  return async (request: NextRequest, context: RouteContext) => {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, context, admin);
  };
}
