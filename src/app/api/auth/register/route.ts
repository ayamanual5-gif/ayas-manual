import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, hashPassword, signSessionToken } from "@/server/adminAuth";
import { userService } from "@/server/services/UserService";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { name, email, password } = body ?? {};

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return NextResponse.json(
      { error: "من فضلك أدخلي بريد إلكتروني صحيح وكلمة مرور 6 أحرف على الأقل" },
      { status: 400 }
    );
  }

  const existing = await userService.findByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "في حساب مسجل بالفعل بهذا البريد الإلكتروني" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  // Registration always creates a customer account — admin accounts are
  // provisioned separately, never through self-serve signup.
  const user = await userService.create({
    email,
    passwordHash,
    name: typeof name === "string" && name.trim() ? name.trim() : null,
    role: "CUSTOMER",
  });

  const token = signSessionToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 });
}
