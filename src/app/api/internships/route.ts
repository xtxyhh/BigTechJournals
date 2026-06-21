import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const company = request.nextUrl.searchParams.get("company")?.trim();
  const location = request.nextUrl.searchParams.get("location")?.trim();
  const remote = request.nextUrl.searchParams.get("remote");

  const internships = await db.internship.findMany({
    where: {
      published: true,
      ...(remote === "true" ? { remote: true } : {}),
      ...(company ? { company: { slug: company } } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { stipend: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
              { company: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
    take: 80,
  });

  return NextResponse.json(internships);
}
