import { z } from "zod";

export const submissionSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  linkedin: z.string().url().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  currentCompany: z.string().max(120).optional(),
  currentRole: z.string().max(120).optional(),
  college: z.string().max(160).optional(),
  graduationYear: z.string().max(20).optional(),
  experience: z.string().max(80).optional(),
  storyTitle: z.string().min(5).max(200),
  storyContent: z.string().min(100).max(50000),
  interviewProcess: z.string().max(20000).optional(),
  resourcesUsed: z.string().max(20000).optional(),
  tips: z.string().max(20000).optional(),
  timeline: z.string().max(20000).optional(),
  notes: z.string().max(10000).optional(),
  categoryId: z.string().optional(),
  companyId: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  storyId: z.string().cuid(),
});

export const storySchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(20).max(500),
  content: z.string().min(100),
  coverImage: z.string().url().optional().or(z.literal("")),
  companyId: z.string().optional(),
  authorName: z.string().min(2),
  authorImage: z.string().url().optional().or(z.literal("")),
  authorRole: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readTime: z.number().int().min(1).max(120).default(5),
  outcomeType: z.enum(["positive", "neutral", "negative"]).optional(),
  outcomeText: z.string().optional(),
  careerStage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});

export const siteSettingsSchema = z.object({
  heroTitle: z.string().min(5).max(200).optional(),
  heroSubtitle: z.string().min(10).max(500).optional(),
  announcementEnabled: z.boolean().optional(),
  announcementText: z.string().max(500).optional().nullable(),
  footerTagline: z.string().max(500).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(30).optional().nullable(),
  contactAddress: z.string().max(300).optional().nullable(),
  socialTwitter: z.string().url().optional().or(z.literal("")).nullable(),
  socialLinkedin: z.string().url().optional().or(z.literal("")).nullable(),
  socialInstagram: z.string().url().optional().or(z.literal("")).nullable(),
  seoDefaultTitle: z.string().max(200).optional(),
  seoDefaultDescription: z.string().max(500).optional(),
  newsletterTitle: z.string().max(100).optional(),
  newsletterDescription: z.string().max(500).optional(),
});

export const companySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  logo: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20),
  interviewProcess: z.unknown().optional(),
  roadmap: z.unknown().optional(),
  resources: z.unknown().optional(),
  salaryInfo: z.unknown().optional(),
  faqs: z.unknown().optional(),
});

const slugSchema = z.string().min(3).max(200).regex(/^[a-z0-9-]+$/);
const tagListSchema = z.array(z.string().min(1).max(40)).default([]);

export const platformContentBaseSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  description: z.string().min(10).max(1000),
  coverImage: z.string().url().optional().or(z.literal("")),
  authorName: z.string().max(100).optional().or(z.literal("")),
  companyId: z.string().optional().or(z.literal("")),
  difficulty: z.string().max(40).optional().or(z.literal("")),
  timeRequired: z.string().max(80).optional().or(z.literal("")),
  tags: tagListSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(500).optional().or(z.literal("")),
});

export const resourceSchema = platformContentBaseSchema.extend({
  name: z.string().min(3).max(200).optional(),
  type: z.string().min(2).max(80),
  url: z.string().url(),
  content: z.string().max(50000).optional().or(z.literal("")),
});

export const internshipSchema = platformContentBaseSchema.extend({
  location: z.string().max(120).optional().or(z.literal("")),
  remote: z.boolean().default(false),
  stipend: z.string().max(120).optional().or(z.literal("")),
  deadline: z.string().datetime().optional().or(z.literal("")),
  applyUrl: z.string().url().optional().or(z.literal("")),
});

export const roadmapNodeSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  resources: z.array(z.string().max(200)).default([]),
});

export const roadmapSchema = platformContentBaseSchema.extend({
  role: z.string().max(120).optional().or(z.literal("")),
  nodes: z.array(roadmapNodeSchema).default([]),
});
