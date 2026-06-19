import { z } from "zod";

export const submissionSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  linkedin: z.string().url().optional().or(z.literal("")),
  storyTitle: z.string().min(5).max(200),
  storyContent: z.string().min(100).max(50000),
  notes: z.string().max(2000).optional(),
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
