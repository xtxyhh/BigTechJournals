import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { storySchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const stories = await db.story.findMany({
      include: {
        company: true,
        categories: { include: { category: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(stories);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = storySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { categoryIds, ...data } = parsed.data;

    const story = await db.story.create({
      data: {
        ...data,
        coverImage: data.coverImage || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        instagram: data.instagram || null,
        companyId: data.companyId || null,
      },
    });

    if (categoryIds?.length) {
      await db.storyCategory.createMany({
        data: categoryIds.map((categoryId) => ({ storyId: story.id, categoryId })),
      });
    }

    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, categoryIds, ...data } = body;

    const story = await db.story.update({ where: { id }, data });

    if (categoryIds) {
      await db.storyCategory.deleteMany({ where: { storyId: id } });
      if (categoryIds.length) {
        await db.storyCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({ storyId: id, categoryId })),
        });
      }
    }

    return NextResponse.json(story);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
