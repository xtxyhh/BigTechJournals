/*
  Warnings:

  - The primary key for the `Bookmark` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,storyId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,resourceId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,internshipId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roadmapId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,careerSwitchId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,interviewExperienceId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,companyId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Bookmark` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_pkey",
ADD COLUMN     "careerSwitchId" TEXT,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "internshipId" TEXT,
ADD COLUMN     "interviewExperienceId" TEXT,
ADD COLUMN     "resourceId" TEXT,
ADD COLUMN     "roadmapId" TEXT,
ALTER COLUMN "storyId" DROP NOT NULL,
ADD CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timeRequired" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "heroBackgroundImage" TEXT,
ADD COLUMN     "heroCtaPrimaryHref" TEXT NOT NULL DEFAULT '/stories',
ADD COLUMN     "heroCtaPrimaryLabel" TEXT NOT NULL DEFAULT 'Start Reading',
ADD COLUMN     "heroCtaSecondaryHref" TEXT NOT NULL DEFAULT '/trending',
ADD COLUMN     "heroCtaSecondaryLabel" TEXT NOT NULL DEFAULT 'Explore Stories',
ADD COLUMN     "heroGradient" TEXT;

-- CreateTable
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorName" TEXT,
    "companyId" TEXT,
    "location" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "stipend" TEXT,
    "deadline" TIMESTAMP(3),
    "applyUrl" TEXT,
    "difficulty" TEXT,
    "timeRequired" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorName" TEXT,
    "companyId" TEXT,
    "role" TEXT,
    "difficulty" TEXT,
    "timeRequired" TEXT,
    "nodes" JSONB,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerSwitch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorName" TEXT,
    "fromRole" TEXT,
    "toRole" TEXT,
    "companyId" TEXT,
    "difficulty" TEXT,
    "timeRequired" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerSwitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewExperience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorName" TEXT,
    "companyId" TEXT,
    "role" TEXT,
    "outcome" TEXT,
    "difficulty" TEXT,
    "timeRequired" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "page" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "quote" TEXT NOT NULL,
    "image" TEXT,
    "rating" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "contentIds" TEXT[],
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavbarItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "external" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavbarItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'Product',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "external" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEOPage" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "keywords" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeConfig" (
    "id" TEXT NOT NULL DEFAULT 'theme',
    "logo" TEXT,
    "favicon" TEXT,
    "mode" TEXT NOT NULL DEFAULT 'dark',
    "background" TEXT NOT NULL DEFAULT '#050816',
    "surface" TEXT NOT NULL DEFAULT 'rgba(255,255,255,0.05)',
    "border" TEXT NOT NULL DEFAULT 'rgba(255,255,255,0.08)',
    "accent" TEXT NOT NULL DEFAULT '#3b82f6',
    "radius" INTEGER NOT NULL DEFAULT 24,
    "glassIntensity" TEXT NOT NULL DEFAULT 'xl',
    "headingFont" TEXT,
    "bodyFont" TEXT,
    "navbarSettings" JSONB,
    "footerSettings" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInterview" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT,
    "level" TEXT,
    "process" JSONB,
    "questions" JSONB,
    "tips" JSONB,
    "difficulty" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT,
    "internshipId" TEXT,
    "roadmapId" TEXT,
    "careerSwitchId" TEXT,
    "interviewExperienceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Internship_slug_key" ON "Internship"("slug");

-- CreateIndex
CREATE INDEX "Internship_slug_idx" ON "Internship"("slug");

-- CreateIndex
CREATE INDEX "Internship_published_featured_idx" ON "Internship"("published", "featured");

-- CreateIndex
CREATE INDEX "Internship_companyId_idx" ON "Internship"("companyId");

-- CreateIndex
CREATE INDEX "Internship_deadline_idx" ON "Internship"("deadline");

-- CreateIndex
CREATE INDEX "Internship_remote_idx" ON "Internship"("remote");

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_slug_key" ON "Roadmap"("slug");

-- CreateIndex
CREATE INDEX "Roadmap_slug_idx" ON "Roadmap"("slug");

-- CreateIndex
CREATE INDEX "Roadmap_published_featured_idx" ON "Roadmap"("published", "featured");

-- CreateIndex
CREATE INDEX "Roadmap_companyId_idx" ON "Roadmap"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerSwitch_slug_key" ON "CareerSwitch"("slug");

-- CreateIndex
CREATE INDEX "CareerSwitch_slug_idx" ON "CareerSwitch"("slug");

-- CreateIndex
CREATE INDEX "CareerSwitch_published_featured_idx" ON "CareerSwitch"("published", "featured");

-- CreateIndex
CREATE INDEX "CareerSwitch_companyId_idx" ON "CareerSwitch"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewExperience_slug_key" ON "InterviewExperience"("slug");

-- CreateIndex
CREATE INDEX "InterviewExperience_slug_idx" ON "InterviewExperience"("slug");

-- CreateIndex
CREATE INDEX "InterviewExperience_published_featured_idx" ON "InterviewExperience"("published", "featured");

-- CreateIndex
CREATE INDEX "InterviewExperience_companyId_idx" ON "InterviewExperience"("companyId");

-- CreateIndex
CREATE INDEX "FAQ_page_idx" ON "FAQ"("page");

-- CreateIndex
CREATE INDEX "FAQ_published_sortOrder_idx" ON "FAQ"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_published_featured_idx" ON "Testimonial"("published", "featured");

-- CreateIndex
CREATE INDEX "Testimonial_sortOrder_idx" ON "Testimonial"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSection_key_key" ON "HomepageSection"("key");

-- CreateIndex
CREATE INDEX "HomepageSection_enabled_sortOrder_idx" ON "HomepageSection"("enabled", "sortOrder");

-- CreateIndex
CREATE INDEX "NavbarItem_enabled_sortOrder_idx" ON "NavbarItem"("enabled", "sortOrder");

-- CreateIndex
CREATE INDEX "FooterLink_enabled_sortOrder_idx" ON "FooterLink"("enabled", "sortOrder");

-- CreateIndex
CREATE INDEX "FooterLink_group_idx" ON "FooterLink"("group");

-- CreateIndex
CREATE UNIQUE INDEX "SEOPage_path_key" ON "SEOPage"("path");

-- CreateIndex
CREATE INDEX "CompanyInterview_companyId_idx" ON "CompanyInterview"("companyId");

-- CreateIndex
CREATE INDEX "CompanyInterview_published_sortOrder_idx" ON "CompanyInterview"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "ContentLike_resourceId_idx" ON "ContentLike"("resourceId");

-- CreateIndex
CREATE INDEX "ContentLike_internshipId_idx" ON "ContentLike"("internshipId");

-- CreateIndex
CREATE INDEX "ContentLike_roadmapId_idx" ON "ContentLike"("roadmapId");

-- CreateIndex
CREATE INDEX "ContentLike_careerSwitchId_idx" ON "ContentLike"("careerSwitchId");

-- CreateIndex
CREATE INDEX "ContentLike_interviewExperienceId_idx" ON "ContentLike"("interviewExperienceId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLike_userId_resourceId_key" ON "ContentLike"("userId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLike_userId_internshipId_key" ON "ContentLike"("userId", "internshipId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLike_userId_roadmapId_key" ON "ContentLike"("userId", "roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLike_userId_careerSwitchId_key" ON "ContentLike"("userId", "careerSwitchId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentLike_userId_interviewExperienceId_key" ON "ContentLike"("userId", "interviewExperienceId");

-- CreateIndex
CREATE INDEX "Bookmark_resourceId_idx" ON "Bookmark"("resourceId");

-- CreateIndex
CREATE INDEX "Bookmark_internshipId_idx" ON "Bookmark"("internshipId");

-- CreateIndex
CREATE INDEX "Bookmark_roadmapId_idx" ON "Bookmark"("roadmapId");

-- CreateIndex
CREATE INDEX "Bookmark_careerSwitchId_idx" ON "Bookmark"("careerSwitchId");

-- CreateIndex
CREATE INDEX "Bookmark_interviewExperienceId_idx" ON "Bookmark"("interviewExperienceId");

-- CreateIndex
CREATE INDEX "Bookmark_companyId_idx" ON "Bookmark"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_storyId_key" ON "Bookmark"("userId", "storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_resourceId_key" ON "Bookmark"("userId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_internshipId_key" ON "Bookmark"("userId", "internshipId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_roadmapId_key" ON "Bookmark"("userId", "roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_careerSwitchId_key" ON "Bookmark"("userId", "careerSwitchId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_interviewExperienceId_key" ON "Bookmark"("userId", "interviewExperienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_companyId_key" ON "Bookmark"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_slug_idx" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_published_featured_idx" ON "Resource"("published", "featured");

-- CreateIndex
CREATE INDEX "Resource_companyId_idx" ON "Resource"("companyId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_careerSwitchId_fkey" FOREIGN KEY ("careerSwitchId") REFERENCES "CareerSwitch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_interviewExperienceId_fkey" FOREIGN KEY ("interviewExperienceId") REFERENCES "InterviewExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerSwitch" ADD CONSTRAINT "CareerSwitch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewExperience" ADD CONSTRAINT "InterviewExperience_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInterview" ADD CONSTRAINT "CompanyInterview_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_careerSwitchId_fkey" FOREIGN KEY ("careerSwitchId") REFERENCES "CareerSwitch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_interviewExperienceId_fkey" FOREIGN KEY ("interviewExperienceId") REFERENCES "InterviewExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
