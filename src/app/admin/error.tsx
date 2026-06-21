"use client";

import { RouteState } from "@/components/RouteState";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteState
      eyebrow="Admin"
      title="The workspace could not load."
      description="Your session is protected. Retry the admin workspace, or return to the public site."
      action={reset}
      actionLabel="Reload admin"
      secondaryHref="/"
      secondaryLabel="Public site"
    />
  );
}
