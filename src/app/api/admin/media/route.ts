import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteImage, type StorageBucket } from "@/lib/storage";

const buckets = new Set<StorageBucket>(["covers", "avatars", "resumes"]);

function parseStorageTag(tags: string[], prefix: "bucket" | "path") {
  return tags.find((tag) => tag.startsWith(`${prefix}:`))?.slice(prefix.length + 1) ?? null;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(60, Math.max(12, Number(request.nextUrl.searchParams.get("limit") ?? 24)));
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const bucket = request.nextUrl.searchParams.get("bucket")?.trim();

    const where = {
      ...(q
        ? {
            OR: [
              { filename: { contains: q, mode: "insensitive" as const } },
              { alt: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(bucket && buckets.has(bucket as StorageBucket) ? { type: bucket } : {}),
    };

    const [items, total] = await Promise.all([
      db.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.media.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Media id is required" }, { status: 400 });

    const media = await db.media.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

    const bucket = parseStorageTag(media.tags, "bucket");
    const path = parseStorageTag(media.tags, "path");
    if (bucket && path && buckets.has(bucket as StorageBucket)) {
      await deleteImage(bucket as StorageBucket, path);
    }

    await db.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
