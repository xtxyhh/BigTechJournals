"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type SaveContentButtonProps = {
  targetKey: "storyId" | "resourceId" | "internshipId" | "roadmapId" | "companyId";
  targetId: string;
};

export default function SaveContentButton({ targetKey, targetId }: SaveContentButtonProps) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/bookmarks?${targetKey}=${targetId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => setSaved(Boolean(payload?.bookmarked)))
      .catch(() => undefined);
  }, [targetKey, targetId]);

  const toggle = async () => {
    setBusy(true);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [targetKey]: targetId }),
    });
    if (res.ok) {
      const payload = await res.json();
      setSaved(Boolean(payload.bookmarked));
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-blue-300/35 hover:text-blue-200 disabled:opacity-60"
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-blue-300 text-blue-300" : ""}`} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
