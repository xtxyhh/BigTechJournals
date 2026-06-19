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
    <div className="sticky top-18 z-30 mb-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
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
                    ? "bg-slate-900 text-white"
                    : readOnly
                      ? "bg-transparent text-slate-300 cursor-not-allowed hidden" // Hide other categories in read-only mode
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:block text-sm text-slate-400 font-medium">
            Sort by
          </span>
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSelectSort(option)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedSort === option
                  ? "bg-blue-50 text-brand-blue"
                  : "text-slate-500 hover:text-slate-900",
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
