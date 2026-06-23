import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SaveContentButton from "@/components/SaveContentButton";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };
type RoadmapNode = { title: string; description?: string; resources?: string[] };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = await db.roadmap.findUnique({ where: { slug }, include: { company: true } });
  if (!roadmap) return {};
  return buildMetadata({
    title: roadmap.seoTitle ?? roadmap.title,
    description: roadmap.seoDescription ?? roadmap.description,
    path: `/roadmaps/${slug}`,
    image: roadmap.coverImage ?? roadmap.company?.logo ?? undefined,
  });
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = await db.roadmap.findUnique({
    where: { slug },
    include: { company: { select: { name: true, slug: true, logo: true } }, _count: { select: { bookmarks: true, likes: true } } },
  });
  if (!roadmap || !roadmap.published) notFound();

  await db.roadmap.update({ where: { id: roadmap.id }, data: { views: { increment: 1 } } });
  const nodes = Array.isArray(roadmap.nodes) ? (roadmap.nodes as RoadmapNode[]) : [];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">{roadmap.company?.name ?? roadmap.role ?? "Roadmap"}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{roadmap.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/65">{roadmap.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <SaveContentButton targetKey="roadmapId" targetId={roadmap.id} />
          {roadmap.difficulty && <span className="rounded-full border border-white/[0.08] px-4 py-2 text-sm text-white/60">{roadmap.difficulty}</span>}
          {roadmap.timeRequired && <span className="rounded-full border border-white/[0.08] px-4 py-2 text-sm text-white/60">{roadmap.timeRequired}</span>}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {nodes.length > 0 ? (
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <details key={`${node.title}-${index}`} open={index === 0} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500 text-sm font-semibold text-white">{index + 1}</span>
                    <h2 className="text-xl font-semibold text-white">{node.title}</h2>
                  </div>
                </summary>
                {node.description && <p className="mt-4 pl-14 leading-7 text-white/62">{node.description}</p>}
                {!!node.resources?.length && (
                  <div className="mt-4 flex flex-wrap gap-2 pl-14">
                    {node.resources.map((resource) => <span key={resource} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-white/55">{resource}</span>)}
                  </div>
                )}
              </details>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">Roadmap nodes can be added from admin.</div>
        )}
      </section>
      <Footer />
    </main>
  );
}
