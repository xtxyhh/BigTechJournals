"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden bg-[#060910] px-4 pb-12 pt-16 text-white sm:px-6 sm:pt-20 lg:pt-24">
      <h1 className="sr-only">BigTechJournals - Your Roadmap to Big Tech.</h1>

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-blue-500/10 blur-[80px]" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-7xl content-start items-center gap-8 sm:gap-10">

        {/* ── Text block ── */}
        <div className="mx-auto max-w-4xl text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              Weekly stories from real engineers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 overflow-hidden"
          >
            <h2
              className="text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: "white" }}
            >
              Your Roadmap to{" "}
              <span
                style={{
                  WebkitTextFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  backgroundImage: "linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#22d3ee 100%)",
                  display: "inline-block",
                }}
              >
                Big-Tech
              </span>
              !
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-white/50 sm:text-base md:text-lg"
          >
            {subtitle ??
              "Real stories, internships, resources and roadmaps from engineers at Google, Microsoft, Amazon, Adobe and more. Everything you need to move with conviction."}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            {/* Primary */}
            <Link
              href="/stories"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                boxShadow: "0 4px 24px rgba(37,99,235,0.45)",
              }}
            >
              Start Reading
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* Secondary */}
            <Link
              href="/trending"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:text-white"
            >
              Explore Stories <BookOpen className="h-4 w-4" />
            </Link>

            {/* Tertiary (hidden on mobile) */}
            <Link
              href="/stories?search=journey"
              className="hidden min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Watch Journeys <PlayCircle className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* ── Spotlight card ── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-6xl"
        >
          {/* Outer glow */}
          <div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-blue-500/40 via-violet-500/20 to-cyan-400/40 blur-sm -z-10" />
          <div className="absolute -inset-4 rounded-[48px] bg-blue-500/8 blur-2xl -z-20" />

          <Link
            href={spotlight ? `/stories/${spotlight.slug}` : "/stories"}
            className="group relative block"
          >
            {/* Card shell */}
            <div
              className="relative overflow-hidden rounded-[32px] border border-white/10 p-3 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-blue-400/25"
              style={{
                background: "linear-gradient(145deg,rgba(14,20,40,0.95) 0%,rgba(8,12,28,0.98) 100%)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(96,165,250,0.12) inset",
              }}
            >
              {/* Image area */}
              <div className="relative aspect-[16/8] overflow-hidden rounded-[24px]">
                <Image
                  src={spotlightImage}
                  alt={spotlightTitle}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1400px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Subtle blue tint on left */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 to-transparent" />

                {/* Content overlay — left side */}
                <div className="absolute left-6 top-6 max-w-xl sm:left-10 sm:top-10">

                  {/* Weekly Spotlight badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
                      Weekly Spotlight
                    </span>
                  </div>

                  {/* Glowing divider */}
                  <div
                    className="my-4 h-px w-24"
                    style={{ background: "linear-gradient(90deg,rgba(96,165,250,0.7),transparent)" }}
                  />

                  <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {spotlightTitle}
                  </h2>

                  <p className="mt-3 text-sm text-white/60 sm:text-base">
                    {spotlight
                      ? `${spotlight.author} · ${spotlight.role}`
                      : "Featured Engineer"}
                  </p>

                  <div
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300 group-hover:gap-3"
                    style={{
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                    }}
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Stats panel — right side (desktop only) */}
                <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
                  {[
                    { value: "63+", label: "Stories" },
                    { value: "20,000+", label: "Audience" },
                    { value: "Weekly", label: "Updates" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 p-5 backdrop-blur-xl"
                      style={{
                        background: "rgba(8,12,28,0.7)",
                        boxShadow: "0 0 0 1px rgba(96,165,250,0.08) inset",
                      }}
                    >
                      <div
                        className="text-3xl font-extrabold"
                        style={{
                          WebkitTextFillColor: "transparent",
                          WebkitBackgroundClip: "text",
                          backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa)",
                        }}
                      >
                        {value}
                      </div>
                      <div className="mt-0.5 text-xs text-white/50 tracking-wide">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom accent bar */}
              <div
                className="mt-3 h-px w-full rounded-full opacity-60"
                style={{ background: "linear-gradient(90deg,transparent,rgba(96,165,250,0.4),rgba(167,139,250,0.4),transparent)" }}
              />
            </div>
          </Link>
        </motion.div>

        {/* ── Mobile stats row (shown below card on small screens) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-6 xl:hidden"
        >
          {[
            { value: "63+", label: "Stories" },
            { value: "20,000+", label: "Audience" },
            { value: "Weekly", label: "Updates" },
          ].map(({ value, label }, i) => (
            <React.Fragment key={label}>
              <div className="text-center">
                <p
                  className="text-xl font-extrabold sm:text-2xl"
                  style={{
                    WebkitTextFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa)",
                  }}
                >
                  {value}
                </p>
                <p className="text-[11px] text-white/40 tracking-wide mt-0.5">{label}</p>
              </div>
              {i < 2 && (
                <div className="h-8 w-px bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

      </div>
    </section>
  );
}