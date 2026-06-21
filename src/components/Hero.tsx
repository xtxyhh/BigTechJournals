"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, PlayCircle } from "lucide-react";

interface HeroProps {
  spotlight?: {
    title: string;
    author: string;
    role: string;
    slug: string;
    coverImage: string;
  } | null;
  subtitle?: string;
}

export default function Hero({ spotlight, subtitle }: HeroProps) {
  const spotlightTitle = spotlight?.title ?? "How I cracked Morgan Stanley in 1st Year";
  const spotlightImage =
    spotlight?.coverImage ??
    "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80";

  return (
    <div className="flex flex-col overflow-hidden bg-surface bg-aurora relative">
      <h1 className="sr-only">Big Tech Journals — Real Journeys, Real Guidance, Your Roadmap to Big Tech</h1>
      <ContainerScroll
        titleComponent={
          <>
            <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 px-2">
              <div className="bg-surface-elevated no-underline group relative shadow-2xl shadow-blue-500/20 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block mb-4 transition-transform hover:scale-[1.02] duration-200">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-surface-elevated py-0.5 px-4 ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-200">
                  <span className="text-blue-200">✨ New Story Out Now</span>
                  <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
              <h1 className="max-w-5xl text-center text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Learn from people who cracked Big Tech.
              </h1>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-surface-muted mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed tracking-tight px-4">
              {subtitle ?? (
                <>
                  Real stories, internships, resources and roadmaps from engineers at Google, Microsoft, Amazon, Adobe and more.
                  <br />
                  <span className="font-bold text-white">Everything you need to move with conviction.</span>
                </>
              )}
            </p>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 px-4">
              <Link href="/stories" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">
                Start Reading <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/trending" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:text-white">
                Explore Stories <BookOpen className="h-4 w-4" />
              </Link>
              <Link href="/stories?search=journey" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:text-white">
                Watch Journeys <PlayCircle className="h-4 w-4" />
              </Link>
            </div>
          </>
        }
      >
        <Image
          src={spotlightImage}
          alt={spotlightTitle}
          height={720}
          width={1400}
          priority
          sizes="(max-width: 768px) 100vw, 1400px"
          className="mx-auto rounded-2xl object-cover h-full object-left-top draggable-false shadow-2xl"
          draggable={false}
        />

        <Link
          href={spotlight ? `/stories/${spotlight.slug}` : "/stories"}
          className="absolute bottom-0 left-0 w-full p-6 sm:p-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-left block"
        >
          <span className="px-3 py-1 bg-blue-600 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Weekly Spotlight
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 leading-tight">
            {spotlightTitle}
          </h2>
          <p className="text-white/80 text-sm sm:text-lg">
            {spotlight ? `${spotlight.author} • ${spotlight.role}` : "Yagna Kusumanchi • SDE Intern"}
          </p>
        </Link>
      </ContainerScroll>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-surface-muted hidden md:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </div>
  );
}
