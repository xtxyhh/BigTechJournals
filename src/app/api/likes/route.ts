import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { storyId } = await request.json();

    const story = await db.story.findUnique({ where: { id: storyId } });
    if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });

    const existing = await db.like.findUnique({
      where: { userId_storyId: { userId: user.id, storyId } },
    });

    if (existing) {
      await db.like.delete({ where: { userId_storyId: { userId: user.id, storyId } } });
      const count = await db.like.count({ where: { storyId } });
      return NextResponse.json({ liked: false, count });
    }

    await db.like.create({ data: { userId: user.id, storyId } });
    const count = await db.like.count({ where: { storyId } });
    return NextResponse.json({ liked: true, count });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const storyId = request.nextUrl.searchParams.get("storyId");

    if (storyId) {
      const liked = await db.like.findUnique({
        where: { userId_storyId: { userId: user.id, storyId } },
      });
      return NextResponse.json({ liked: !!liked });
    }

    const likes = await db.like.findMany({
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

    return NextResponse.json(likes);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
