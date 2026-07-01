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
  "coverImageZoom",
  "coverImageX",
  "coverImageY",
  "coverImageObjectPosition",
  "coverImageCropMode",
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
  "connectLabel",
  "connectUrl",
] as const;

function cleanOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function cleanOptionalUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function cleanNumber(value: unknown, fallback: number, min: number, max: number) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, number));
}

function buildStoryData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  for (const field of storyScalarFields) {
    if (field in body) data[field] = body[field];
  }

  if ("coverImage" in data) data.coverImage = cleanOptionalString(data.coverImage);
  if ("coverImageZoom" in data) data.coverImageZoom = cleanNumber(data.coverImageZoom, 1, 1, 2.5);
  if ("coverImageX" in data) data.coverImageX = cleanNumber(data.coverImageX, 50, 0, 100);
  if ("coverImageY" in data) data.coverImageY = cleanNumber(data.coverImageY, 50, 0, 100);
  if ("coverImageObjectPosition" in data) data.coverImageObjectPosition = typeof data.coverImageObjectPosition === "string" && data.coverImageObjectPosition.trim() ? data.coverImageObjectPosition : "50% 50%";
  if ("coverImageCropMode" in data) data.coverImageCropMode = data.coverImageCropMode === "contain" ? "contain" : "cover";
  if ("authorImage" in data) data.authorImage = cleanOptionalString(data.authorImage);
  for (const field of ["linkedin", "twitter", "instagram", "github", "canonicalUrl", "connectUrl"] as const) {
    if (field in data) {
      const url = cleanOptionalUrl(data[field]);
      if (url === undefined) throw new Error(`Invalid ${field}`);
      data[field] = url;
    }
  }
  if ("candidatePhoto" in data) data.candidatePhoto = cleanOptionalString(data.candidatePhoto);
  if ("country" in data) data.country = cleanOptionalString(data.country);
  if ("experience" in data) data.experience = cleanOptionalString(data.experience);
  if ("currentCompany" in data) data.currentCompany = cleanOptionalString(data.currentCompany);
  if ("previousCompany" in data) data.previousCompany = cleanOptionalString(data.previousCompany);
  if ("salary" in data) data.salary = cleanOptionalString(data.salary);
  if ("seoKeywords" in data) data.seoKeywords = cleanOptionalString(data.seoKeywords);
  if ("connectLabel" in data) data.connectLabel = cleanOptionalString(data.connectLabel);

  const companyIds = Array.isArray(body.companyIds)
    ? body.companyIds.filter((id): id is string => typeof id === "string" && Boolean(id.trim()))
    : [];
  data.companyId = cleanOptionalString(companyIds[0] ?? body.companyId);

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

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      const story = await db.story.findUnique({
        where: { id },
        include: {
          company: true,
          companies: { include: { company: true } },
          categories: { include: { category: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });
      if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(story);
    }
    const stories = await db.story.findMany({
      include: {
        company: true,
        companies: { include: { company: true } },
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
    const companyIds = Array.isArray(body.companyIds) ? body.companyIds.filter((id): id is string => typeof id === "string") : [];

    const story = await db.story.create({
      data: buildStoryData(body) as Prisma.StoryUncheckedCreateInput,
    });

    if (categoryIds.length) {
      await db.storyCategory.createMany({
        data: categoryIds.map((categoryId) => ({ storyId: story.id, categoryId })),
      });
    }
    if (companyIds.length) {
      await db.storyCompany.createMany({
        data: companyIds.map((companyId) => ({ storyId: story.id, companyId })),
        skipDuplicates: true,
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
    const companyIds = Array.isArray(body.companyIds) ? body.companyIds.filter((companyId): companyId is string => typeof companyId === "string") : undefined;
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
    if (companyIds !== undefined) {
      await db.storyCompany.deleteMany({ where: { storyId: id } });
      if (companyIds.length) {
        await db.storyCompany.createMany({
          data: companyIds.map((companyId) => ({ storyId: id, companyId })),
          skipDuplicates: true,
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
