import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarClock, Globe2, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const internship = await db.internship.findUnique({ where: { slug }, include: { company: true } });
  if (!internship) return {};
  return buildMetadata({
    title: internship.seoTitle ?? internship.title,
    description: internship.seoDescription ?? internship.description,
    path: `/internships/${slug}`,
    image: internship.coverImage ?? internship.company?.logo ?? undefined,
  });
}

export default async function InternshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const internship = await db.internship.findUnique({
    where: { slug },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
  });
  if (!internship || !internship.published) notFound();

  await db.internship.update({ where: { id: internship.id }, data: { views: { increment: 1 } } });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">{internship.company?.name ?? "Internship"}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{internship.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">{internship.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {internship.applyUrl && (
            <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white">
              Apply now <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          <SaveContentButton targetKey="internshipId" targetId={internship.id} />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {internship.remote && <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5"><Globe2 className="h-5 w-5 text-blue-300" /><p className="mt-3 text-sm text-white/65">Remote friendly</p></div>}
          {internship.location && <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5"><MapPin className="h-5 w-5 text-blue-300" /><p className="mt-3 text-sm text-white/65">{internship.location}</p></div>}
          {internship.stipend && <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5"><p className="text-sm font-semibold text-blue-300">Stipend</p><p className="mt-3 text-sm text-white/65">{internship.stipend}</p></div>}
          {internship.deadline && <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5"><CalendarClock className="h-5 w-5 text-blue-300" /><p className="mt-3 text-sm text-white/65">{new Date(internship.deadline).toLocaleDateString()}</p></div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
