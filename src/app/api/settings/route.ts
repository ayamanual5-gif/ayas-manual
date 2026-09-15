import { NextResponse } from "next/server";
import { settingsService } from "@/server/services/SettingsService";

// Public, read-only — the storefront checkout page needs the live
// InstaPay/Vodafone Cash details without requiring admin auth.
export async function GET() {
  const settings = await settingsService.get();
  return NextResponse.json(settings);
}
