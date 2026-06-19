import { NextRequest, NextResponse } from "next/server";
import { getStoryBySlug, incrementStoryViews } from "@/lib/stories";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story || !story.published) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  return NextResponse.json(story);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  await incrementStoryViews(story.id);
  return NextResponse.json({ success: true });
}
