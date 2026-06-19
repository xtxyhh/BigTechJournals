import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/seo";

export async function GET() {
  try {
    await requireAdmin();
    const submissions = await db.storySubmission.findMany({
      include: { category: true, company: true },
      orderBy: { submittedAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, status, reviewNotes, convertToStory } = await request.json();

    const submission = await db.storySubmission.findUnique({ where: { id } });
    if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (convertToStory && status === "APPROVED") {
      const slug = slugify(submission.storyTitle);
      const story = await db.story.create({
        data: {
          title: submission.storyTitle,
          slug: `${slug}-${Date.now()}`,
          excerpt: submission.storyContent.slice(0, 200) + "...",
          content: submission.storyContent,
          authorName: submission.name,
          linkedin: submission.linkedin,
          published: false,
          companyId: submission.companyId,
        },
      });

      if (submission.categoryId) {
        await db.storyCategory.create({
          data: { storyId: story.id, categoryId: submission.categoryId },
        });
      }
    }

    const updated = await db.storySubmission.update({
      where: { id },
      data: {
        status,
        reviewNotes,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
