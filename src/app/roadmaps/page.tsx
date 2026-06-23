import Link from "next/link";
import { Route, Search, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Roadmaps",
  description: "Company and role-based preparation roadmaps for Big Tech interviews, AI, ML, data science, and software engineering.",
  path: "/roadmaps",
});

export const dynamic = "force-dynamic";

export default async function RoadmapsPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; company?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const role = params.role?.trim();
  const company = params.company?.trim();
  const roadmaps = await db.roadmap.findMany({
    where: {
      published: true,
      ...(role ? { role: { contains: role, mode: "insensitive" } } : {}),
      ...(company ? { company: { slug: company } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
              { company: { name: { contains: q, mode: "insensitive" } } },
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">Roadmaps</p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">Preparation paths that show the next move.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">Google SWE, Microsoft SDE, Amazon SDE, AI Engineer, ML Engineer, Data Scientist, and more when admins publish them.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <form className="grid gap-3 rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-3 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_180px_180px_120px]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4">
            <Search className="h-4 w-4 text-white/35" />
            <input name="q" defaultValue={q} placeholder="Search roadmap" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35" />
          </div>
          <input name="role" defaultValue={role} placeholder="Role" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
          <input name="company" defaultValue={company} placeholder="Company slug" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
          <button className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">Search</button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {roadmaps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {roadmaps.map((roadmap) => (
              <article key={roadmap.id} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{roadmap.company?.name ?? roadmap.role ?? "Roadmap"}</p>
                    <Link href={`/roadmaps/${roadmap.slug}`} className="mt-3 block text-xl font-semibold text-white hover:text-blue-200">{roadmap.title}</Link>
                  </div>
                  {roadmap.featured ? <Star className="h-5 w-5 fill-blue-300 text-blue-300" /> : <Route className="h-5 w-5 text-white/35" />}
                </div>
                <p className="mt-4 line-clamp-3 leading-7 text-white/58">{roadmap.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {roadmap.difficulty && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{roadmap.difficulty}</span>}
                  {roadmap.timeRequired && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{roadmap.timeRequired}</span>}
                  {roadmap.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{tag}</span>)}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/35">{roadmap._count.bookmarks} saves</span>
                  <SaveContentButton targetKey="roadmapId" targetId={roadmap.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">Roadmaps created in admin will appear here.</div>
        )}
      </section>
      <Footer />
    </main>
  );
}
