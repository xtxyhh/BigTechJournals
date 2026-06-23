import { notFound } from "next/navigation";
import {
  getAdjacentStories,
  getRecommendedStories,
  getStoryBySlug,
  toStoryCard,
} from "@/lib/stories";
import { buildMetadata, buildArticleJsonLd } from "@/lib/seo";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";
import StoryPageClient from "./StoryPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || !story.published) return {};
  return buildMetadata({
    title: story.seoTitle ?? story.title,
    description: story.seoDescription ?? story.excerpt,
    path: `/stories/${slug}`,
    image: safeImageUrl(story.coverImage, DEFAULT_IMAGES.storyCover),
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
  const [recommendedStories, adjacentStories] = await Promise.all([
    getRecommendedStories(story.id, story.companyId, 4),
    getAdjacentStories(story),
  ]);

  const initialStory = {
    id: story.id,
    title: story.title,
    slug: story.slug,
    excerpt: story.excerpt,
    content: story.content,
    coverImage: safeImageUrl(story.coverImage, DEFAULT_IMAGES.storyCover),
    authorName: story.authorName,
    authorImage: safeImageUrl(story.authorImage, DEFAULT_IMAGES.avatar),
    authorRole: story.authorRole,
    readTime: story.readTime,
    views: story.views,
    linkedin: story.linkedin,
    twitter: story.twitter,
    instagram: story.instagram,
    company: story.company
      ? {
          name: story.company.name,
          slug: story.company.slug,
          logo: safeImageUrl(story.company.logo, DEFAULT_IMAGES.companyLogo),
          description: story.company.description,
        }
      : null,
    categories: story.categories.map(({ category }) => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    })),
    comments: story.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        name: comment.user.name,
        image: comment.user.image,
      },
    })),
    interviewProcess: story.interviewProcess,
    resources: story.resources,
    advice: story.advice,
    timeline: story.timeline,
  };

  const recommended = recommendedStories
    .filter((recommendedStory) => recommendedStory.id !== story.id)
    .slice(0, 3)
    .map(toStoryCard);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryPageClient
        initialStory={initialStory}
        recommended={recommended}
        previousStory={adjacentStories.previous ? toStoryCard(adjacentStories.previous) : null}
        nextStory={adjacentStories.next ? toStoryCard(adjacentStories.next) : null}
      />
    </>
  );
}
