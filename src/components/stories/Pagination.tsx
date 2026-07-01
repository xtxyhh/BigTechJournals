import React from "react";
import { Loader2 } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  totalStories: number;
  shownStories: number;
}

export default function Pagination({
  onLoadMore,
  isLoadingMore = false,
  totalStories,
  shownStories,
}: PaginationProps) {
  if (shownStories >= totalStories) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-8 border-t border-white/[0.08] flex flex-col items-center">
      <p className="text-white/45 text-sm font-medium mb-6">
        Showing {shownStories} of {totalStories} stories
      </p>

      <button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="group relative flex min-h-11 items-center gap-2 overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.05] px-8 py-3 font-medium text-white/75 transition-all hover:border-accent-blue/40 hover:text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.18)] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative z-10 flex items-center gap-2">
          {isLoadingMore ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more...
            </>
          ) : (
            <>Load More Stories</>
          )}
        </span>
      </button>
    </div>
  );
}