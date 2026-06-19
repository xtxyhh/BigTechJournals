import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bigtechjournals.com";
const SITE_NAME = "BigTechJournals";

interface SEOParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  publishedTime,
  author,
}: SEOParams): Metadata {
  const url = `${APP_URL}${path}`;
  const ogImage = image ?? `${APP_URL}/og-default.png`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function buildArticleJsonLd(story: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: story.coverImage,
    author: { "@type": "Person", name: story.authorName },
    datePublished: story.createdAt.toISOString(),
    dateModified: story.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: APP_URL,
    },
    mainEntityOfPage: `${APP_URL}/stories/${story.slug}`,
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: APP_URL,
    description:
      "Learn from people who cracked Big Tech. Real journeys, interview experiences, and preparation guides.",
  };
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function calculateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
