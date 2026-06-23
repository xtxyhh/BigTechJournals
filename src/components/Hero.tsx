"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

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
  const spotlightImage = safeImageUrl(spotlight?.coverImage, DEFAULT_IMAGES.storyCover);

  return (
    <section className="relative overflow-hidden bg-surface bg-aurora px-4 pb-7 pt-16 text-white sm:px-6 sm:pb-9 sm:pt-20 lg:pt-22">
      <h1 className="sr-only">BigTechJournals - Your Roadmap to Big Tech.</h1>
      <div className="mx-auto grid max-w-7xl content-start items-center gap-5 sm:gap-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up inline-flex rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200 backdrop-blur-xl sm:px-4 sm:py-2 sm:text-xs">
            Weekly stories from real engineers
          </div>
          <div className="mt-4 overflow-hidden sm:mt-5">
            <p className="hero-line hero-line-3">Your Roadmap to Big-Tech!</p>
          </div>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-up px-1 text-sm leading-6 text-white/68 [animation-delay:520ms] sm:text-base md:text-lg">
            {subtitle ?? "Real stories, internships, resources and roadmaps from engineers at Google, Microsoft, Amazon, Adobe and more. Everything you need to move with conviction."}
          </p>
          <div className="mt-5 flex animate-fade-up flex-col items-stretch justify-center gap-3 [animation-delay:680ms] sm:flex-row sm:items-center">
            <Link href="/stories" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#050816] shadow-lg shadow-blue-500/15 transition hover:bg-blue-100">
              Start Reading <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/trending" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/78 backdrop-blur-xl transition hover:border-blue-300/35 hover:text-white">
              Explore Stories <BookOpen className="h-4 w-4" />
            </Link>
            <Link href="/stories?search=journey" className="hidden min-h-12 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/78 backdrop-blur-xl transition hover:border-blue-300/35 hover:text-white sm:inline-flex">
              Watch Journeys <PlayCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Link
          href={spotlight ? `/stories/${spotlight.slug}` : "/stories"}
          className="group relative mx-auto block w-full max-w-4xl overflow-hidden rounded-[20px] border border-white/[0.1] bg-white/[0.06] p-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-300/35 sm:rounded-[24px] sm:p-2"
        >
          <div className="relative aspect-[16/6.5] min-h-[145px] overflow-hidden rounded-[16px] sm:min-h-[210px] sm:rounded-[18px] lg:min-h-[245px]">
            <Image
              src={spotlightImage}
              alt={spotlightTitle}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover object-center transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/34 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-6">
              <span className="mb-2 inline-flex rounded-full bg-blue-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs">
                Weekly Spotlight
              </span>
              <h2 className="max-w-3xl text-lg font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
                {spotlightTitle}
              </h2>
              <p className="mt-1 text-xs text-white/76 sm:text-sm">
                {spotlight ? `${spotlight.author} - ${spotlight.role}` : "Yagna Kusumanchi - SDE Intern"}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
