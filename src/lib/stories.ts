import { db } from "./db";
import type { Prisma } from "@prisma/client";
import { formatReadTime, formatViews } from "./seo";
import type { StoryCardProps } from "@/components/stories/StoryCard";

export type StorySort = "latest" | "most-viewed" | "trending";

export interface StoryFilters {
  search?: string;
  companySlug?: string;
  categorySlug?: string;
  featured?: boolean;
  sort?: StorySort;
  page?: number;
  limit?: number;
}

const storyInclude = {
  company: true,
  categories: { include: { category: true } },
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.StoryInclude;

export function toStoryCard(
  story: Prisma.StoryGetPayload<{ include: typeof storyInclude }>,
): StoryCardProps {
  const category = story.categories[0]?.category.name ?? "General";
  return {
    id: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    category,
    readTime: formatReadTime(story.readTime),
    views: formatViews(story.views),
    image: story.coverImage ?? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    outcome: story.outcomeText
      ? {
          type: (story.outcomeType as "positive" | "neutral" | "negative") ?? "neutral",
          text: story.outcomeText,
        }
      : undefined,
    careerStage: story.careerStage ?? undefined,
    author: story.authorName
      ? { name: story.authorName, role: story.authorRole ?? "" }
      : undefined,
  };
}

function buildWhere(filters: StoryFilters): Prisma.StoryWhereInput {
  const where: Prisma.StoryWhereInput = { published: true };

  if (filters.featured) where.featured = true;
  if (filters.companySlug) where.company = { slug: filters.companySlug };
  if (filters.categorySlug) {
    where.categories = { some: { category: { slug: filters.categorySlug } } };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { excerpt: { contains: filters.search, mode: "insensitive" } },
      { authorName: { contains: filters.search, mode: "insensitive" } },
      { content: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort: StorySort = "latest"): Prisma.StoryOrderByWithRelationInput[] {
  switch (sort) {
    case "most-viewed":
      return [{ views: "desc" }];
    case "trending":
      return [{ views: "desc" }, { createdAt: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function getStories(filters: StoryFilters = {}) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const skip = (page - 1) * limit;

  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sort);

  const [stories, total] = await Promise.all([
    db.story.findMany({
      where,
      include: storyInclude,
      orderBy,
      skip,
      take: limit,
    }),
    db.story.count({ where }),
  ]);

  return {
    stories: stories.map(toStoryCard),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getFeaturedStories(limit = 5) {
  const stories = await db.story.findMany({
    where: { published: true, featured: true },
    include: storyInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return stories.map(toStoryCard);
}

export async function getTrendingStories(limit = 3) {
  const stories = await db.story.findMany({
    where: { published: true },
    include: storyInclude,
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return stories;
}

export async function getLatestStories(limit = 4) {
  const stories = await db.story.findMany({
    where: { published: true },
    include: storyInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return stories;
}

export async function getStoryBySlug(slug: string) {
  return db.story.findUnique({
    where: { slug },
    include: {
      ...storyInclude,
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRecommendedStories(
  storyId: string,
  companyId: string | null,
  limit = 3,
) {
  return db.story.findMany({
    where: {
      published: true,
      id: { not: storyId },
      ...(companyId ? { companyId } : {}),
    },
    include: storyInclude,
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function incrementStoryViews(storyId: string) {
  await db.$transaction([
    db.story.update({ where: { id: storyId }, data: { views: { increment: 1 } } }),
    db.storyView.create({ data: { storyId } }),
  ]);
}

export async function globalSearch(query: string, limit = 8) {
  if (!query.trim()) return { stories: [], companies: [], categories: [] };

  const [stories, companies, categories] = await Promise.all([
    db.story.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { authorName: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true, slug: true, authorName: true },
      take: limit,
    }),
    db.company.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true, slug: true, logo: true },
      take: 5,
    }),
    db.category.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true, slug: true },
      take: 5,
    }),
  ]);

  return { stories, companies, categories };
}
