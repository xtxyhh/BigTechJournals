import { Suspense } from "react";
import StoriesPageContent from "./StoriesPageContent";

export default function StoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816] pt-32 text-center text-white/55">Loading stories...</div>}>
      <StoriesPageContent />
    </Suspense>
  );
}
