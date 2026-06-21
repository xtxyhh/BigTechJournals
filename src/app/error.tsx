"use client";

import { RouteState } from "@/components/RouteState";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteState
      eyebrow="Something slipped"
      title="This page did not load cleanly."
      description="The content is safe, but this route hit a runtime issue. Try again, or head back to the story library while we recover."
      action={reset}
      actionLabel="Reload page"
      secondaryHref="/stories"
      secondaryLabel="Explore stories"
    />
  );
}
