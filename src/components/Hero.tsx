"use client";
import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { TypewriterEffect } from "./ui/typewriter-effect";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  spotlight?: {
    title: string;
    author: string;
    role: string;
    slug: string;
    coverImage: string;
  } | null;
}

export default function Hero({ spotlight }: HeroProps) {
  const words = [
    {
      text: "Real",
    },
    {
      text: "Journeys.",
    },
    {
      text: "Real",
    },
    {
      text: "Guidance.",
    },
    {
      text: "Your",
    },
    {
      text: "Roadmap",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "to",
    },
    {
      text: "Big",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Tech.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] relative">
      <ContainerScroll
        titleComponent={
          <>
            <div className="flex flex-col items-center justify-center mb-8">
              <button className="bg-slate-900 no-underline group cursor-pointer relative shadow-2xl shadow-blue-500/20 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block mb-4 transition-transform hover:scale-105 duration-300">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-slate-900 py-0.5 px-4 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                  <span className="text-blue-200">✨ New Story Out Now</span>
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-blue-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </button>
              <TypewriterEffect words={words} />
            </div>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed tracking-tight">
              Stories. Interview Experiences. Preparation Guides. Resources.
              <br />
              <span className="font-bold text-slate-900">Everything in one place.</span>
            </p>
          </>
        }
      >
        <Image
          src={spotlight?.coverImage ?? "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top draggable-false shadow-2xl"
          draggable={false}
        />

        <Link href={spotlight ? `/stories/${spotlight.slug}` : "/stories"} className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-left block">
          <span className="px-3 py-1 bg-blue-600 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Weekly Spotlight
          </span>
          <h2 className="text-4xl text-white font-bold mb-2">
            {spotlight?.title ?? "How I cracked Morgan Stanley in 1st Year"}
          </h2>
          <p className="text-white/80 text-lg">
            {spotlight ? `${spotlight.author} • ${spotlight.role}` : "Yagna Kusumanchi • SDE Intern"}
          </p>
        </Link>
      </ContainerScroll>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 hidden md:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-xs uppercase tracking-widest font-medium">
          Scroll
        </span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </div>
  );
}
