import { NextRequest, NextResponse } from "next/server";
import {
  getEditableSettings,
  replaceFooterLinks,
  replaceNavbarItems,
  updateAboutSettings,
  updateHomeSeo,
  updateSiteSettings,
  updateThemeSettings,
  type EditableLink,
} from "@/lib/settings";
import { z } from "zod";

const linkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1).max(80),
  href: z.string().min(1).max(300),
  group: z.string().max(80).optional(),
  external: z.boolean().optional(),
});

const editableSettingsSchema = z.object({
  heroTitle: z.string().min(5).max(200).optional(),
  heroSubtitle: z.string().min(10).max(500).optional(),
  heroCtaPrimaryLabel: z.string().min(1).max(80).optional(),
  heroCtaPrimaryHref: z.string().min(1).max(300).optional(),
  heroCtaSecondaryLabel: z.string().min(1).max(80).optional(),
  heroCtaSecondaryHref: z.string().min(1).max(300).optional(),
  heroImage: z.string().url().optional().or(z.literal("")),
  announcementEnabled: z.boolean().optional(),
  announcementText: z.string().max(500).optional().nullable(),
  footerTagline: z.string().max(500).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(30).optional().nullable().or(z.literal("")),
  contactAddress: z.string().max(300).optional().nullable().or(z.literal("")),
  socialTwitter: z.string().url().optional().or(z.literal("")).nullable(),
  socialLinkedin: z.string().url().optional().or(z.literal("")).nullable(),
  socialInstagram: z.string().url().optional().or(z.literal("")).nullable(),
  seoDefaultTitle: z.string().max(200).optional(),
  seoDefaultDescription: z.string().max(500).optional(),
  seoKeywords: z.string().max(500).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
  newsletterTitle: z.string().max(100).optional(),
  newsletterDescription: z.string().max(500).optional(),
  logo: z.string().url().optional().or(z.literal("")),
  favicon: z.string().url().optional().or(z.literal("")),
  copyright: z.string().max(160).optional(),
  founderName: z.string().max(120).optional(),
  founderImage: z.string().url().optional().or(z.literal("")),
  founderBio: z.string().max(800).optional(),
  mission: z.string().max(800).optional(),
  vision: z.string().max(800).optional(),
  navItems: z.array(linkSchema).optional(),
  footerLinks: z.array(linkSchema).optional(),
});

export async function GET() {
  const settings = await getEditableSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();
    const body = await request.json();
    const parsed = editableSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    await Promise.all([
      updateSiteSettings({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroCtaPrimaryLabel: data.heroCtaPrimaryLabel,
        heroCtaPrimaryHref: data.heroCtaPrimaryHref,
        heroCtaSecondaryLabel: data.heroCtaSecondaryLabel,
        heroCtaSecondaryHref: data.heroCtaSecondaryHref,
        heroBackgroundImage: data.heroImage,
        announcementEnabled: data.announcementEnabled,
        announcementText: data.announcementText,
        footerTagline: data.footerTagline,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        contactAddress: data.contactAddress || null,
        socialTwitter: data.socialTwitter || null,
        socialLinkedin: data.socialLinkedin || null,
        socialInstagram: data.socialInstagram || null,
        seoDefaultTitle: data.seoDefaultTitle,
        seoDefaultDescription: data.seoDefaultDescription,
        newsletterTitle: data.newsletterTitle,
        newsletterDescription: data.newsletterDescription,
      }),
      updateThemeSettings({ logo: data.logo, favicon: data.favicon, copyright: data.copyright }),
      updateHomeSeo({
        title: data.seoDefaultTitle,
        description: data.seoDefaultDescription,
        image: data.ogImage,
        keywords: data.seoKeywords,
      }),
      updateAboutSettings({
        founderName: data.founderName ?? "",
        founderImage: data.founderImage ?? "",
        founderBio: data.founderBio ?? "",
        mission: data.mission ?? "",
        vision: data.vision ?? "",
      }),
      data.navItems ? replaceNavbarItems(data.navItems as EditableLink[]) : Promise.resolve(),
      data.footerLinks ? replaceFooterLinks(data.footerLinks as EditableLink[]) : Promise.resolve(),
    ]);
    const settings = await getEditableSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
