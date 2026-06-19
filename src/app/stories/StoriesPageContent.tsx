"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import StoriesHeader from "@/components/stories/StoriesHeader";
import FiltersBar from "@/components/stories/FiltersBar";
import StoriesGrid from "@/components/stories/StoriesGrid";
import Pagination from "@/components/stories/Pagination";
import { StoryCardProps } from "@/components/stories/StoryCard";

const SORT_MAP: Record<string, string> = {
  Latest: "latest",
  "Most Viewed": "most-viewed",
  Trending: "trending",
};

export default function StoriesPageContent() {
  const searchParams = useSearchParams();
  const initialSort = searchParams.get("sort") === "most-viewed" ? "Most Viewed" : "Latest";
  const featured = searchParams.get("featured") === "true";

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [categorySlugs, setCategorySlugs] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [stories, setStories] = useState<StoryCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: { name: string; slug: string }[]) => {
        setCategories(["All", ...cats.map((c) => c.name)]);
        setCategorySlugs(Object.fromEntries(cats.map((c) => [c.name, c.slug])));
      });
  }, []);

  const fetchStories = useCallback(async (pageNum: number, append = false) => {
    setIsLoading(!append);
    if (append) setIsLoadingMore(true);

    const params = new URLSearchParams();
    params.set("page", String(pageNum));
    params.set("limit", "12");
    params.set("sort", SORT_MAP[selectedSort] ?? "latest");
    if (featured) params.set("featured", "true");
    if (selectedCategory !== "All") {
      const slug = categorySlugs[selectedCategory];
      if (slug) params.set("category", slug);
    }

    try {
      const res = await fetch(`/api/stories?${params}`);
      const data = await res.json();
      setStories(append ? (prev) => [...prev, ...data.stories] : data.stories);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedCategory, selectedSort, featured, categorySlugs]);

  useEffect(() => {
    setPage(1);
    fetchStories(1);
  }, [fetchStories]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStories(nextPage, true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <main className="pt-16">
        <StoriesHeader />
        <FiltersBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortOptions={["Latest", "Most Viewed", "Trending"]}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
        />
        <StoriesGrid stories={stories} isLoading={isLoading} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          totalStories={total}
          shownStories={stories.length}
        />
      </main>
    </div>
  );
}
