"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
  { label: "Internships", slug: "internships", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", count: "120+ Stories" },
  { label: "Big Tech", slug: "big-tech", image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", count: "350+ Stories" },
  { label: "Startups", slug: "startups", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", count: "80+ Stories" },
  { label: "Career Growth", slug: "growth", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", count: "150+ Stories" },
  { label: "AI & ML", slug: "ai-ml", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", count: "90+ Stories" },
];

export default function Categories({ categories = FALLBACK }: CategoriesProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2 block">
              Explore Topics
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Browse Categories
            </h2>
          </div>
          <Link href="/stories" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            View All Categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              className="group relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-8 h-1 bg-blue-500 mb-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                <h3 className="text-xl font-bold mb-1">{category.label}</h3>
                <p className="text-sm text-white/80 font-medium">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/stories" className="md:hidden mt-8 w-full py-4 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-100 block text-center">
          View All Categories
        </Link>
      </div>
    </section>
  );
}
