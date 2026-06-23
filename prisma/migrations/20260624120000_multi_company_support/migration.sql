-- Add many-to-many company tagging for stories and public submissions.
CREATE TABLE "StoryCompany" (
  "storyId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,

  CONSTRAINT "StoryCompany_pkey" PRIMARY KEY ("storyId", "companyId")
);

CREATE TABLE "StorySubmissionCompany" (
  "submissionId" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,

  CONSTRAINT "StorySubmissionCompany_pkey" PRIMARY KEY ("submissionId", "companyId")
);

CREATE INDEX "StoryCompany_companyId_idx" ON "StoryCompany"("companyId");
CREATE INDEX "StorySubmissionCompany_companyId_idx" ON "StorySubmissionCompany"("companyId");

ALTER TABLE "StoryCompany"
  ADD CONSTRAINT "StoryCompany_storyId_fkey"
  FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StoryCompany"
  ADD CONSTRAINT "StoryCompany_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StorySubmissionCompany"
  ADD CONSTRAINT "StorySubmissionCompany_submissionId_fkey"
  FOREIGN KEY ("submissionId") REFERENCES "StorySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StorySubmissionCompany"
  ADD CONSTRAINT "StorySubmissionCompany_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "StoryCompany" ("storyId", "companyId")
SELECT "id", "companyId"
FROM "Story"
WHERE "companyId" IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO "StorySubmissionCompany" ("submissionId", "companyId")
SELECT "id", "companyId"
FROM "StorySubmission"
WHERE "companyId" IS NOT NULL
ON CONFLICT DO NOTHING;
