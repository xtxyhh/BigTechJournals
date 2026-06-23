export const DEFAULT_IMAGES = {
  storyCover: "/images/placeholders/story-cover.svg",
  categoryInternships: "/images/placeholders/category-internships.svg",
  categoryTech: "/images/placeholders/category-tech.svg",
  categoryCareer: "/images/placeholders/category-career.svg",
  avatar: "/images/placeholders/avatar.svg",
  companyLogo: "/images/placeholders/company-logo.svg",
} as const;

export function safeImageUrl(value?: string | null, fallback: string = DEFAULT_IMAGES.storyCover) {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.includes("images.unsplash.com") || trimmed.includes("plus.unsplash.com")
    ? fallback
    : trimmed;
}
