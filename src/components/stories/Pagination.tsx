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
  currentPage,
  totalPages,
  onLoadMore,
  isLoadingMore = false,
  totalStories,
  shownStories,
}: PaginationProps) {
  if (shownStories >= totalStories) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 pt-8 border-t border-slate-100 flex flex-col items-center">
      <p className="text-slate-500 text-sm font-medium mb-6">
        Showing {shownStories} of {totalStories} stories
      </p>

      <button
        onClick={onLoadMore}
        disabled={isLoadingMore}
        className="group relative px-8 py-3 bg-white border border-slate-200 text-slate-900 font-medium rounded-full hover:border-slate-300 hover:shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
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
