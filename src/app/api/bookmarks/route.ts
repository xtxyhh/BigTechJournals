import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const bookmarkTargets = ["storyId", "resourceId", "internshipId", "roadmapId", "careerSwitchId", "interviewExperienceId", "companyId"] as const;

function getTarget(data: Record<string, unknown>) {
  const entries = bookmarkTargets.flatMap((key) => {
    const value = data[key];
    return typeof value === "string" && value.length > 0 ? [[key, value] as const] : [];
  });
  return entries.length === 1 ? entries[0] : null;
}

async function targetExists(key: (typeof bookmarkTargets)[number], id: string) {
  if (key === "storyId") return !!(await db.story.findUnique({ where: { id }, select: { id: true } }));
  if (key === "resourceId") return !!(await db.resource.findUnique({ where: { id }, select: { id: true } }));
  if (key === "internshipId") return !!(await db.internship.findUnique({ where: { id }, select: { id: true } }));
  if (key === "roadmapId") return !!(await db.roadmap.findUnique({ where: { id }, select: { id: true } }));
  if (key === "careerSwitchId") return !!(await db.careerSwitch.findUnique({ where: { id }, select: { id: true } }));
  if (key === "interviewExperienceId") return !!(await db.interviewExperience.findUnique({ where: { id }, select: { id: true } }));
  return !!(await db.company.findUnique({ where: { id }, select: { id: true } }));
}

function uniqueWhere(userId: string, key: (typeof bookmarkTargets)[number], id: string) {
  const where = { [`userId_${key}`]: { userId, [key]: id } };
  return where as unknown as Prisma.BookmarkWhereUniqueInput;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const target = getTarget(body);

    if (!target) return NextResponse.json({ error: "Send exactly one bookmark target" }, { status: 400 });
    const [key, id] = target;
    if (!(await targetExists(key, id))) return NextResponse.json({ error: "Bookmark target not found" }, { status: 404 });

    const existing = await db.bookmark.findUnique({
      where: uniqueWhere(user.id, key, id),
    });

    if (existing) {
      await db.bookmark.delete({ where: uniqueWhere(user.id, key, id) });
      return NextResponse.json({ bookmarked: false });
    }

    await db.bookmark.create({ data: { userId: user.id, [key]: id } });
    return NextResponse.json({ bookmarked: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const target = getTarget(Object.fromEntries(request.nextUrl.searchParams));

    if (target) {
      const [key, id] = target;
      const bookmarked = await db.bookmark.findUnique({
        where: uniqueWhere(user.id, key, id),
      });
      return NextResponse.json({ bookmarked: !!bookmarked });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      include: {
                story: {
          include: {
            company: true,
            companies: {
              include: {
                company: true,
              },
            },
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
        resource: true,
        internship: { include: { company: true } },
        roadmap: { include: { company: true } },
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
