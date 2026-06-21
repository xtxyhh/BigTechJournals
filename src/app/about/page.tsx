import Link from "next/link";
import { ArrowUpRight, Building2, Linkedin, Milestone, Rocket, ShieldCheck, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About BigTechJournals",
  description: "BigTechJournals democratizes access to career stories, internships, resources, roadmaps, and opportunities from engineers at top companies.",
  path: "/about",
});

export const revalidate = 3600;

export default async function AboutPage() {
  const [storyCount, companyCount, resourceCount, subscriberCount] = await Promise.all([
    db.story.count({ where: { published: true, deletedAt: null } }),
    db.company.count(),
    db.resource.count(),
    db.newsletterSubscriber.count({ where: { active: true } }),
  ]);

  const stats = [
    { label: "Published career stories", value: storyCount },
    { label: "Company guides", value: companyCount },
    { label: "Curated resources", value: resourceCount },
    { label: "Newsletter readers", value: subscriberCount },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              Built for ambitious engineers
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Big Tech career knowledge should not be locked behind luck.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
              BigTechJournals collects real journeys, interview signals, preparation systems, and opportunity maps so students and engineers can make sharper career decisions.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
                <p className="text-4xl font-semibold text-white">{stat.value.toLocaleString()}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          { icon: Rocket, title: "Mission", text: "Democratize access to career stories, internships, roadmaps, resources, and opportunities from engineers working at top companies." },
          { icon: Sparkles, title: "Vision", text: "Become the most trusted career operating system for engineers preparing for Big Tech, AI careers, and high-growth technology teams." },
          { icon: ShieldCheck, title: "Principles", text: "Real stories over vague advice, thoughtful curation over clutter, and practical next steps over generic motivation." },
        ].map((item) => (
          <div key={item.title} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-7 backdrop-blur-xl">
            <item.icon className="h-6 w-6 text-blue-300" />
            <h2 className="mt-6 text-2xl font-semibold">{item.title}</h2>
            <p className="mt-4 leading-7 text-white/62">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Founder</p>
          <div className="mt-8 flex items-start gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] border border-blue-300/20 bg-blue-500/15 text-2xl font-semibold text-blue-100">
              TG
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Tanishq Gupta</h2>
              <p className="mt-1 text-white/55">Founder & CEO, BigTechJournals</p>
            </div>
          </div>
          <p className="mt-7 leading-8 text-white/68">
            Building BigTechJournals to democratize access to career stories, internships, resources and opportunities from engineers working at top companies.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="https://www.linkedin.com/in/tanishq--gupta" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/70 transition hover:border-blue-300/40 hover:text-blue-200">
              <Linkedin className="h-4 w-4" /> Founder LinkedIn
            </a>
            <a href="https://www.linkedin.com/company/bigtechjournals" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/70 transition hover:border-blue-300/40 hover:text-blue-200">
              <Building2 className="h-4 w-4" /> Company LinkedIn
            </a>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Timeline</p>
          <div className="mt-8 space-y-6">
            {[
              ["Foundation", "Started as a focused archive of real engineering career journeys."],
              ["Expansion", "Added company guides, preparation categories, bookmarks, comments, and community submission workflows."],
              ["Platform", "Now evolving into a career intelligence destination for stories, internships, roadmaps, resources, AI careers, and interview preparation."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/15 text-blue-200">
                  <Milestone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1 leading-7 text-white/58">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/stories" className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
            Start reading <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-8 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
            <Users className="h-4 w-4" /> Achievements
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Real interview narratives with company context", "Admin-editable stories, categories, settings, comments, and newsletter", "Search, bookmarking, likes, comments, SEO, and structured story pages"].map((achievement) => (
              <div key={achievement} className="rounded-3xl bg-black/20 p-5 text-white/70">
                {achievement}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
}
