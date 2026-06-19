import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submissionSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadFile } from "@/lib/supabase";
import {
  sendSubmissionConfirmation,
  sendAdminSubmissionAlert,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`submit:${ip}`, 3, 3600_000);
  if (!success) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  try {
    const formData = await request.formData();

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      linkedin: (formData.get("linkedin") as string) || "",
      storyTitle: formData.get("storyTitle") as string,
      storyContent: formData.get("storyContent") as string,
      notes: (formData.get("notes") as string) || "",
      categoryId: (formData.get("categoryId") as string) || undefined,
      companyId: (formData.get("companyId") as string) || undefined,
    };

    const parsed = submissionSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    let resumeUrl: string | null = null;
    const resumeFile = formData.get("resume") as File | null;
    if (resumeFile && resumeFile.size > 0) {
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Resume must be under 5MB" }, { status: 400 });
      }
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowed.includes(resumeFile.type)) {
        return NextResponse.json({ error: "Resume must be PDF or DOC" }, { status: 400 });
      }
      const buffer = await resumeFile.arrayBuffer();
      const ext = resumeFile.name.split(".").pop() ?? "pdf";
      resumeUrl = await uploadFile("resumes", `${Date.now()}-${parsed.data.email}.${ext}`, buffer, resumeFile.type);
    }

    const submission = await db.storySubmission.create({
      data: {
        name: sanitizePlainText(parsed.data.name),
        email: parsed.data.email,
        linkedin: parsed.data.linkedin || null,
        storyTitle: sanitizePlainText(parsed.data.storyTitle),
        storyContent: sanitizePlainText(parsed.data.storyContent),
        notes: parsed.data.notes ? sanitizePlainText(parsed.data.notes) : null,
        resumeUrl,
        categoryId: parsed.data.categoryId,
        companyId: parsed.data.companyId,
      },
    });

    await Promise.all([
      sendSubmissionConfirmation(parsed.data.email, parsed.data.name, parsed.data.storyTitle),
      sendAdminSubmissionAlert(parsed.data.name, parsed.data.storyTitle, submission.id),
    ]);

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 });
  }
}
