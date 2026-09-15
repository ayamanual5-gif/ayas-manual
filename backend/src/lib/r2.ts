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

export async function uploadImageToR2(file: Express.Multer.File): Promise<string> {
  const extension = path.extname(file.originalname) || "";
  return uploadBufferToR2(file.buffer, extension, file.mimetype);
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
