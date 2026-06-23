import Link from "next/link";
import { Bookmark, BriefcaseBusiness, LockKeyhole, Route, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { toStoryCard } from "@/lib/stories";

export const metadata = buildMetadata({
  title: "Bookmarks",
  description: "Your saved BigTechJournals stories, resources, internships, companies, and roadmaps.",
  path: "/bookmarks",
});

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const user = await getAuthUser();
  const bookmarks = user
    ? await db.bookmark.findMany({
        where: { userId: user.id },
        include: {
          story: {
            include: {
              company: true,
              categories: { include: { category: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
          resource: true,
          internship: { include: { company: true } },
          roadmap: { include: { company: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Saved for later
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Your private career prep shelf.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            Return to the stories and preparation notes that deserve a second read.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {!user ? (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center backdrop-blur-xl">
            <LockKeyhole className="mx-auto h-8 w-8 text-blue-300" />
            <h2 className="mt-5 text-2xl font-semibold">Sign in to see your bookmarks</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-white/58">
              Save stories while reading, then use this page as your prep dashboard.
            </p>
            <Link href="/sign-in" className="mt-7 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
              Sign in
            </Link>
          </div>
        ) : bookmarks.length > 0 ? (
          <>
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              <Bookmark className="h-4 w-4" /> {bookmarks.length} saved items
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {bookmarks.map((bookmark) => {
                if (bookmark.story) return <StoryCard key={bookmark.id} {...toStoryCard(bookmark.story)} />;
                const item = bookmark.resource ?? bookmark.internship ?? bookmark.roadmap;
                if (!item) return null;
                const href = bookmark.resource ? `/resources/${bookmark.resource.slug}` : bookmark.internship ? `/internships/${bookmark.internship.slug}` : `/roadmaps/${bookmark.roadmap?.slug}`;
                const Icon = bookmark.resource ? Bookmark : bookmark.internship ? BriefcaseBusiness : Route;
                return (
                  <Link key={bookmark.id} href={href} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl transition hover:border-blue-300/35">
                    <Icon className="h-5 w-5 text-blue-300" />
                    <h2 className="mt-4 line-clamp-2 text-xl font-semibold text-white">{item.title ?? bookmark.resource?.name}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/58">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center backdrop-blur-xl">
            <Sparkles className="mx-auto h-8 w-8 text-blue-300" />
            <h2 className="mt-5 text-2xl font-semibold">No bookmarks yet</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-white/58">
              Start reading and bookmark the stories, resources, and company journeys you want to revisit.
            </p>
            <Link href="/stories" className="mt-7 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
              Explore stories
            </Link>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
