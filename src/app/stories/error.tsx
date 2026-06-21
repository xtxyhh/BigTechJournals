"use client";

import { RouteState } from "@/components/RouteState";

export default function StoriesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteState
      eyebrow="Stories"
      title="Stories are taking a moment."
      description="The story library could not load on this attempt. Refresh the route and we will try the feed again."
      action={reset}
      actionLabel="Reload stories"
      secondaryHref="/"
      secondaryLabel="Back home"
    />
  );
}
