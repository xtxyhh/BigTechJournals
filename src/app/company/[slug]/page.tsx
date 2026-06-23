import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { getCompanyBySlug } from "@/lib/companies";
import { getStories } from "@/lib/stories";
import { buildMetadata } from "@/lib/seo";
import { ChevronDown, BookOpen, Youtube, GraduationCap, Code2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};
  return buildMetadata({
    title: `How to Crack ${company.name}`,
    description: company.description.slice(0, 160),
    path: `/company/${slug}`,
    image: company.logo ?? undefined,
  });
}

export const revalidate = 3600;

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const roadmap = company.roadmap as { phases?: { period: string; focus: string; tasks: string[] }[] } | null;
  const interview = company.interviewProcess as { rounds?: { name: string; description: string }[]; tips?: string[] } | null;
  const resources = company.resources as { books?: string[]; youtube?: string[]; courses?: string[]; leetcode?: string[] } | null;
  const salary = company.salaryInfo as Record<string, { base: string; total: string }> | null;
  const faqs = company.faqs as { q: string; a: string }[] | null;

  const storyCards = (
    await getStories({ companySlug: slug, limit: 6, sort: "most-viewed" })
  ).stories;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* Banner */}
      <section className="relative overflow-hidden pt-24 pb-16 border-b border-white/[0.08] bg-[radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.22),transparent_32%),#050816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {company.logo && (
              <div className="w-24 h-24 relative shrink-0 bg-white rounded-[24px] border border-white/[0.08] p-4 shadow-2xl shadow-blue-500/10">
                <Image src={company.logo} alt={company.name} fill className="object-contain p-2" />
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-2 block">
                Company Guide
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How to Crack {company.name}
              </h1>
              <p className="text-lg text-white/68 max-w-3xl leading-relaxed">{company.description}</p>
              <p className="mt-4 text-sm text-white/45">{company._count.storyLinks} stories from {company.name} engineers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      {roadmap?.phases && roadmap.phases.length > 0 && (
        <section className="py-16 bg-[#050816]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Preparation Roadmap</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roadmap.phases.map((phase, i) => (
                <div key={i} className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-xl">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{phase.period}</span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-4">{phase.focus}</h3>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, j) => (
                      <li key={j} className="text-sm text-white/62 flex items-start gap-2">
                        <span className="text-blue-300 mt-1">•</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interview Process */}
      {interview?.rounds && (
        <section className="py-16 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Interview Process</h2>
            <div className="space-y-4">
              {interview.rounds.map((round, i) => (
                <div key={i} className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] flex gap-4 backdrop-blur-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-200 font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{round.name}</h3>
                    <p className="text-white/62 mt-1">{round.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {interview.tips && (
              <div className="mt-8 bg-blue-500/10 rounded-[24px] p-6 border border-blue-300/20">
                <h3 className="font-bold text-white mb-3">Pro Tips</h3>
                <ul className="space-y-2">
                  {interview.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-white/70">✓ {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Stories */}
      {storyCards.length > 0 && (
        <section className="py-16 bg-[#050816]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Top {company.name} Stories</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {storyCards.map((story) => (
                <StoryCard key={story.id} {...story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Salary */}
      {salary && (
        <section className="py-16 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Compensation Overview</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: "intern", label: "Intern" },
                { key: "swe1", label: "SWE I" },
                { key: "swe2", label: "SWE II" },
                { key: "senior", label: "Senior" },
              ].map(({ key, label }) => {
                const info = salary[key];
                if (!info) return null;
                return (
                  <div key={key} className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] text-center backdrop-blur-xl">
                    <p className="text-sm font-semibold text-white/45 uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-2xl font-bold text-white">{info.total}</p>
                    <p className="text-sm text-white/45 mt-1">Base: {info.base}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Resources */}
      {resources && (
        <section className="py-16 bg-[#050816]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Recommended Resources</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              {resources.books && resources.books.length > 0 && (
                <div className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-xl">
                  <BookOpen className="w-6 h-6 text-blue-300 mb-3" />
                  <h3 className="font-bold text-white mb-3">Books</h3>
                  <ul className="space-y-1">{resources.books.map((b, i) => <li key={i} className="text-sm text-white/62">{b}</li>)}</ul>
                </div>
              )}
              {resources.youtube && resources.youtube.length > 0 && (
                <div className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-xl">
                  <Youtube className="w-6 h-6 text-red-500 mb-3" />
                  <h3 className="font-bold text-white mb-3">YouTube</h3>
                  <ul className="space-y-1">{resources.youtube.map((y, i) => <li key={i} className="text-sm text-white/62">{y}</li>)}</ul>
                </div>
              )}
              {resources.courses && resources.courses.length > 0 && (
                <div className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-xl">
                  <GraduationCap className="w-6 h-6 text-green-500 mb-3" />
                  <h3 className="font-bold text-white mb-3">Courses</h3>
                  <ul className="space-y-1">{resources.courses.map((c, i) => <li key={i} className="text-sm text-white/62">{c}</li>)}</ul>
                </div>
              )}
              {resources.leetcode && resources.leetcode.length > 0 && (
                <div className="bg-white/[0.05] rounded-[24px] p-6 border border-white/[0.08] backdrop-blur-xl">
                  <Code2 className="w-6 h-6 text-orange-500 mb-3" />
                  <h3 className="font-bold text-white mb-3">LeetCode Lists</h3>
                  <ul className="space-y-1">{resources.leetcode.map((l, i) => <li key={i} className="text-sm text-white/62">{l}</li>)}</ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white/[0.05] rounded-[24px] border border-white/[0.08] group backdrop-blur-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-white">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-white/45 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="px-6 pb-6 text-white/62">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-12 text-center">
        <Link href="/submit" className="inline-flex px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/20">
          Share Your {company.name} Story
        </Link>
      </div>

      <Footer />
    </main>
  );
}
