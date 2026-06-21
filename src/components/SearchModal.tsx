"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2, Command } from "lucide-react";
import Link from "next/link";
import { useSearch } from "@/hooks/useStories";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { query, setQuery, results, loading } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open, setQuery]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-surface-card rounded-2xl shadow-2xl shadow-blue-500/10 border border-white/[0.08] overflow-hidden animate-fade-up">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08]">
          <Search className="w-5 h-5 text-surface-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search stories, companies, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base sm:text-lg outline-none bg-transparent text-white placeholder:text-surface-muted/70"
            aria-label="Search query"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-surface-muted" aria-hidden="true" />}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-surface-muted bg-surface-elevated border border-white/[0.08] rounded">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-white/[0.05] rounded-lg transition-colors duration-200"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-surface-muted" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {!query.trim() && (
            <p className="text-sm text-surface-muted text-center py-8">
              Type to search stories, companies, resources, categories, and people
            </p>
          )}

          {results && query.trim() && (
            <>
              {results.stories.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-surface-muted uppercase tracking-wider px-3 py-2">Stories</p>
                  {results.stories.map((s) => (
                    <Link
                      key={s.id}
                      href={`/stories/${s.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-200"
                    >
                      <p className="font-medium text-white">{s.title}</p>
                      <p className="text-sm text-surface-muted">{s.authorName}</p>
                    </Link>
                  ))}
                </div>
              )}
              {results.companies.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-surface-muted uppercase tracking-wider px-3 py-2">Companies</p>
                  {results.companies.map((c) => (
                    <Link
                      key={c.id}
                      href={`/company/${c.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-200"
                    >
                      <p className="font-medium text-white">{c.name}</p>
                    </Link>
                  ))}
                </div>
              )}
              {results.categories.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-surface-muted uppercase tracking-wider px-3 py-2">Categories</p>
                  {results.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-200"
                    >
                      <p className="font-medium text-white">{c.name}</p>
                    </Link>
                  ))}
                </div>
              )}
              {results.resources.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-surface-muted uppercase tracking-wider px-3 py-2">Resources</p>
                  {results.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="block px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-200"
                    >
                      <p className="font-medium text-white">{resource.name}</p>
                      <p className="text-sm text-surface-muted">{resource.type}</p>
                    </a>
                  ))}
                </div>
              )}
              {results.users.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-muted uppercase tracking-wider px-3 py-2">People</p>
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      className="px-3 py-2.5 rounded-xl text-white/80"
                    >
                      <p className="font-medium text-white">{user.name ?? "BigTechJournals member"}</p>
                      <p className="text-sm text-surface-muted">Community profile</p>
                    </div>
                  ))}
                </div>
              )}
              {!results.stories.length && !results.companies.length && !results.categories.length && !results.resources.length && !results.users.length && (
                <p className="text-sm text-surface-muted text-center py-8">No results found</p>
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 p-2.5 text-surface-muted hover:bg-white/[0.05] rounded-full transition-colors duration-200",
          className,
        )}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-surface-muted bg-surface-elevated border border-white/[0.08] rounded">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
