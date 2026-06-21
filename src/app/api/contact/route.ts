import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { trackEvent } from "@/lib/settings";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.FROM_EMAIL ?? "BigTechJournals <noreply@bigtechjournals.com>";
const adminEmail = process.env.ADMIN_EMAIL ?? "tanishqgupta891@gmail.com";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`contact:${ip}`, 3, 3600_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const message = await db.contactMessage.create({
      data: {
        name: sanitizePlainText(parsed.data.name),
        email: parsed.data.email,
        subject: sanitizePlainText(parsed.data.subject),
        message: sanitizePlainText(parsed.data.message),
      },
    });

    await trackEvent("contact_submit", { subject: parsed.data.subject });

    if (resend) {
      await Promise.all([
        resend.emails.send({
          from: fromEmail,
          to: parsed.data.email,
          subject: "We received your message — BigTechJournals",
          html: `<p>Hi ${parsed.data.name},</p><p>Thanks for reaching out. We'll get back to you within 2 business days.</p>`,
        }),
        resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `Contact: ${parsed.data.subject}`,
          html: `<p><strong>From:</strong> ${parsed.data.name} (${parsed.data.email})</p><p>${parsed.data.message}</p>`,
        }),
      ]);
    }

    return NextResponse.json({ success: true, id: message.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();
    const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();
    const { id, read } = await request.json();
    const updated = await db.contactMessage.update({ where: { id }, data: { read } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
