import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, signSessionToken, verifyPassword } from "@/server/adminAuth";
import { userService } from "@/server/services/UserService";

// Shared login for both roles — the customer-facing /login page and the
// /admin/login page both call this. The caller decides where to redirect
// based on the returned `role`.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { email, password } = body ?? {};

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await userService.findByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = signSessionToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
