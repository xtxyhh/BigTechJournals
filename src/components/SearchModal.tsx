"use client";

import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearch } from "@/hooks/useStories";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { query, setQuery, results, loading } = useSearch();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search stories, companies, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none placeholder:text-slate-400"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {!query.trim() && (
            <p className="text-sm text-slate-400 text-center py-8">
              Start typing to search stories, companies, and categories
            </p>
          )}

          {results && query.trim() && (
            <>
              {results.stories.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Stories</p>
                  {results.stories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/stories/${s.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium text-slate-900">{s.title}</p>
                      <p className="text-sm text-slate-500">{s.authorName}</p>
                    </Link>
                  ))}
                </div>
              )}

              {results.companies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Companies</p>
                  {results.companies.map((c) => (
                    <Link
                      key={c.id}
                      href={`/company/${c.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium text-slate-900">{c.name}</p>
                    </Link>
                  ))}
                </div>
              )}

              {results.categories.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">Categories</p>
                  {results.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium text-slate-900">{c.name}</p>
                    </Link>
                  ))}
                </div>
              )}

              {!results.stories.length && !results.companies.length && !results.categories.length && (
                <p className="text-sm text-slate-400 text-center py-8">No results found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn("p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors", className)}
      >
        <Search className="w-5 h-5" />
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
