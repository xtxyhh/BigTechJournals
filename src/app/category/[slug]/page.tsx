import Navbar from "@/components/Navbar";
import CategoryHeader from "@/components/category/CategoryHeader";
import StartHere from "@/components/category/StartHere";
import StoriesGrid from "@/components/stories/StoriesGrid";
import { getCategoryBySlug, getCategoryStories } from "@/lib/companies";
import { toStoryCard } from "@/lib/stories";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} Stories`,
    description: category.description ?? `Browse ${category.name} stories on BigTechJournals`,
    path: `/category/${slug}`,
  });
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const stories = await getCategoryStories(slug);
  const storyCards = stories.map((s) => toStoryCard(s));
  const startHere = storyCards.slice(0, 2);
  const gridStories = storyCards.slice(2);

  return (
    <div className="min-h-screen bg-surface pb-20">
      <Navbar />
      <main className="pt-16">
        <CategoryHeader
          title={category.name}
          description={category.description ?? `Curated tech journeys from ${category.name}.`}
          stats={{
            count: `${category._count.stories} stories`,
            audience: "Everyone",
            outcomes: "Various",
          }}
        />
        {startHere.length > 0 && (
          <StartHere
            items={startHere.map((s) => ({
              id: s.id,
              title: s.title,
              excerpt: s.excerpt,
              image: s.image,
              readTime: s.readTime,
            }))}
          />
        )}
        <StoriesGrid stories={gridStories.length ? gridStories : storyCards} isLoading={false} />
      </main>
    </div>
  );
}