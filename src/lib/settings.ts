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

export async function trackEvent(event: string, metadata?: Record<string, unknown>) {
  try {
    await db.analyticsEvent.create({
      data: { event, metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined },
    });
  } catch {
    // Non-blocking analytics
  }
}
