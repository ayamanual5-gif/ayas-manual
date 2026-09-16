import { NextResponse } from "next/server";

// TEMPORARY diagnostic route — deleted right after use. Reveals shape only,
// never the actual secret values.
export async function GET() {
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const email = process.env.ADMIN_EMAIL || "";

  return NextResponse.json({
    hashLength: hash.length,
    hashStart: hash.slice(0, 6),
    hashEnd: hash.slice(-6),
    hashHasBackslash: hash.includes("\\"),
    hashCharCodes: hash.slice(0, 6).split("").map((c) => c.charCodeAt(0)),
    emailValue: email,
    emailLength: email.length,
  });
}
