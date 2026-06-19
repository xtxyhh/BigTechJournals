import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

interface StartHereItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
}

interface StartHereProps {
  items: StartHereItem[];
}

export default function StartHere({ items }: StartHereProps) {
  if (!items || items.length === 0) return null;

  // Use the first item as the main feature, others as secondary if we have more than 1
  // For now, let's just show up to 3 cards in a distinctive grid

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-brand-blue rounded text-white shadow-sm">
          <Star className="w-4 h-4 fill-current" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
          Start Here
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/stories/${item.id}`}
            className={`group relative rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 ${
              index === 0 && items.length > 2 ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex flex-col h-full">
              <div
                className={`relative w-full ${index === 0 && items.length > 2 ? "aspect-video md:aspect-[2.33]" : "aspect-video"} overflow-hidden bg-slate-100`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Overlay Text for visual weight */}
                <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-2 py-1 bg-brand-blue text-xs font-bold rounded mb-3">
                    ESSENTIAL READ
                  </span>
                  {/* Only show title overlay on the main large card if it exists, otherwise hide checks */}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3
                  className={`font-bold text-slate-900 group-hover:text-brand-blue transition-colors mb-2 ${index === 0 && items.length > 2 ? "text-2xl" : "text-xl"}`}
                >
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{item.readTime}</span>
                  <span className="flex items-center gap-1 text-slate-900 group-hover:translate-x-1 transition-transform">
                    Read Story <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
