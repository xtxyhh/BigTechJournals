import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncUserFromClerk } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await syncUserFromClerk();
    if (!user || user.banned) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { storyId?: unknown; content?: unknown; parentId?: unknown };
    const storyId = typeof body.storyId === "string" ? body.storyId : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const parentId = typeof body.parentId === "string" && body.parentId.length > 0 ? body.parentId : null;

    if (!storyId || !content) {
      return NextResponse.json({ error: "Story and comment are required" }, { status: 400 });
    }
    if (content.length > 2000) {
      return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
    }

    const story = await db.story.findFirst({
      where: { id: storyId, published: true, deletedAt: null },
      select: { id: true },
    });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (parentId) {
      const parent = await db.comment.findFirst({
        where: { id: parentId, storyId, deleted: false },
        select: { id: true },
      });
      if (!parent) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
      }
    }

    const comment = await db.comment.create({
      data: { storyId, userId: user.id, content, parentId },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Comment create failed:", error);
    }
    return NextResponse.json({ error: "Unable to post comment" }, { status: 500 });
  }
}
