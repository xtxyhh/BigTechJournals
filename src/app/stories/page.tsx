import { Suspense } from "react";
import StoriesPageContent from "./StoriesPageContent";

export default function StoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-32 text-center text-slate-500">Loading stories...</div>}>
      <StoriesPageContent />
    </Suspense>
  );
}
