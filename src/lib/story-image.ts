export type StoryImageCropMode = "cover" | "contain";

export type StoryImagePlacement = {
  zoom: number;
  x: number;
  y: number;
  objectPosition: string;
  cropMode: StoryImageCropMode;
};

export const DEFAULT_STORY_IMAGE_PLACEMENT: StoryImagePlacement = {
  zoom: 1,
  x: 50,
  y: 50,
  objectPosition: "50% 50%",
  cropMode: "cover",
};

export function clampPercent(value: unknown, fallback = 50) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(100, Math.max(0, number));
}

export function clampZoom(value: unknown) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : DEFAULT_STORY_IMAGE_PLACEMENT.zoom;
  return Math.min(2.5, Math.max(1, number));
}

export function normalizeCropMode(value: unknown): StoryImageCropMode {
  return value === "contain" ? "contain" : "cover";
}

export function makeObjectPosition(x: number, y: number) {
  return `${clampPercent(x)}% ${clampPercent(y)}%`;
}

export function normalizeStoryImagePlacement(value?: Partial<StoryImagePlacement> | null): StoryImagePlacement {
  const x = clampPercent(value?.x);
  const y = clampPercent(value?.y);

  return {
    zoom: clampZoom(value?.zoom),
    x,
    y,
    objectPosition: value?.objectPosition || makeObjectPosition(x, y),
    cropMode: normalizeCropMode(value?.cropMode),
  };
}

export function storyImageStyle(value?: Partial<StoryImagePlacement> | null) {
  const placement = normalizeStoryImagePlacement(value);

  return {
    objectFit: placement.cropMode,
    objectPosition: placement.objectPosition,
    transform: `scale(${placement.zoom})`,
    transformOrigin: placement.objectPosition,
  };
}
