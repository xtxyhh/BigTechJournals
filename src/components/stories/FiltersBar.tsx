import React from "react";
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
    <div className="sticky top-[4.5rem] z-30 mb-8 border-y border-white/[0.08] bg-[#050816]/88 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => !readOnly && onSelectCategory(category)}
                disabled={readOnly && selectedCategory !== category}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : readOnly
                      ? "hidden cursor-not-allowed bg-transparent text-white/25"
                      : "border border-white/[0.08] bg-white/[0.05] text-white/62 hover:border-blue-300/35 hover:text-white",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:block text-sm text-white/35 font-medium">
            Sort by
          </span>
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSelectSort(option)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedSort === option
                  ? "bg-blue-500/15 text-blue-200"
                  : "text-white/50 hover:text-white",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
