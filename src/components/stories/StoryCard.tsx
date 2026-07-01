"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Bookmark, Share2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { storyImageStyle, type StoryImagePlacement } from "@/lib/story-image";

export interface StoryCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  views: string;
  image: string;
  imagePlacement?: StoryImagePlacement;
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
  imagePlacement,
  outcome,
  careerStage,
}: StoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const rotateX = ((py - rect.height / 2) / rect.height) * -7;
    const rotateY = ((px - rect.width / 2) / rect.width) * 7;

    cardRef.current.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px}px ${py}px, rgba(59,130,246,0.28), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "translateY(0px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/stories/${id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.25s ease-out" }}
      className="block group h-full"
    >
      <article className="h-full flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden transition-shadow duration-200 hover:shadow-card-hover relative">
        {/* cursor-following glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* glowing edge ring on hover */}
        <div className="absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-accent-blue/0 group-hover:ring-accent-blue/40 transition-all duration-300 pointer-events-none" />

        <div className="relative w-full aspect-video overflow-hidden bg-surface-elevated">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={storyImageStyle(imagePlacement)}
            className="transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          {/* one-shot shine sweep across the thumbnail on hover */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-y-10 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[300%] transition-all duration-700 ease-out" />
          </div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-surface-card/90 backdrop-blur-sm text-white rounded-md shadow-sm border border-white/[0.06]">
              {category}
            </span>
            {careerStage && (
              <span className="px-2.5 py-1 text-xs font-medium bg-surface-elevated/80 backdrop-blur-sm text-white rounded-md shadow-sm">
                {careerStage}
              </span>
            )}
          </div>

          <div
            className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0"
            aria-hidden="true"
          >
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm hover:text-accent-blue transition-colors">
              <Heart className="w-4 h-4" />
            </span>
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm hover:text-accent-blue transition-colors">
              <Bookmark className="w-4 h-4" />
            </span>
            <span className="p-2 bg-surface-card/90 backdrop-blur-sm text-surface-muted rounded-full shadow-sm hover:text-accent-blue transition-colors">
              <Share2 className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col relative z-10">
          {outcome && (
            <div
              className={cn(
                "inline-flex items-center self-start px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-3",
                outcome.type === "positive"
                  ? "bg-green-500/20 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.25)]"
                  : outcome.type === "negative"
                    ? "bg-red-500/20 text-red-400 shadow-[0_0_12px_rgba(248,113,113,0.25)]"
                    : "bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)]",
              )}
            >
              {outcome.text}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-accent-blue transition-colors duration-200">
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
