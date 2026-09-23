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
    contactEmail: str(body?.contactEmail),
    socialInstagram: str(body?.socialInstagram),
    socialTiktok: str(body?.socialTiktok),
  });
  return NextResponse.json(updated);
});
