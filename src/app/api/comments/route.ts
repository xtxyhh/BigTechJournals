import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { commentSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const ip = getClientIp(request);
    const { success } = rateLimit(`comment:${user.id}:${ip}`, 10, 60_000);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const content = sanitizePlainText(parsed.data.content);
    if (!content) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        storyId: parsed.data.storyId,
        userId: user.id,
        content,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    const commentId = request.nextUrl.searchParams.get("id");
    if (!commentId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const comment = await db.comment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (comment.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
