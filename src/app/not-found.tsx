import { RouteState } from "@/components/RouteState";

export default function NotFound() {
  return (
    <RouteState
      eyebrow="404"
      title="This path does not exist yet."
      description="BigTechJournals is growing quickly. The page you opened is not available, but the story library is ready."
      primaryHref="/stories"
      primaryLabel="Start reading"
      secondaryHref="/"
      secondaryLabel="Back home"
    />
  );
}
