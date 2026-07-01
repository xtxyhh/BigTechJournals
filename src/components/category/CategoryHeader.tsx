"use client";

import React, { useRef } from "react";
import { Users, BookOpen, Briefcase } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  description: string;
  stats: {
    count: string;
    audience: string;
    outcomes: string;
  };
}

export default function CategoryHeader({
  title,
  description,
  stats,
}: CategoryHeaderProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const blobCRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!sectionRef.current) return;

    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    if (blobARef.current) {
      blobARef.current.style.transform = `translate3d(${x * 50}px, ${y * 50}px, 0)`;
    }
    if (blobBRef.current) {
      blobBRef.current.style.transform = `translate3d(${x * -70}px, ${y * -35}px, 0)`;
    }
    if (blobCRef.current) {
      blobCRef.current.style.transform = `translate3d(${x * 35}px, ${y * -55}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    [blobARef, blobBRef, blobCRef].forEach((ref) => {
      if (ref.current) ref.current.style.transform = "translate3d(0px, 0px, 0)";
    });
  };

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-20 md:py-28 px-6 overflow-hidden bg-aurora"
    >
      {/* Animated aurora wash */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-soft-light animate-aurora pointer-events-none [background-image:repeating-linear-gradient(100deg,#3b82f6_10%,#818cf8_15%,#38bdf8_20%,#a78bfa_25%,#60a5fa_30%)] [background-size:300%_200%]"
      />

      {/* Faint dot grid for depth */}
      <div className="absolute inset-0 opacity-40 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Parallax glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div
          ref={blobARef}
          className="absolute -top-24 left-[8%] w-[26rem] h-[26rem] bg-brand-blue/30 rounded-full blur-3xl transition-transform duration-300 ease-out"
        />
        <div
          ref={blobBRef}
          className="absolute top-6 right-[10%] w-72 h-72 bg-accent-blue/25 rounded-full blur-3xl transition-transform duration-300 ease-out"
        />
        <div
          ref={blobCRef}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-300 ease-out"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-semibold tracking-widest uppercase text-accent-blue bg-accent-blue/10 border border-accent-blue/20">
          Category
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-accent-blue drop-shadow-[0_0_30px_rgba(59,130,246,0.25)]">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          {description}
        </p>

        {/* Context Strip */}
        <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-xl bg-white/[0.04] border border-surface shadow-card">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/15">
              <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
            </span>
            <span className="text-white/90">{stats.count}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/15">
              <Users className="w-3.5 h-3.5 text-brand-blue" />
            </span>
            <span className="text-white/90">{stats.audience}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-white/20 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue/15">
              <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
            </span>
            <span className="text-white/90">{stats.outcomes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}