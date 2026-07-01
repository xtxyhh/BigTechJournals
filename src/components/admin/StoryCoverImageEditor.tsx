"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Maximize2, Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import StoryCard from "@/components/stories/StoryCard";
import MediaUploader from "@/components/admin/MediaUploader";
import {
  DEFAULT_STORY_IMAGE_PLACEMENT,
  makeObjectPosition,
  normalizeStoryImagePlacement,
  storyImageStyle,
  type StoryImageCropMode,
  type StoryImagePlacement,
} from "@/lib/story-image";

type PreviewMode = "desktop" | "tablet" | "mobile";

type StoryCoverImageEditorProps = {
  image: string;
  placement: StoryImagePlacement;
  title: string;
  excerpt: string;
  onImageChange: (url: string) => void;
  onPlacementChange: (placement: StoryImagePlacement) => void;
};

const previewSizes: Record<PreviewMode, string> = {
  desktop: "max-w-3xl",
  tablet: "max-w-xl",
  mobile: "max-w-xs",
};

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export default function StoryCoverImageEditor({
  image,
  placement,
  title,
  excerpt,
  onImageChange,
  onPlacementChange,
}: StoryCoverImageEditorProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const dragStart = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const normalized = normalizeStoryImagePlacement(placement);

  const updatePosition = (nextX: number, nextY: number) => {
    const x = Math.min(100, Math.max(0, nextX));
    const y = Math.min(100, Math.max(0, nextY));
    onPlacementChange({
      ...normalized,
      x,
      y,
      objectPosition: makeObjectPosition(x, y),
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!image) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, startX: normalized.x, startY: normalized.y };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = ((event.clientX - dragStart.current.x) / event.currentTarget.clientWidth) * -100;
    const dy = ((event.clientY - dragStart.current.y) / event.currentTarget.clientHeight) * -100;
    updatePosition(dragStart.current.startX + dx, dragStart.current.startY + dy);
  };

  const stopDragging = () => {
    dragStart.current = null;
  };

  const setMode = (cropMode: StoryImageCropMode) => {
    onPlacementChange({ ...normalized, cropMode });
  };

  return (
    <div className="space-y-4">
      <MediaUploader label="Cover image" value={image} onChange={onImageChange} />

      <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Story card cover editor</p>
            <p className="mt-1 text-xs text-white/45">Drag the preview to set focus. Use the guides to keep faces and titles clear.</p>
          </div>
          <button
            type="button"
            onClick={() => onPlacementChange(DEFAULT_STORY_IMAGE_PLACEMENT)}
            className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/[0.08] px-3 text-sm text-white/65 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className={`mx-auto w-full ${previewSizes[previewMode]}`}>
            <div
              role="application"
              aria-label="Drag to reposition cover image"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              className="relative aspect-video cursor-grab overflow-hidden rounded-2xl border border-white/[0.1] bg-black/30 active:cursor-grabbing"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" draggable={false} className="h-full w-full select-none" style={storyImageStyle(normalized)} />
              ) : (
                <div className="grid h-full place-items-center bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-sm text-white/45">
                  Upload a cover image to edit framing
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-[12%] inset-y-[14%] rounded-xl border border-white/35" />
              <div className="pointer-events-none absolute inset-x-[6%] bottom-[10%] h-[22%] rounded-xl border border-blue-300/45 bg-blue-400/10" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-black/40" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {([
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewMode(mode)}
                  aria-label={`${mode} preview`}
                  className={`grid min-h-11 place-items-center rounded-2xl ${previewMode === mode ? "bg-blue-500 text-white" : "bg-black/20 text-white/55"}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-white/40">Zoom {normalized.zoom.toFixed(1)}x</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={normalized.zoom}
                onChange={(event) => onPlacementChange({ ...normalized, zoom: Number(event.target.value) })}
                className="w-full accent-blue-400"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(["cover", "contain"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setMode(mode)}
                  className={`min-h-11 rounded-2xl px-3 text-sm capitalize ${normalized.cropMode === mode ? "bg-blue-500 text-white" : "bg-black/20 text-white/65"}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-white/45">
              <span className="rounded-2xl bg-black/20 p-3">X {round(normalized.x)}%</span>
              <span className="rounded-2xl bg-black/20 p-3">Y {round(normalized.y)}%</span>
              <span className="col-span-2 rounded-2xl bg-black/20 p-3">Object {normalized.objectPosition}</span>
            </div>
          </div>
        </div>
      </div>

      {image && (
        <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Maximize2 className="h-4 w-4 text-blue-300" /> Live BigTechJournals card preview
          </div>
          <div className="max-w-sm">
            <StoryCard
              id="#"
              title={title || "Untitled story"}
              excerpt={excerpt || "Excerpt preview appears here."}
              category="Preview"
              readTime="5 min read"
              views="0"
              image={image}
              imagePlacement={normalized}
            />
          </div>
        </div>
      )}
    </div>
  );
}
