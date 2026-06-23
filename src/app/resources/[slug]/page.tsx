import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resource = await db.resource.findUnique({ where: { slug } });
  if (!resource) return {};
  return buildMetadata({
    title: resource.seoTitle ?? resource.title ?? resource.name,
    description: resource.seoDescription ?? resource.description ?? `Study ${resource.name} on BigTechJournals.`,
    path: `/resources/${slug}`,
    image: resource.coverImage ?? resource.thumbnail ?? undefined,
  });
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const resource = await db.resource.findUnique({
    where: { slug },
    include: { company: { select: { name: true, slug: true } }, _count: { select: { bookmarks: true, likes: true } } },
  });
  if (!resource || !resource.published) notFound();

  await db.resource.update({ where: { id: resource.id }, data: { views: { increment: 1 } } });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">{resource.type}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{resource.title ?? resource.name}</h1>
        {resource.description && <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">{resource.description}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white">
            Open resource <ArrowUpRight className="h-4 w-4" />
          </a>
          <SaveContentButton targetKey="resourceId" targetId={resource.id} />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {resource.difficulty && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-sm text-white/60">{resource.difficulty}</span>}
          {resource.timeRequired && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-sm text-white/60">{resource.timeRequired}</span>}
          {resource.company && <span className="rounded-full border border-white/[0.08] px-3 py-1 text-sm text-white/60">{resource.company.name}</span>}
          {resource.tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1 text-sm text-white/60">{tag}</span>)}
        </div>
      </section>
      <Footer />
    </main>
  );
}
