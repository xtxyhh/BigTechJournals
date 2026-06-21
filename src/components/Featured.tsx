"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { formatReadTime } from "@/lib/seo";

interface FeaturedPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
  className?: string;
}

interface FeaturedProps {
  posts?: FeaturedPost[];
}

const GRID_CLASSES = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-1", "lg:col-span-1", "lg:col-span-1"];

const FeaturedCard = ({ post }: { post: FeaturedPost }) => {
  const Icon = FileText;

  return (
    <Link
      href={`/stories/${post.slug}`}
      className={`relative group overflow-hidden rounded-4xl h-[300px] lg:h-[400px] w-full block transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-card-hover ${
        post.className || ""
      }`}
    >
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="absolute top-6 left-6 bg-surface-card/90 p-2.5 rounded-full backdrop-blur-sm ring-1 ring-white/10">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="absolute top-6 right-6 bg-surface-card/90 py-1.5 px-4 rounded-full backdrop-blur-sm ring-1 ring-white/10">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Featured
        </span>
      </div>

      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full text-white">
        <div className="text-xs md:text-sm font-medium text-surface-muted mb-2 md:mb-3 flex items-center gap-2">
          {post.category}
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <div className="text-xs text-surface-muted font-medium">
          {post.date} • {formatReadTime(post.readTime)}
        </div>
      </div>
    </Link>
  );
};

export default function Featured({ posts = [] }: FeaturedProps) {
  if (!posts.length) return null;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-sm font-semibold text-surface-muted uppercase tracking-wider mb-2 block">
            See Our
          </span>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Featured Stories
          </h2>
        </div>
        <Link href="/stories?featured=true" className="px-6 py-3 bg-surface-elevated text-white text-sm font-medium rounded-full hover:bg-white/[0.1] transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2">
          View All Stories <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {posts.map((post, i) => (
          <FeaturedCard key={post.id} post={{ ...post, className: GRID_CLASSES[i] ?? "lg:col-span-1" }} />
        ))}
      </div>
    </section>
  );
}
