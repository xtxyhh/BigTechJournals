import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { storyId } = await request.json();

    const story = await db.story.findUnique({ where: { id: storyId } });
    if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });

    const existing = await db.bookmark.findUnique({
      where: { userId_storyId: { userId: user.id, storyId } },
    });

    if (existing) {
      await db.bookmark.delete({ where: { userId_storyId: { userId: user.id, storyId } } });
      return NextResponse.json({ bookmarked: false });
    }

    await db.bookmark.create({ data: { userId: user.id, storyId } });
    return NextResponse.json({ bookmarked: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const storyId = request.nextUrl.searchParams.get("storyId");

    if (storyId) {
      const bookmarked = await db.bookmark.findUnique({
        where: { userId_storyId: { userId: user.id, storyId } },
      });
      return NextResponse.json({ bookmarked: !!bookmarked });
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      include: {
        story: {
          include: {
            company: true,
            categories: { include: { category: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
