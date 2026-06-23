import { supabaseAdmin, STORAGE_BUCKETS } from "@/lib/supabase";

export type StorageBucket = keyof typeof STORAGE_BUCKETS;
export type UploadImageResult =
  | { ok: true; url: string; path: string; bucket: StorageBucket }
  | { ok: false; error: string; status: number; cause?: unknown };

type UploadImageInput = {
  bucket?: StorageBucket;
  file: Blob | Buffer | ArrayBuffer;
  path: string;
  contentType?: string;
  upsert?: boolean;
};

export async function uploadImage({
  bucket = "covers",
  file,
  path,
  contentType = "image/webp",
  upsert = true,
}: UploadImageInput): Promise<UploadImageResult> {
  if (!supabaseAdmin) {
    return { ok: false, error: "Supabase credentials missing", status: 500 };
  }

  const result = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, { contentType, upsert });
  const { error } = result;

  if (error) {
    const message = error.message.toLowerCase();
    const rawStatus = "statusCode" in error ? Number(error.statusCode) : Number.NaN;
    const status = Number.isFinite(rawStatus) ? rawStatus : 500;
    if (message.includes("bucket") && (message.includes("not found") || message.includes("does not exist"))) {
      return { ok: false, error: "Bucket missing", status: 500, cause: error };
    }
    if (status === 401 || status === 403 || message.includes("unauthorized") || message.includes("permission")) {
      return { ok: false, error: "Unauthorized", status: 403, cause: error };
    }
    return { ok: false, error: "Upload failed", status: 500, cause: error };
  }

  const url = getPublicUrl(bucket, path);
  if (!url) {
    return { ok: false, error: "Upload failed", status: 500 };
  }

  return { ok: true, url, path, bucket };
}

export async function deleteImage(bucket: StorageBucket, path: string): Promise<boolean> {
  if (!supabaseAdmin || !path) return false;
  const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKETS[bucket]).remove([path]);
  if (error) {
    console.error("Image delete failed:", error.message);
    return false;
  }
  return true;
}

export function getPublicUrl(bucket: StorageBucket, path: string): string | null {
  if (!supabaseAdmin || !path) return null;
  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(path);
  return data.publicUrl;
}

export async function compressImage(file: File, quality = 0.82, maxWidth = 1800): Promise<File> {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) return file;
  const name = file.name.replace(/\.[^.]+$/, ".webp");
  return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
}
