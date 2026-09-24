import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";
import { deleteImageFromR2, uploadFileToR2 } from "@/server/r2";
import { settingsService } from "@/server/services/SettingsService";

export const POST = withAdmin(async (request) => {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  const current = await settingsService.get();
  const url = await uploadFileToR2(file);
  const updated = await settingsService.update({ aboutImageUrl: url });
  if (current.aboutImageUrl) await deleteImageFromR2(current.aboutImageUrl);

  return NextResponse.json(updated);
});

export const DELETE = withAdmin(async () => {
  const current = await settingsService.get();
  const updated = await settingsService.update({ aboutImageUrl: "" });
  if (current.aboutImageUrl) await deleteImageFromR2(current.aboutImageUrl);
  return NextResponse.json(updated);
});
