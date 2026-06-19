import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bigtechjournals.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [stories, companies, categories] = await Promise.all([
      db.story.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.company.findMany({ select: { slug: true, updatedAt: true } }),
      db.category.findMany({ select: { slug: true } }),
    ]);

    return [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
      { url: `${BASE_URL}/stories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
      { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
      ...stories.map((s) => ({
        url: `${BASE_URL}/stories/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...companies.map((c) => ({
        url: `${BASE_URL}/company/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...categories.map((c) => ({
        url: `${BASE_URL}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return [{ url: BASE_URL, lastModified: new Date() }];
  }
}
