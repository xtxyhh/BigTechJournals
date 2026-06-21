import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const role = request.nextUrl.searchParams.get("role")?.trim();
  const company = request.nextUrl.searchParams.get("company")?.trim();

  const roadmaps = await db.roadmap.findMany({
    where: {
      published: true,
      ...(role ? { role: { contains: role, mode: "insensitive" } } : {}),
      ...(company ? { company: { slug: company } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { role: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
              { company: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 80,
  });

  return NextResponse.json(roadmaps);
}
