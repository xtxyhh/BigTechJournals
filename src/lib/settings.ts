import { db } from "./db";
import type { Prisma } from "@prisma/client";

export type SiteSettingsData = Awaited<ReturnType<typeof getSiteSettings>>;

export async function getSiteSettings() {
  let settings = await db.siteSettings.findUnique({ where: { id: "site" } });

  if (!settings) {
    settings = await db.siteSettings.create({ data: { id: "site" } });
  }

  return settings;
}

export async function updateSiteSettings(data: Partial<Omit<Awaited<ReturnType<typeof getSiteSettings>>, "id" | "updatedAt">>) {
  return db.siteSettings.upsert({
    where: { id: "site" },
    create: { id: "site", ...data },
    update: data,
  });
}

const defaultNavbarItems = [
  { label: "Stories", href: "/stories", sortOrder: 0 },
  { label: "Companies", href: "/companies", sortOrder: 1 },
  { label: "Internships", href: "/internships", sortOrder: 2 },
  { label: "Resources", href: "/resources", sortOrder: 3 },
  { label: "Trending", href: "/trending", sortOrder: 4 },
  { label: "About", href: "/about", sortOrder: 5 },
  { label: "Submit", href: "/submit", sortOrder: 6 },
];

const defaultFooterLinks = [
  { label: "Stories", href: "/stories", group: "Platform", sortOrder: 0 },
  { label: "Companies", href: "/companies", group: "Platform", sortOrder: 1 },
  { label: "Resources", href: "/resources", group: "Resources", sortOrder: 2 },
  { label: "Internships", href: "/internships", group: "Resources", sortOrder: 3 },
  { label: "Contact", href: "/contact", group: "Contact", sortOrder: 4 },
  { label: "Submit Story", href: "/submit", group: "Contact", sortOrder: 5 },
];

export type EditableLink = {
  id?: string;
  label: string;
  href: string;
  group?: string;
  external?: boolean;
};

export type EditableSettings = Awaited<ReturnType<typeof getEditableSettings>>;

function normalizeLink(item: EditableLink, sortOrder: number) {
  return {
    label: item.label.trim(),
    href: item.href.trim(),
    group: item.group?.trim() || "Platform",
    external: Boolean(item.external),
    sortOrder,
    enabled: true,
  };
}

export async function getEditableSettings() {
  const [settings, theme, seoHome, aboutSection, navbarItems, footerLinks] = await Promise.all([
    getSiteSettings(),
    db.themeConfig.upsert({ where: { id: "theme" }, create: { id: "theme" }, update: {} }),
    db.sEOPage.findUnique({ where: { path: "/" } }),
    db.homepageSection.findUnique({ where: { key: "about" } }),
    db.navbarItem.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } }),
    db.footerLink.findMany({ where: { enabled: true }, orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
  ]);

  const nav = navbarItems.length
    ? navbarItems
    : await db.navbarItem.createManyAndReturn({ data: defaultNavbarItems });
  const footer = footerLinks.length
    ? footerLinks
    : await db.footerLink.createManyAndReturn({ data: defaultFooterLinks });
  const footerSettings = (theme.footerSettings && typeof theme.footerSettings === "object" && !Array.isArray(theme.footerSettings))
    ? theme.footerSettings as Record<string, unknown>
    : {};
  const aboutSettings = (aboutSection?.settings && typeof aboutSection.settings === "object" && !Array.isArray(aboutSection.settings))
    ? aboutSection.settings as Record<string, unknown>
    : {};

  return {
    ...settings,
    logo: theme.logo ?? "",
    favicon: theme.favicon ?? "",
    heroBackgroundImage: settings.heroBackgroundImage ?? theme.logo ?? "",
    heroImage: settings.heroBackgroundImage ?? "",
    copyright: typeof footerSettings.copyright === "string" ? footerSettings.copyright : `© ${new Date().getFullYear()} BigTechJournals`,
    ogImage: seoHome?.image ?? "",
    seoKeywords: seoHome?.keywords ?? "",
    navItems: nav.map((item) => ({ id: item.id, label: item.label, href: item.href, external: item.external })),
    footerLinks: footer.map((item) => ({ id: item.id, label: item.label, href: item.href, group: item.group, external: item.external })),
    founderName: typeof aboutSettings.founderName === "string" ? aboutSettings.founderName : "Tanishq Gupta",
    founderImage: typeof aboutSettings.founderImage === "string" ? aboutSettings.founderImage : "",
    founderBio: typeof aboutSettings.founderBio === "string" ? aboutSettings.founderBio : "Building BigTechJournals to democratize access to career stories, internships, resources and opportunities from engineers working at top companies.",
    mission: typeof aboutSettings.mission === "string" ? aboutSettings.mission : "Democratize access to career stories, internships, roadmaps, resources, and opportunities from engineers working at top companies.",
    vision: typeof aboutSettings.vision === "string" ? aboutSettings.vision : "Become the most trusted career operating system for engineers preparing for Big Tech, AI careers, and high-growth technology teams.",
  };
}

export async function replaceNavbarItems(items: EditableLink[]) {
  await db.navbarItem.updateMany({ data: { enabled: false } });
  if (!items.length) return [];
  return db.navbarItem.createManyAndReturn({
    data: items.map((item, index) => {
      const link = normalizeLink(item, index);
      return { label: link.label, href: link.href, sortOrder: link.sortOrder, enabled: true, external: link.external };
    }).filter((item) => item.label && item.href),
  });
}

export async function replaceFooterLinks(items: EditableLink[]) {
  await db.footerLink.updateMany({ data: { enabled: false } });
  if (!items.length) return [];
  return db.footerLink.createManyAndReturn({
    data: items.map((item, index) => normalizeLink(item, index)).filter((item) => item.label && item.href),
  });
}

export async function updateThemeSettings(data: {
  logo?: string;
  favicon?: string;
  copyright?: string;
}) {
  return db.themeConfig.upsert({
    where: { id: "theme" },
    create: {
      id: "theme",
      logo: data.logo || null,
      favicon: data.favicon || null,
      footerSettings: { copyright: data.copyright ?? "" },
    },
    update: {
      ...(data.logo !== undefined ? { logo: data.logo || null } : {}),
      ...(data.favicon !== undefined ? { favicon: data.favicon || null } : {}),
      ...(data.copyright !== undefined ? { footerSettings: { copyright: data.copyright } } : {}),
    },
  });
}

export async function updateHomeSeo(data: { title?: string; description?: string; image?: string; keywords?: string }) {
  if (!data.title && !data.description && !data.image && !data.keywords) return null;
  return db.sEOPage.upsert({
    where: { path: "/" },
    create: {
      path: "/",
      title: data.title || "BigTechJournals",
      description: data.description || "Real journeys. Interview experiences. Preparation guides. Resources.",
      image: data.image || null,
      keywords: data.keywords || null,
    },
    update: {
      title: data.title || "BigTechJournals",
      description: data.description || "Real journeys. Interview experiences. Preparation guides. Resources.",
      image: data.image || null,
      keywords: data.keywords || null,
    },
  });
}

export async function updateAboutSettings(data: Record<string, string>) {
  return db.homepageSection.upsert({
    where: { key: "about" },
    create: {
      key: "about",
      title: "About",
      type: "about",
      enabled: true,
      sortOrder: 0,
      settings: data,
    },
    update: { settings: data },
  });
}

export async function trackEvent(event: string, metadata?: Record<string, unknown>) {
  try {
    await db.analyticsEvent.create({
      data: { event, metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined },
    });
  } catch {
    // Non-blocking analytics
  }
}
