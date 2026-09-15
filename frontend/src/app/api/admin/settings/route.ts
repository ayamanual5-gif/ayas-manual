import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { settingsService } from "@/server/services/SettingsService";

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
  });
  return NextResponse.json(updated);
});
