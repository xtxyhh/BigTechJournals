"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface SpotlightStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  authorRole: string;
  category: string;
}

interface WeeklySpotlightProps {
  stories?: SpotlightStory[];
}

/* ── Tilt card with pointer tracking ── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    x.set((clientX - rect.left) / rect.width - 0.5);
    y.set((clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WeeklySpotlight({ stories = [] }: WeeklySpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current || !stories.length) return;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      const newIndex = Math.min(Math.floor(scrollProgress * stories.length), stories.length - 1);
      setActiveIndex(Math.max(0, newIndex));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, stories.length]);

  if (!stories.length) return null;

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % stories.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);

  const activeStory = stories[activeIndex];
  const coverImage = safeImageUrl(activeStory.coverImage, DEFAULT_IMAGES.storyCover);

  /* ── DESKTOP (unchanged) ── */
  if (!isMobile) {
    return (
      <section
        ref={containerRef}
        className="sticky top-20 z-40 min-h-screen flex items-center justify-center bg-surface py-20 px-4 sm:px-6 lg:px-8"
        style={{ height: `${stories.length * 100}vh` }}
      >
        <div className="w-full max-w-6xl">
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-semibold text-blue-400 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Weekly Spotlight
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight"
              >
                Featured Stories
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-base text-white/50 max-w-md mx-auto"
              >
                Scroll through curated stories from industry leaders
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotateX: 4, rotateY: -4, scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full max-w-2xl perspective-[2000px]"
            >
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 rounded-[60px] bg-blue-500/20 blur-[120px]" />
                <div className="absolute inset-0 rounded-[60px] bg-cyan-500/15 blur-[160px]" />
                <div className="absolute inset-0 rounded-[60px] bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-purple-500/10 blur-[220px] animate-pulse" />
              </div>
              <div className="relative rounded-[56px] bg-surface-elevated/80 backdrop-blur-xl p-5 border border-cyan-500/20 shadow-[0_0_80px_rgba(59,130,246,0.18)]">
                <div className="relative rounded-[48px] aspect-[10/16] overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative w-full h-full"
                    >
                      <Image src={coverImage} alt={activeStory.title} fill className="object-cover" priority={activeIndex === 0} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">{activeStory.category}</motion.p>
                        <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-xl font-bold line-clamp-3 mb-3 leading-tight">{activeStory.title}</motion.h3>
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="text-sm text-white/70">{activeStory.authorName}</motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/30">
                <p className="text-sm text-white/60 text-center line-clamp-2 leading-relaxed">{activeStory.excerpt}</p>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex flex-col items-center gap-6 mt-16 w-full max-w-md">
              <div className="flex items-center justify-between w-full px-8">
                <div className="text-center">
                  <motion.p key={activeIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white tracking-tight">{String(activeIndex + 1).padStart(2, "0")}</motion.p>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">of {String(stories.length).padStart(2, "0")}</p>
                </div>
                <div className="flex-1 mx-8">
                  <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" animate={{ width: `${((activeIndex + 1) / stories.length) * 100}%` }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePrev} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"><ChevronLeft className="w-5 h-5" /></motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"><ChevronRight className="w-5 h-5" /></motion.button>
                </div>
              </div>
              <Link href={`/stories/${activeStory.slug}`} className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-sm tracking-wide">Read Full Story</Link>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  /* ══════════════════════════════════════════════
     MOBILE / TABLET  — Futuristic 3-D redesign
  ══════════════════════════════════════════════ */
  return (
    <section className="relative overflow-hidden bg-[#060910] py-14 px-4">

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-[90px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-[90px]" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-lg mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
            </span>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-[0.18em]">Weekly Spotlight</span>
          </div>

          <h2 className="text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-white mb-3">
            Featured{" "}
            <span
              className="relative inline-block"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#22d3ee 100%)",
              }}
            >
              Stories
            </span>
          </h2>
          <p className="text-sm text-white/40 tracking-wide">
            {String(activeIndex + 1).padStart(2, "0")} of {String(stories.length).padStart(2, "0")} curated journeys
          </p>
        </motion.div>

        {/* ── 3-D Tilt Card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard className="relative w-full">
              {/* Glow ring behind the card */}
              <div className="absolute -inset-px rounded-[32px] bg-gradient-to-br from-blue-500/50 via-violet-500/30 to-cyan-400/50 blur-sm -z-10" />
              <div className="absolute -inset-3 rounded-[40px] bg-blue-500/10 blur-2xl -z-20" />

              {/* Card shell */}
              <div
                className="relative rounded-[30px] overflow-hidden border border-white/10"
                style={{
                  background: "linear-gradient(145deg,rgba(14,20,40,0.95) 0%,rgba(8,12,28,0.98) 100%)",
                  boxShadow: "0 30px 80px rgba(59,130,246,0.25), 0 0 0 1px rgba(96,165,250,0.15) inset",
                }}
              >
                {/* Cover image */}
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={safeImageUrl(activeStory.coverImage, DEFAULT_IMAGES.storyCover)}
                    alt={activeStory.title}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Layered overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060910] via-[#060910]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />

                  {/* Top-right counter chip */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15 bg-black/50">
                    <span className="text-[10px] font-bold text-white/90 tabular-nums tracking-widest">
                      {String(activeIndex + 1).padStart(2, "0")}/{String(stories.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Top-left category */}
                  <motion.div
                    key={activeStory.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-300 border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md"
                  >
                    {activeStory.category}
                  </motion.div>
                </div>

                {/* Info panel below image */}
                <div className="px-6 pt-5 pb-7">
                  {/* Divider line with glow */}
                  <div className="h-px w-full mb-5" style={{ background: "linear-gradient(90deg,transparent,rgba(96,165,250,0.5),transparent)" }} />

                  <motion.h3
                    key={activeStory.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.45 }}
                    className="text-xl font-bold text-white leading-snug mb-2 line-clamp-2"
                  >
                    {activeStory.title}
                  </motion.h3>

                  <motion.p
                    key={activeStory.excerpt}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.45 }}
                    className="text-sm text-white/50 line-clamp-2 leading-relaxed mb-4"
                  >
                    {activeStory.excerpt}
                  </motion.p>

                  {/* Author row */}
                  <motion.div
                    key={activeStory.authorName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Avatar initials */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-200 shrink-0"
                        style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" }}
                      >
                        {activeStory.authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/90">{activeStory.authorName}</p>
                        {activeStory.authorRole && (
                          <p className="text-[10px] text-white/40">{activeStory.authorRole}</p>
                        )}
                      </div>
                    </div>

                    {/* Read story CTA */}
                    <Link
                      href={`/stories/${activeStory.slug}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                        boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
                      }}
                    >
                      Read Story
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress bar + nav ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex items-center gap-4"
        >
          {/* Prev */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-500/30 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Dot indicators */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {stories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: idx === activeIndex ? 28 : 6,
                  height: 6,
                  background:
                    idx === activeIndex
                      ? "linear-gradient(90deg,#3b82f6,#8b5cf6)"
                      : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Next */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-blue-500/30 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* ── Swipe hint ── */}
        <p className="text-center text-[10px] text-white/20 tracking-widest uppercase mt-5">
          Tap card to tilt · Swipe to navigate
        </p>
      </div>
    </section>
  );
}