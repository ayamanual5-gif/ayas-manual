import fs from "fs/promises";
import path from "path";
import { uploadsDir } from "../middleware/upload";

/**
 * Best-effort delete of a previously uploaded file, given its public
 * `/uploads/<filename>` path. Silently ignores missing files — cleanup
 * failing should never block the API response.
 */
export async function deleteUploadedFile(publicPath: string | null | undefined): Promise<void> {
  if (!publicPath) return;
  const filePath = path.join(uploadsDir, path.basename(publicPath));
  try {
    await fs.unlink(filePath);
  } catch {
    // already missing or not deletable — nothing more we can do here
  }
}
