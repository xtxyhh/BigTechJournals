import Link from "next/link";
import { Flame, Heart, LineChart, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { db } from "@/lib/db";
import { getStories, toStoryCard } from "@/lib/stories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trending",
  description: "Most read, most liked, most bookmarked, fastest growing, trending today, and trending this week stories from BigTechJournals.",
  path: "/trending",
});

export const revalidate = 900;

export default async function TrendingPage() {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const week = new Date(now);
  week.setDate(week.getDate() - 7);

  const [mostRead, mostLiked, mostBookmarked, fastestGrowing, trendingToday, trendingWeek] = await Promise.all([
    getStories({ sort: "most-viewed", limit: 6 }),
    db.story.findMany({
      where: { published: true, deletedAt: null },
      include: {
        company: true,
        categories: { include: { category: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ likes: { _count: "desc" } }, { views: "desc" }],
      take: 6,
    }),
    db.story.findMany({
      where: { published: true, deletedAt: null },
      include: {
        company: true,
        categories: { include: { category: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ bookmarks: { _count: "desc" } }, { views: "desc" }],
      take: 6,
    }),
    getStories({ sort: "trending", limit: 6 }),
    db.story.findMany({
      where: { published: true, deletedAt: null, createdAt: { gte: today } },
      include: {
        company: true,
        categories: { include: { category: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
    db.story.findMany({
      where: { published: true, deletedAt: null, createdAt: { gte: week } },
      include: {
        company: true,
        categories: { include: { category: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  const sections = [
    { title: "Most read", icon: Flame, stories: mostRead.stories },
    { title: "Most liked", icon: Heart, stories: mostLiked.map(toStoryCard) },
    { title: "Most bookmarked", icon: Heart, stories: mostBookmarked.map(toStoryCard) },
    { title: "Fastest growing", icon: LineChart, stories: fastestGrowing.stories },
    { title: "Trending today", icon: TrendingUp, stories: trendingToday.map(toStoryCard) },
    { title: "Trending this week", icon: TrendingUp, stories: trendingWeek.map(toStoryCard) },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Live editorial pulse
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            What ambitious engineers are reading right now.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            Ranked by reads, momentum, and recency across stories, interview experiences, and career playbooks.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-4 pb-20 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                  <section.icon className="h-4 w-4" /> {section.title}
                </p>
                <h2 className="mt-2 text-3xl font-semibold">{section.title}</h2>
              </div>
              <Link href="/stories" className="hidden rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">
                All stories
              </Link>
            </div>
            {section.stories.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.stories.map((story) => (
                  <StoryCard key={story.id} {...story} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 text-white/55 backdrop-blur-xl">
                No stories in this window yet.
              </div>
            )}
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
