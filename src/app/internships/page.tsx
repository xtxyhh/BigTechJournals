import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CalendarClock, Filter, Globe2, MapPin, Search, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Internships",
  description: "Discover internship stories, preparation paths, remote-friendly signals, company guides, and application resources for students targeting Big Tech.",
  path: "/internships",
});

export const revalidate = 3600;

export default async function InternshipsPage({ searchParams }: { searchParams: Promise<{ q?: string; company?: string; location?: string; remote?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const company = params.company?.trim();
  const location = params.location?.trim();
  const remote = params.remote === "true";
  const internships = await db.internship.findMany({
    where: {
      published: true,
      ...(remote ? { remote: true } : {}),
      ...(company ? { company: { slug: company } } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { stipend: { contains: q, mode: "insensitive" } },
              { tags: { has: q } },
              { company: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
    take: 80,
  });

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
              { icon: Search, label: "Search openings" },
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
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-3 backdrop-blur-xl">
          <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px_120px]">
            <input name="q" defaultValue={q} placeholder="Search role, stipend, tags" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
            <input name="company" defaultValue={company} placeholder="Company slug" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
            <input name="location" defaultValue={location} placeholder="Location" className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
            <button className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">Search</button>
            <label className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white/70 md:col-span-4">
              <input type="checkbox" name="remote" value="true" defaultChecked={remote} /> Remote only
            </label>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Openings</p>
            <h2 className="mt-2 text-3xl font-semibold">Internships</h2>
          </div>
          <Link href="/resources?track=interview" className="hidden rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">
            Prep resources
          </Link>
        </div>

        {internships.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {internships.map((internship) => (
              <article key={internship.id} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{internship.company?.name ?? "Internship"}</p>
                    <Link href={`/internships/${internship.slug}`} className="mt-3 block text-xl font-semibold text-white hover:text-blue-200">{internship.title}</Link>
                  </div>
                  {internship.applyUrl && <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer" aria-label={`Apply to ${internship.title}`}><ArrowUpRight className="h-5 w-5 text-white/35 hover:text-blue-200" /></a>}
                </div>
                <p className="mt-4 line-clamp-3 leading-7 text-white/58">{internship.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {internship.remote && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55"><Globe2 className="mr-1 inline h-3 w-3" />Remote</span>}
                  {internship.location && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55"><MapPin className="mr-1 inline h-3 w-3" />{internship.location}</span>}
                  {internship.stipend && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55"><BriefcaseBusiness className="mr-1 inline h-3 w-3" />{internship.stipend}</span>}
                  {internship.deadline && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55"><CalendarClock className="mr-1 inline h-3 w-3" />{new Date(internship.deadline).toLocaleDateString()}</span>}
                  {internship.featured && <span className="rounded-full border border-blue-300/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"><TrendingUp className="mr-1 inline h-3 w-3" />Trending</span>}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/35">{internship._count.bookmarks} saves</span>
                  <SaveContentButton targetKey="internshipId" targetId={internship.id} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">
            Internships created in admin will appear here.
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
