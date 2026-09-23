import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { settingsService } from "@/server/services/SettingsService";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export const GET = withAdmin(async () => {
  const settings = await settingsService.get();
  return NextResponse.json(settings);
});

export const PUT = withAdmin(async (request) => {
  const body = await request.json().catch(() => null);
  const { instapayHandle, vodafoneCashNumber } = body ?? {};

  if (
    typeof instapayHandle !== "string" ||
    !instapayHandle.trim() ||
    typeof vodafoneCashNumber !== "string" ||
    !vodafoneCashNumber.trim()
  ) {
    return NextResponse.json({ error: "Missing settings fields" }, { status: 400 });
  }

  const updated = await settingsService.update({
    instapayHandle: instapayHandle.trim(),
    vodafoneCashNumber: vodafoneCashNumber.trim(),
    whatsappNumber: str(body?.whatsappNumber),
    contactPhone: str(body?.contactPhone),
    contactEmail: str(body?.contactEmail),
    contactAddress: str(body?.contactAddress),
    socialInstagram: str(body?.socialInstagram),
    socialPinterest: str(body?.socialPinterest),
  });
  return NextResponse.json(updated);
});
