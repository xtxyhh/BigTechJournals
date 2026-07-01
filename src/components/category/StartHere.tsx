"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

interface StartHereItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
}

interface StartHereProps {
  items: StartHereItem[];
}

export default function StartHere({ items }: StartHereProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-brand-blue rounded text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]">
          <Star className="w-4 h-4 fill-current" />
        </div>
        <h2 className="text-lg font-bold text-white uppercase tracking-wide">
          Start Here
        </h2>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: "1200px" }}
      >
        {items.map((item, index) => (
          <StartHereCard
            key={item.id}
            item={item}
            featured={index === 0 && items.length > 2}
          />
        ))}
      </div>
    </section>
  );
}

function StartHereCard({
  item,
  featured,
}: {
  item: StartHereItem;
  featured: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const rotateX = ((py - rect.height / 2) / rect.height) * -10;
    const rotateY = ((px - rect.width / 2) / rect.width) * 10;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px}px ${py}px, rgba(59,130,246,0.35), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/stories/${item.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.2s ease-out" }}
      className={`group relative rounded-2xl overflow-hidden border border-surface bg-surface-card hover:shadow-card-hover transition-shadow duration-300 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Cursor-following glow, blended on top */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-20 pointer-events-none mix-blend-screen transition-opacity duration-300 opacity-0 group-hover:opacity-100"
      />

      <div className="flex flex-col h-full relative z-10">
        <div
          className={`relative w-full ${
            featured ? "aspect-video md:aspect-[2.33]" : "aspect-video"
          } overflow-hidden bg-surface-elevated`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="inline-block px-2 py-1 bg-brand-blue text-xs font-bold rounded mb-3 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]">
              ESSENTIAL READ
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3
            className={`font-bold text-white group-hover:text-accent-blue transition-colors mb-2 ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {item.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {item.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between text-xs font-medium text-muted">
            <span>{item.readTime}</span>
            <span className="flex items-center gap-1 text-white group-hover:translate-x-1 group-hover:text-accent-blue transition-all">
              Read Story <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Glowing edge ring on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent-blue/0 group-hover:ring-accent-blue/40 transition-all duration-300 pointer-events-none" />
    </Link>
  );
}