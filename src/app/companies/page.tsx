import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeDollarSign, BriefcaseBusiness, Building2, ClipboardList, Map, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCompanies } from "@/lib/companies";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Companies",
  description: "Explore Big Tech company guides with interview process, salary ranges, internships, stories, resources, roadmaps, and interview questions.",
  path: "/companies",
});

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getAllCompanies();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_75%_15%,rgba(34,211,238,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              Company intelligence
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Pick a company. See the path before you apply.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/68">
              Interview process, salary context, internship pathways, stories, roadmaps, resources, and questions in one clean company guide.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ClipboardList, label: "Interview process" },
              { icon: BadgeDollarSign, label: "Salary ranges" },
              { icon: BriefcaseBusiness, label: "Internships" },
              { icon: Map, label: "Roadmaps" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl">
                <item.icon className="h-5 w-5 text-blue-300" />
                <p className="mt-4 text-sm font-medium text-white/78">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">{companies.length} guides</p>
            <h2 className="mt-2 text-3xl font-semibold">Explore companies</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-sm text-white/45">
            <Search className="h-4 w-4" /> Press Ctrl K to search instantly
          </div>
        </div>

        {companies.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {companies.map((company) => (
              <Link key={company.id} href={`/company/${company.slug}`} className="group rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl transition hover:border-blue-300/35 hover:bg-white/[0.075]">
                <div className="flex items-start gap-4">
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white">
                    {company.logo ? (
                      <Image src={company.logo} alt={company.name} fill className="object-contain p-3" />
                    ) : (
                      <Building2 className="h-7 w-7 text-slate-800" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-200">{company.name}</h3>
                    <p className="mt-1 text-sm text-white/45">{company._count.storyLinks} stories</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-5 w-5 text-white/35 transition group-hover:text-blue-200" />
                </div>
                <p className="mt-5 line-clamp-3 leading-7 text-white/60">{company.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(company.tags.length ? company.tags : ["Interviews", "Roadmap", "Resources"]).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.08] bg-black/20 px-3 py-1 text-xs text-white/55">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-10 text-center text-white/58 backdrop-blur-xl">
            Company guides will appear here as soon as they are added from admin.
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
