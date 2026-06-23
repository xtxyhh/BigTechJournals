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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05]"
            >
              <div className="h-48 bg-white/[0.08]" />
              <div className="p-6">
                <div className="mb-4 h-4 w-1/4 rounded bg-white/[0.08]" />
                <div className="mb-2 h-6 w-3/4 rounded bg-white/[0.08]" />
                <div className="mb-6 h-6 w-1/2 rounded bg-white/[0.08]" />
                <div className="mb-2 h-4 w-full rounded bg-white/[0.08]" />
                <div className="h-4 w-2/3 rounded bg-white/[0.08]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 py-20 text-center">
        <h3 className="text-2xl font-semibold text-white mb-2">
          No stories found for this category yet.
        </h3>
        <p className="text-white/58 mb-8">
          We are curating real journeys. Check back soon or try another filter.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-blue-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-400"
        >
          Explore other categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {stories.map((story) => (
          <div key={story.id}>
            <StoryCard {...story} />
          </div>
        ))}
      </div>
    </div>
  );
}
