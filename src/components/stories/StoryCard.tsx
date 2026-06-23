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
      <article className="h-full flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.01] relative">
        <div className="relative w-full aspect-video overflow-hidden bg-surface-elevated">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-surface-card/90 backdrop-blur-sm text-white rounded-md shadow-sm">
              {category}
            </span>
            {careerStage && (
              <span className="px-2.5 py-1 text-xs font-medium bg-surface-elevated/80 backdrop-blur-sm text-white rounded-md shadow-sm">
                {careerStage}
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0" aria-hidden="true">
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm">
              <Heart className="w-4 h-4" />
            </span>
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm">
              <Bookmark className="w-4 h-4" />
            </span>
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm">
              <Share2 className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          {outcome && (
            <div
              className={cn(
                "inline-flex items-center self-start px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-3",
                outcome.type === "positive"
                  ? "bg-green-500/20 text-green-400"
                  : outcome.type === "negative"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400",
              )}
            >
              {outcome.text}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-brand-blue transition-colors duration-200">
            {title}
          </h3>

          <p className="text-surface-muted text-sm leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-surface-muted font-medium pt-4 border-t border-surface-border">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
              Read Story
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
