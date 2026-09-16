import crypto from "crypto";
import path from "path";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.R2_BUCKET_NAME!;

function publicBaseUrl(): string {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) {
    throw new Error("R2_PUBLIC_URL is not set — enable public access on the R2 bucket and set it in .env");
  }
  return base.replace(/\/$/, "");
}

export async function uploadBufferToR2(
  buffer: Buffer,
  extension: string,
  contentType: string
): Promise<string> {
  const key = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${publicBaseUrl()}/${key}`;
}

/** Uploads a browser-submitted `File` (from a Route Handler's `request.formData()`). */
export async function uploadFileToR2(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || "";
  return uploadBufferToR2(buffer, extension, file.type || "application/octet-stream");
}

/** Best-effort delete — used when replacing or removing an image. Never throws. */
export async function deleteImageFromR2(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const key = url.split("/").pop();
  if (!key) return;
  try {
    await client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
  } catch {
    // ignore — cleanup failing should never block the API response
  }
}

/** Best-effort delete of several images in parallel (e.g. all photos of a removed product). */
export async function deleteImagesFromR2(urls: (string | null | undefined)[]): Promise<void> {
  await Promise.all(urls.map((url) => deleteImageFromR2(url)));
}
