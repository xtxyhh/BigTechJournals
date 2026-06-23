import Link from "next/link";
import { ArrowUpRight, BookOpen, Brain, Code2, Database, Layers3, Network, ServerCog, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Resources",
  description: "Curated DSA, system design, OS, DBMS, CN, Java, JavaScript, React, Next.js, AI, ML, roadmaps, and interview question resources.",
  path: "/resources",
});

export const dynamic = "force-dynamic";

const tracks = [
  { name: "DSA", icon: Code2, query: "dsa" },
  { name: "System Design", icon: Layers3, query: "system-design" },
  { name: "OS", icon: ServerCog, query: "os" },
  { name: "DBMS", icon: Database, query: "dbms" },
  { name: "CN", icon: Network, query: "cn" },
  { name: "Java", icon: BookOpen, query: "java" },
  { name: "JavaScript", icon: Code2, query: "javascript" },
  { name: "React", icon: Sparkles, query: "react" },
  { name: "Next.js", icon: Layers3, query: "nextjs" },
  { name: "AI", icon: Brain, query: "ai" },
  { name: "ML", icon: Brain, query: "ml" },
  { name: "Roadmaps", icon: Layers3, query: "roadmap" },
  { name: "Interview Questions", icon: BookOpen, query: "interview" },
];

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ q?: string; track?: string; difficulty?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const track = params.track?.trim();
  const difficulty = params.difficulty?.trim();
  const resources = await db.resource.findMany({
    where: {
      published: true,
      slug: { not: null },
      ...(track ? { type: { contains: track, mode: "insensitive" } } : {}),
      ...(difficulty ? { difficulty: { equals: difficulty, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
            ],
          }
        : {}),
    },
    include: { company: { select: { name: true, slug: true } }, _count: { select: { bookmarks: true, likes: true } } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 80,
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Career prep library
          </p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            The resources engineers actually come back to.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
            DSA, system design, CS fundamentals, modern web, AI, ML, roadmaps, and interview questions organized for repeated study.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((track) => (
            <Link key={track.name} href={`/resources?track=${track.query}`} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl transition hover:border-blue-300/35 hover:bg-white/[0.075]">
              <track.icon className="h-5 w-5 text-blue-300" />
              <p className="mt-5 font-semibold text-white group-hover:text-blue-200">{track.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Library</p>
            <h2 className="mt-2 text-3xl font-semibold">Saved resources</h2>
          </div>
          <Link href="/submit" className="hidden rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">
            Suggest a resource
          </Link>
        </div>

        <form className="mb-6 grid gap-3 rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-3 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_180px_140px]">
          <input name="q" defaultValue={q} placeholder="Search DSA, React, AI, interview questions" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
          <input name="track" defaultValue={track} placeholder="Category" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
          <button className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">Search</button>
        </form>

        {resources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {resources.map((resource) => (
              <article key={resource.id} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl transition hover:border-blue-300/35 hover:bg-white/[0.075]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{resource.type}</p>
                    <Link href={`/resources/${resource.slug ?? resource.id}`} className="mt-3 block text-xl font-semibold text-white group-hover:text-blue-200">{resource.title ?? resource.name}</Link>
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name}`}><ArrowUpRight className="h-5 w-5 text-white/35 transition hover:text-blue-200" /></a>
                </div>
                {resource.description && <p className="mt-4 line-clamp-3 leading-7 text-white/58">{resource.description}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  {resource.difficulty && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{resource.difficulty}</span>}
                  {resource.timeRequired && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{resource.timeRequired}</span>}
                  {resource.company && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{resource.company.name}</span>}
                  {resource.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/35">{resource._count.bookmarks} saves</span>
                  <SaveContentButton targetKey="resourceId" targetId={resource.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">
            Resources added in admin will appear here.
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
