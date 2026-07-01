"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortOptions: string[];
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  readOnly?: boolean;
}

export default function FiltersBar({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOptions,
  selectedSort,
  onSelectSort,
  readOnly = false,
}: FiltersBarProps) {
  return (
    <div className="sticky top-[4.5rem] z-30 mb-8 border-y border-white/[0.08] bg-surface/88 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => !readOnly && onSelectCategory(category)}
                  disabled={readOnly && !active}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "text-white"
                      : readOnly
                        ? "hidden cursor-not-allowed bg-transparent text-white/25"
                        : "border border-white/[0.08] bg-white/[0.05] text-white/62 hover:border-accent-blue/35 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filters-active-category"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-blue shadow-[0_0_20px_rgba(37,99,235,0.45)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:block text-sm text-white/35 font-medium">
            Sort by
          </span>
          {sortOptions.map((option) => {
            const active = selectedSort === option;
            return (
              <button
                key={option}
                onClick={() => onSelectSort(option)}
                className={cn(
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active ? "text-accent-blue" : "text-white/50 hover:text-white",
                )}
              >
                {option}
                <span
                  className={cn(
                    "absolute left-3 right-3 -bottom-0.5 h-px bg-accent-blue transition-transform duration-300 origin-left",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}