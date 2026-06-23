import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const storyScalarFields = [
  "title",
  "slug",
  "excerpt",
  "content",
  "coverImage",
  "authorName",
  "authorImage",
  "authorRole",
  "linkedin",
  "twitter",
  "instagram",
  "published",
  "featured",
  "readTime",
  "outcomeType",
  "outcomeText",
  "careerStage",
  "seoTitle",
  "seoDescription",
  "trending",
  "github",
  "candidatePhoto",
  "country",
  "experience",
  "currentCompany",
  "previousCompany",
  "salary",
  "seoKeywords",
  "canonicalUrl",
] as const;

function cleanOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function buildStoryData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  for (const field of storyScalarFields) {
    if (field in body) data[field] = body[field];
  }

  if ("coverImage" in data) data.coverImage = cleanOptionalString(data.coverImage);
  if ("authorImage" in data) data.authorImage = cleanOptionalString(data.authorImage);
  if ("linkedin" in data) data.linkedin = cleanOptionalString(data.linkedin);
  if ("twitter" in data) data.twitter = cleanOptionalString(data.twitter);
  if ("instagram" in data) data.instagram = cleanOptionalString(data.instagram);
  if ("github" in data) data.github = cleanOptionalString(data.github);
  if ("candidatePhoto" in data) data.candidatePhoto = cleanOptionalString(data.candidatePhoto);
  if ("country" in data) data.country = cleanOptionalString(data.country);
  if ("experience" in data) data.experience = cleanOptionalString(data.experience);
  if ("currentCompany" in data) data.currentCompany = cleanOptionalString(data.currentCompany);
  if ("previousCompany" in data) data.previousCompany = cleanOptionalString(data.previousCompany);
  if ("salary" in data) data.salary = cleanOptionalString(data.salary);
  if ("seoKeywords" in data) data.seoKeywords = cleanOptionalString(data.seoKeywords);
  if ("canonicalUrl" in data) data.canonicalUrl = cleanOptionalString(data.canonicalUrl);

  data.companyId = cleanOptionalString(body.companyId);

  if ("timeline" in body) data.timeline = body.timeline || null;
  if ("interviewProcess" in body) data.interviewProcess = body.interviewProcess || null;
  if ("resources" in body) data.resources = body.resources || null;
  if ("mistakes" in body) data.mistakes = body.mistakes || null;
  if ("advice" in body) data.advice = body.advice || null;

  if (body.status === "published") {
    data.published = true;
    data.publishedAt = new Date();
    data.scheduledAt = null;
  } else if (body.status === "scheduled") {
    data.published = false;
    data.scheduledAt = typeof body.scheduledAt === "string" && body.scheduledAt ? new Date(body.scheduledAt) : null;
  } else if ("published" in body && body.published === true) {
    data.publishedAt = new Date();
  }

  return data;
}

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
    const body = (await request.json()) as Record<string, unknown>;
    
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.filter((id): id is string => typeof id === "string") : [];

    const story = await db.story.create({
      data: buildStoryData(body) as Prisma.StoryUncheckedCreateInput,
    });

    if (categoryIds.length) {
      await db.storyCategory.createMany({
        data: categoryIds.map((categoryId) => ({ storyId: story.id, categoryId })),
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
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.filter((categoryId): categoryId is string => typeof categoryId === "string") : undefined;
    const updateData = buildStoryData(body) as Prisma.StoryUncheckedUpdateInput;

    const story = await db.story.update({ where: { id }, data: updateData });

    if (categoryIds !== undefined) {
      await db.storyCategory.deleteMany({ where: { storyId: id } });
      if (categoryIds.length) {
        await db.storyCategory.createMany({
          data: categoryIds.map((categoryId) => ({ storyId: id, categoryId })),
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
