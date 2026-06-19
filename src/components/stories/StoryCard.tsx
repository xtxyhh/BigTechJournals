import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Bookmark, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StoryCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: string;
  image: string;
  outcome?: {
    type: "positive" | "neutral" | "negative";
    text: string;
  };
  careerStage?: string;
  author?: {
    name: string;
    role: string;
  };
}

export default function StoryCard({
  id,
  title,
  excerpt,
  category,
  readTime,
  views,
  image,
  outcome,
  careerStage,
}: StoryCardProps) {
  return (
    <Link href={`/stories/${id}`} className="block group h-full">
      <article className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-800 rounded-md shadow-sm">
              {category}
            </span>
            {careerStage && (
              <span className="px-2.5 py-1 text-xs font-medium bg-slate-900/80 backdrop-blur-sm text-white rounded-md shadow-sm">
                {careerStage}
              </span>
            )}
          </div>

          {/* Interaction Icons (Hover) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.preventDefault(); /* Like logic */
              }}
              title="Like"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full shadow-sm hover:bg-white hover:text-brand-blue transition-colors"
              onClick={(e) => {
                e.preventDefault(); /* Save logic */
              }}
              title="Save for later"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full shadow-sm hover:bg-white hover:text-brand-blue transition-colors"
              onClick={(e) => {
                e.preventDefault(); /* Share logic */
              }}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Outcome Badge */}
          {outcome && (
            <div
              className={cn(
                "inline-flex items-center self-start px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-3",
                outcome.type === "positive"
                  ? "bg-green-100 text-green-700"
                  : outcome.type === "negative"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700",
              )}
            >
              {outcome.text}
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors">
            {title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>

          {/* Footer Meta */}
          <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {views}
              </span>
            </div>
            <span className="text-brand-blue font-semibold group-hover:underline">
              Read Story →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
