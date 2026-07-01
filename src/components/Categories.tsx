"use client";
import React, { type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface CategoryItem {
  label: string;
  slug: string;
  image: string;
  count: string;
  storyCount?: number;
}

interface CategoriesProps {
  categories?: CategoryItem[];
}

const CATEGORY_COVERS: Record<string, string> = {
  "big-tech": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  "interview-experiences": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
  internships: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85",
  dsa: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
  "system-design": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
  "ai-ml": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
  resume: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=85",
  resources: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  startups: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=85",
  growth: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
};

const FALLBACK: CategoryItem[] = [
  { label: "Internships", slug: "internships", image: CATEGORY_COVERS.internships, count: "120+ Stories", storyCount: 120 },
  { label: "Big Tech", slug: "big-tech", image: CATEGORY_COVERS["big-tech"], count: "350+ Stories", storyCount: 350 },
  { label: "Startups", slug: "startups", image: CATEGORY_COVERS.startups, count: "80+ Stories", storyCount: 80 },
  { label: "Career Growth", slug: "growth", image: CATEGORY_COVERS.growth, count: "150+ Stories", storyCount: 150 },
  { label: "AI & ML", slug: "ai-ml", image: CATEGORY_COVERS["ai-ml"], count: "90+ Stories", storyCount: 90 },
];

const PLACEHOLDER_IMAGES = new Set<string>([
  DEFAULT_IMAGES.categoryInternships,
  DEFAULT_IMAGES.categoryTech,
  DEFAULT_IMAGES.categoryCareer,
  DEFAULT_IMAGES.storyCover,
]);

function categoryCover(category: CategoryItem) {
  const image = safeImageUrl(category.image, CATEGORY_COVERS["big-tech"]);
  if (!PLACEHOLDER_IMAGES.has(image)) return image;

  const normalizedLabel = category.label.toLowerCase();
  const matchedKey = Object.keys(CATEGORY_COVERS).find((key) => {
    const words = key.replace("-", " ");
    return category.slug === key || normalizedLabel.includes(words);
  });

  return CATEGORY_COVERS[matchedKey ?? "big-tech"];
}

function handleTilt(event: PointerEvent<HTMLAnchorElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
  card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
  card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
  card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
}

function resetTilt(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

export default function Categories({ categories = FALLBACK }: CategoriesProps) {
  const visibleCategories = categories
    .filter((category) => category.storyCount === undefined || category.storyCount > 0)
    .sort((a, b) => (b.storyCount ?? 0) - (a.storyCount ?? 0));

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
          {visibleCategories.map((category) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.slug}
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
              style={{ "--tilt-x": "0deg", "--tilt-y": "0deg", "--glow-x": "50%", "--glow-y": "50%" } as CSSProperties}
              className="category-premium-card group relative h-56 w-full overflow-hidden rounded-[20px] border border-white/[0.1] bg-white/[0.055] p-2 shadow-card backdrop-blur-xl sm:h-64 lg:h-80"
            >
              <div className="absolute inset-2 overflow-hidden rounded-[18px] bg-surface-elevated">
                <Image
                  src={categoryCover(category)}
                  alt={category.label}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-2 rounded-[18px] bg-gradient-to-t from-black/90 via-black/45 to-black/10 opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
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
