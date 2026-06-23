"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface CategoryItem {
  label: string;
  slug: string;
  image: string;
  count: string;
}

interface CategoriesProps {
  categories?: CategoryItem[];
}

const FALLBACK: CategoryItem[] = [
  { label: "Internships", slug: "internships", image: DEFAULT_IMAGES.categoryInternships, count: "120+ Stories" },
  { label: "Big Tech", slug: "big-tech", image: DEFAULT_IMAGES.categoryTech, count: "350+ Stories" },
  { label: "Startups", slug: "startups", image: DEFAULT_IMAGES.storyCover, count: "80+ Stories" },
  { label: "Career Growth", slug: "growth", image: DEFAULT_IMAGES.categoryCareer, count: "150+ Stories" },
  { label: "AI & ML", slug: "ai-ml", image: DEFAULT_IMAGES.categoryTech, count: "90+ Stories" },
];

export default function Categories({ categories = FALLBACK }: CategoriesProps) {
  return (
    <section className="relative overflow-hidden bg-surface py-14 sm:py-18">
      <div className="absolute inset-0 bg-aurora opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-2 block">
              Explore Topics
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Browse Categories
            </h2>
          </div>
          <Link href="/stories" className="hidden md:flex items-center gap-2 text-sm font-medium text-surface-muted hover:text-brand-blue transition-colors">
            View All Categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              className="group relative h-56 w-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.05] p-2 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/35 hover:bg-white/[0.075] hover:shadow-card-hover sm:h-64 lg:h-80"
            >
              <div className="absolute inset-2 overflow-hidden rounded-[18px]">
                <Image
                  src={safeImageUrl(category.image, DEFAULT_IMAGES.categoryTech)}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-2 rounded-[18px] bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white transition-transform duration-300 group-hover:-translate-y-1">
                <div className="mb-4 h-1 w-8 rounded-full bg-blue-400 opacity-80" />
                <h3 className="mb-1 text-xl font-semibold">{category.label}</h3>
                <p className="text-sm text-white/80 font-medium">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/stories" className="md:hidden mt-8 w-full py-4 bg-surface-card text-white font-bold rounded-xl border border-surface-border block text-center">
          View All Categories
        </Link>
      </div>
    </section>
  );
}
