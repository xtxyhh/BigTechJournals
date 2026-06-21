import type { Prisma } from "@prisma/client";
import { db } from "./db";

export type PlatformContentType = "resource" | "internship" | "roadmap";

export const platformContentTypes = ["resource", "internship", "roadmap"] as const;

export function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((tag) => tag.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  return [];
}

export function nullableString(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : null;
}

export function contentHref(type: PlatformContentType, slug: string) {
  return type === "resource" ? `/resources/${slug}` : type === "internship" ? `/internships/${slug}` : `/roadmaps/${slug}`;
}

export async function searchPlatformContent(query: string, limit = 5) {
  const trimmed = query.trim();
  if (!trimmed) return { resources: [], internships: [], roadmaps: [] };

  const resourceWhere: Prisma.ResourceWhereInput = {
    published: true,
    OR: [
      { title: { contains: trimmed, mode: "insensitive" } },
      { name: { contains: trimmed, mode: "insensitive" } },
      { type: { contains: trimmed, mode: "insensitive" } },
      { description: { contains: trimmed, mode: "insensitive" } },
      { tags: { has: trimmed } },
    ],
  };
  const internshipWhere: Prisma.InternshipWhereInput = {
    published: true,
    OR: [
      { title: { contains: trimmed, mode: "insensitive" } },
      { description: { contains: trimmed, mode: "insensitive" } },
      { location: { contains: trimmed, mode: "insensitive" } },
      { stipend: { contains: trimmed, mode: "insensitive" } },
      { tags: { has: trimmed } },
      { company: { name: { contains: trimmed, mode: "insensitive" } } },
    ],
  };
  const roadmapWhere: Prisma.RoadmapWhereInput = {
    published: true,
    OR: [
      { title: { contains: trimmed, mode: "insensitive" } },
      { description: { contains: trimmed, mode: "insensitive" } },
      { role: { contains: trimmed, mode: "insensitive" } },
      { tags: { has: trimmed } },
      { company: { name: { contains: trimmed, mode: "insensitive" } } },
    ],
  };

  const [resources, internships, roadmaps] = await Promise.all([
    db.resource.findMany({
      where: resourceWhere,
      select: { id: true, title: true, name: true, slug: true, type: true, url: true, description: true },
      take: limit,
    }),
    db.internship.findMany({
      where: internshipWhere,
      include: { company: { select: { name: true, slug: true, logo: true } } },
      take: limit,
    }),
    db.roadmap.findMany({
      where: roadmapWhere,
      include: { company: { select: { name: true, slug: true, logo: true } } },
      take: limit,
    }),
  ]);

  return { resources, internships, roadmaps };
}
