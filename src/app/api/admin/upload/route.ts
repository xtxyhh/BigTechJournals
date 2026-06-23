import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasSupabaseCredentials } from "@/lib/supabase";
import { uploadImage, type StorageBucket } from "@/lib/storage";

const ALLOWED_BUCKETS = new Set<StorageBucket>(["covers", "avatars", "resumes"]);
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
}

function isStorageBucket(value: string): value is StorageBucket {
  return ALLOWED_BUCKETS.has(value as StorageBucket);
}

function extensionFor(file: File) {
  const byType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  } as Record<string, string>;
  return byType[file.type] ?? safeName(file.name).split(".").pop() ?? "webp";
}

export async function POST(request: Request) {
  let user: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    user = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseCredentials()) {
    return NextResponse.json({ error: "Supabase credentials missing" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucketValue = formData.get("bucket");
    const folderValue = formData.get("folder");
    const requestedBucket = typeof bucketValue === "string" ? bucketValue : "covers";
    const folder = typeof folderValue === "string" ? safeName(folderValue) : "uploads";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }
    if (!isStorageBucket(requestedBucket)) {
      return NextResponse.json({ error: "Bucket missing" }, { status: 400 });
    }
    if (!file.type.startsWith("image/") || !ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const bucket = requestedBucket;
    const path = `${folder}/${user.id}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(file)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage({ bucket, path, file: buffer, contentType: file.type });

    if (process.env.NODE_ENV === "development") {
      console.log("Upload bucket:", bucket);
      console.log("Upload path:", path);
      console.log("Upload result:", result);
    }

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const media = await db.media.create({
      data: {
        filename: safeName(file.name),
        url: result.url,
        type: bucket,
        size: file.size,
        mimeType: file.type,
        folder,
        tags: [`bucket:${bucket}`, `path:${path}`],
        uploadedBy: user.id,
      },
    });

    return NextResponse.json({ url: result.url, path: result.path, bucket: result.bucket, mediaId: media.id });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Upload failed:", error);
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
