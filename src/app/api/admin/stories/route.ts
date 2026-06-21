import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

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
    
    const { categoryIds, timeline, interviewProcess, resources, mistakes, advice, ...data } = body;

    const story = await db.story.create({
      data: {
        ...data,
        coverImage: data.coverImage || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        instagram: data.instagram || null,
        github: data.github || null,
        candidatePhoto: data.candidatePhoto || null,
        country: data.country || null,
        experience: data.experience || null,
        currentCompany: data.currentCompany || null,
        previousCompany: data.previousCompany || null,
        salary: data.salary || null,
        timeline: timeline || null,
        interviewProcess: interviewProcess || null,
        resources: resources || null,
        mistakes: mistakes || null,
        advice: advice || null,
        seoKeywords: data.seoKeywords || null,
        canonicalUrl: data.canonicalUrl || null,
        companyId: data.companyId || null,
        publishedAt: data.status === "published" ? new Date() : null,
        scheduledAt: data.status === "scheduled" ? data.scheduledAt ? new Date(data.scheduledAt) : null : null,
      },
    });

    if (categoryIds?.length) {
      await db.storyCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({ storyId: story.id, categoryId })),
      });
    }

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, categoryIds, timeline, interviewProcess, resources, mistakes, advice, ...data } = body;

    const updateData: Record<string, unknown> = {
      ...data,
      coverImage: data.coverImage || null,
      linkedin: data.linkedin || null,
      twitter: data.twitter || null,
      instagram: data.instagram || null,
      github: data.github || null,
      candidatePhoto: data.candidatePhoto || null,
      country: data.country || null,
      experience: data.experience || null,
      currentCompany: data.currentCompany || null,
      previousCompany: data.previousCompany || null,
      salary: data.salary || null,
    };

    if (timeline !== undefined) updateData.timeline = timeline;
    if (interviewProcess !== undefined) updateData.interviewProcess = interviewProcess;
    if (resources !== undefined) updateData.resources = resources;
    if (mistakes !== undefined) updateData.mistakes = mistakes;
    if (advice !== undefined) updateData.advice = advice;
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords;
    if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl;

    if (data.status === "published" && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }
    if (data.status === "scheduled" && data.scheduledAt) {
      updateData.scheduledAt = new Date(data.scheduledAt);
    }

    const story = await db.story.update({ where: { id }, data: updateData });

    if (categoryIds) {
      await db.storyCategory.deleteMany({ where: { storyId: id } });
      if (categoryIds.length) {
        await db.storyCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({ storyId: id, categoryId })),
        });
      }
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
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
