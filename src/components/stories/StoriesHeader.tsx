"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

export default function StoriesHeader() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);

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
      blobBRef.current.style.transform = `translate3d(${x * -60}px, ${y * -30}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    [blobARef, blobBRef].forEach((ref) => {
      if (ref.current) ref.current.style.transform = "translate3d(0px, 0px, 0)";
    });
  };

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden px-4 py-20 sm:px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_78%_20%,rgba(34,211,238,0.10),transparent_28%)]" />

      {/* Parallax glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div
          ref={blobARef}
          className="absolute -top-10 left-[12%] w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl transition-transform duration-300 ease-out animate-pulse"
        />
        <div
          ref={blobBRef}
          className="absolute top-10 right-[14%] w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl transition-transform duration-300 ease-out"
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.p
          className="mb-5 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          Real career intelligence
        </motion.p>
        <motion.h1
          className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-accent-blue drop-shadow-[0_0_30px_rgba(59,130,246,0.25)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Stories
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Real tech journeys, not advice written after success.
        </motion.p>
      </div>
    </div>
  );
}