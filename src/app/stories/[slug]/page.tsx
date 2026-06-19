import { notFound } from "next/navigation";
import { getStoryBySlug, getRecommendedStories } from "@/lib/stories";
import { buildMetadata, buildArticleJsonLd } from "@/lib/seo";
import StoryPageClient from "./StoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || !story.published) return {};
  return buildMetadata({
    title: story.seoTitle ?? story.title,
    description: story.seoDescription ?? story.excerpt,
    path: `/stories/${slug}`,
    image: story.coverImage ?? undefined,
    type: "article",
    publishedTime: story.createdAt.toISOString(),
    author: story.authorName,
  });
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || !story.published) notFound();

  const jsonLd = buildArticleJsonLd(story);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryPageClient slug={slug} />
    </>
  );
}
