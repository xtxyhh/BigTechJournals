import { RouteState } from "@/components/RouteState";

export default function StoryNotFound() {
  return (
    <RouteState
      eyebrow="Story not found"
      title="That story is not published."
      description="It may have moved, been archived, or still be waiting for editorial review."
      primaryHref="/stories"
      primaryLabel="Browse stories"
      secondaryHref="/submit"
      secondaryLabel="Share yours"
    />
  );
}
