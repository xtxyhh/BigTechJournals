import JournalCard from "./JournalCard";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatReadTime } from "@/lib/seo";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface LatestStory {
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  authorRole?: string | null;
  company?: { name: string } | null;
  readTime: number;
  createdAt: Date;
  category: string;
  coverImage?: string | null;
}

interface LatestArticlesProps {
  stories?: LatestStory[];
}

export default function LatestArticles({ stories = [] }: LatestArticlesProps) {
  if (!stories.length) return null;

  return (
    <section className="py-14 sm:py-16 bg-surface overflow-hidden relative">
      <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-semibold text-surface-muted uppercase tracking-wider block">
              Read the
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Latest Articles
            </h2>
          </div>

          <Link href="/stories" className="w-full sm:w-auto px-5 py-2.5 bg-surface-elevated text-white text-sm font-medium rounded-full hover:bg-white/[0.1] transition-colors shadow-sm inline-flex items-center justify-center gap-2">
            View All Stories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stories.map((story) => (
            <JournalCard
              key={story.slug}
              title={story.title}
              slug={story.slug}
              preview={story.excerpt}
              role={story.authorRole ?? "Engineer"}
              company={story.company?.name ?? "Big Tech"}
              readTime={formatReadTime(story.readTime)}
              author={story.authorName}
              date={story.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              category={story.category}
              image={safeImageUrl(story.coverImage, DEFAULT_IMAGES.storyCover)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
