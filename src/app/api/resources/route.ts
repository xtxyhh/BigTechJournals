import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const type = request.nextUrl.searchParams.get("type")?.trim();
  const difficulty = request.nextUrl.searchParams.get("difficulty")?.trim();

  const resources = await db.resource.findMany({
    where: {
      published: true,
      ...(type ? { type: { equals: type, mode: "insensitive" } } : {}),
      ...(difficulty ? { difficulty: { equals: difficulty, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
            ],
          }
        : {}),
    },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 80,
  });

  return NextResponse.json(resources);
}
