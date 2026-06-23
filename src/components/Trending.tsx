"use client";
import { ArrowUpRight, TrendingUp, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/seo";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface TrendingItem {
  id: string;
  title: string;
  slug: string;
  authorName: string;
  authorRole?: string | null;
  createdAt: Date | string;
  coverImage?: string | null;
  company?: { name: string } | null;
}

interface TrendingProps {
  stories?: TrendingItem[];
}

const FALLBACK = [
  {
    id: "1",
    title: "Google L4 Interview: The Hidden Rubric",
    slug: "google-l4-interview-rubric",
    authorName: "Sarah Jenkins",
    authorRole: "Staff Engineer at Google",
    createdAt: new Date(Date.now() - 2 * 86400000),
    coverImage: DEFAULT_IMAGES.storyCover,
  },
];

export default function Trending({ stories = FALLBACK }: TrendingProps) {
  return (
    <section className="py-24 bg-surface border-b border-surface-border relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 bg-surface-elevated rounded-lg">
                <TrendingUp className="w-5 h-5 text-brand-blue" />
              </span>
              <span className="text-sm font-bold text-brand-blue uppercase tracking-widest">
                Trending Now
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Most Read Stories
            </h2>
          </div>
          <Link href="/stories?sort=most-viewed" className="px-5 py-2.5 bg-surface-card border border-surface-border text-white text-sm font-medium rounded-full hover:bg-white/[0.05] hover:border-surface-border transition-all shadow-sm inline-flex items-center gap-2">
            View Full List <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {stories.map((item, idx) => (
            <Link
              href={`/stories/${item.slug}`}
              key={item.id}
              className="group relative flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center p-4 md:p-6 rounded-3xl hover:bg-white/[0.05] border border-transparent hover:border-surface-border transition-all duration-300"
            >
              <div className="hidden md:flex flex-col items-center justify-center w-16 md:w-24 shrink-0">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-surface-muted to-surface-muted/50 group-hover:from-brand-blue/20 group-hover:to-brand-blue/10 transition-all duration-200">
                  0{idx + 1}
                </span>
              </div>

              <div className="w-full md:w-64 h-48 md:h-40 rounded-2xl overflow-hidden shrink-0 relative shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src={safeImageUrl(item.coverImage, DEFAULT_IMAGES.storyCover)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="md:hidden absolute top-4 left-4 w-10 h-10 bg-surface-card/90 backdrop-blur rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                  0{idx + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0 py-2">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-brand-blue uppercase tracking-wider">
                  <span>{item.authorRole ?? item.company?.name ?? "Engineer"}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-brand-blue transition-colors">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-muted">
                  <span className="flex items-center gap-1.5 font-medium text-white">
                    <User className="w-4 h-4 text-surface-muted" />
                    {item.authorName}
                  </span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-surface-muted" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-surface-muted" />
                    {timeAgo(new Date(item.createdAt))}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex justify-center items-center w-12 h-12 rounded-full border border-surface-border text-surface-muted group-hover:border-brand-blue/30 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-all shrink-0">
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
