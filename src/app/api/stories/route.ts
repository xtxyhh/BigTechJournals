import { NextRequest, NextResponse } from "next/server";
import { getStories } from "@/lib/stories";
import type { StorySort } from "@/lib/stories";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sort = (searchParams.get("sort") ?? "latest") as StorySort;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const search = searchParams.get("search") ?? undefined;
  const companySlug = searchParams.get("company") ?? undefined;
  const categorySlug = searchParams.get("category") ?? undefined;
  const featured = searchParams.get("featured") === "true";

  const result = await getStories({
    sort,
    page,
    limit,
    search,
    companySlug,
    categorySlug,
    featured,
  });

  return NextResponse.json(result);
}
