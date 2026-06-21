import { db } from "./db";

export async function getAllCompanies() {
  return db.company.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { stories: { where: { published: true } } } } },
  });
}

export async function getCompanyBySlug(slug: string) {
  return db.company.findUnique({
    where: { slug },
    include: {
      stories: {
        where: { published: true },
        include: {
          categories: { include: { category: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { views: "desc" },
        take: 6,
      },
      _count: { select: { stories: { where: { published: true } } } },
    },
  });
}

export async function getAllCategories() {
  return db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { stories: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      _count: { select: { stories: true, followers: true } },
    },
  });
}

export async function getCategoryStories(slug: string, sort: "latest" | "most-viewed" = "most-viewed") {
  return db.story.findMany({
    where: {
      published: true,
      categories: { some: { category: { slug } } },
    },
    include: {
      company: true,
      categories: { include: { category: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: sort === "latest" ? { createdAt: "desc" } : { views: "desc" },
  });
}
