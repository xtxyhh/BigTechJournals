import React from "react";
import StoryCard, { StoryCardProps } from "./StoryCard";

interface StoriesGridProps {
  stories: StoryCardProps[];
  isLoading?: boolean;
}

export default function StoriesGrid({
  stories,
  isLoading = false,
}: StoriesGridProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-96 animate-pulse"
            >
              <div className="h-48 bg-slate-200" />
              <div className="p-6">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-6" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 mb-12 py-20 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          No stories found for this category yet.
        </h3>
        <p className="text-slate-600 mb-8">
          We’re curating real journeys. Check back soon or try another filter.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
        >
          Explore other categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <div key={story.id}>
            <StoryCard {...story} />
          </div>
        ))}
      </div>
    </div>
  );
}
