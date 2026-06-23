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
        className="group relative flex min-h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-8 py-3 font-medium text-white/75 transition-all hover:border-blue-300/35 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-70"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more...
          </>
        ) : (
          <>Load More Stories</>
        )}
      </button>
    </div>
  );
}
