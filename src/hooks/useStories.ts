"use client";

import { useState, useEffect, useCallback } from "react";
import type { StoryCardProps } from "@/components/stories/StoryCard";

interface UseStoriesOptions {
  category?: string;
  company?: string;
  featured?: boolean;
  sort?: "latest" | "most-viewed" | "trending";
  limit?: number;
}

export function useStories(options: UseStoriesOptions = {}) {
  const [stories, setStories] = useState<StoryCardProps[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.category) params.set("category", options.category);
      if (options.company) params.set("company", options.company);
      if (options.featured) params.set("featured", "true");
      if (options.sort) params.set("sort", options.sort);
      if (options.limit) params.set("limit", String(options.limit));
      params.set("page", String(page));

      const res = await fetch(`/api/stories?${params}`);
      if (!res.ok) throw new Error("Failed to fetch stories");
      const data = await res.json();
      setStories(data.stories);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.company, options.featured, options.sort, options.limit, page]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, total, totalPages, page, setPage, isLoading, error, refetch: fetchStories };
}

export function useLike(storyId: string) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?storyId=${storyId}`)
      .then((r) => (r.ok ? r.json() : { liked: false }))
      .then((d) => setLiked(d.liked))
      .catch(() => {});
  }, [storyId]);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      setLiked(data.liked);
    } finally {
      setLoading(false);
    }
  };

  return { liked, toggle, loading };
}

export function useBookmark(storyId: string) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/bookmarks?storyId=${storyId}`)
      .then((r) => (r.ok ? r.json() : { bookmarked: false }))
      .then((d) => setBookmarked(d.bookmarked))
      .catch(() => {});
  }, [storyId]);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      setBookmarked(data.bookmarked);
    } finally {
      setLoading(false);
    }
  };

  return { bookmarked, toggle, loading };
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    stories: { id: string; title: string; slug: string; authorName: string }[];
    companies: { id: string; name: string; slug: string; logo: string | null }[];
    categories: { id: string; name: string; slug: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, loading };
}
