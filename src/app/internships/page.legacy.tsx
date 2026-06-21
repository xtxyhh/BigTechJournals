import Link from "next/link";
import { Bookmark, BriefcaseBusiness, CalendarClock, Filter, Globe2, MapPin, Search, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { getStories } from "@/lib/stories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Internships",
  description: "Discover internship stories, preparation paths, remote-friendly signals, company guides, and application resources for students targeting Big Tech.",
  path: "/internships",
});

export const revalidate = 3600;

export default async function InternshipsPage() {
  const internshipStories = await getStories({ categorySlug: "internships", sort: "most-viewed", limit: 9 });
  const fallbackStories = internshipStories.stories.length
    ? internshipStories.stories
    : (await getStories({ search: "intern", sort: "most-viewed", limit: 9 })).stories;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Internship command center
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Find the patterns behind the offers.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            Browse internship journeys, preparation playbooks, company signals, remote-friendly opportunities, stipend context, and application timing.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, label: "Search stories" },
              { icon: Filter, label: "Filter by company" },
              { icon: Globe2, label: "Remote signals" },
              { icon: CalendarClock, label: "Deadline habits" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl">
                <item.icon className="h-5 w-5 text-blue-300" />
                <p className="mt-4 text-sm font-medium text-white/78">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-5">
            {["Remote", "Location", "Stipend", "Deadline", "Trending"].map((filter, index) => (
              <button key={filter} type="button" className="flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white/70 transition hover:border-blue-300/35 hover:text-blue-200">
                {index === 0 && <Globe2 className="h-4 w-4" />}
                {index === 1 && <MapPin className="h-4 w-4" />}
                {index === 2 && <BriefcaseBusiness className="h-4 w-4" />}
                {index === 3 && <CalendarClock className="h-4 w-4" />}
                {index === 4 && <TrendingUp className="h-4 w-4" />}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Trending</p>
            <h2 className="mt-2 text-3xl font-semibold">Internship stories</h2>
          </div>
          <Link href="/category/internships" className="hidden rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">
            View category
          </Link>
        </div>

        {fallbackStories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fallbackStories.map((story) => (
              <div key={story.id} className="relative">
                <StoryCard {...story} />
                <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white/70 backdrop-blur-xl">
                  <Bookmark className="h-4 w-4" />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">
            Internship stories will appear here when published.
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
