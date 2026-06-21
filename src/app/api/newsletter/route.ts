import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { trackEvent } from "@/lib/settings";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.FROM_EMAIL ?? "BigTechJournals <noreply@bigtechjournals.com>";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`newsletter:${ip}`, 5, 3600_000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing?.active) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await db.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      create: { email: parsed.data.email },
      update: { active: true },
    });

    await trackEvent("newsletter_subscribe", { email: parsed.data.email });

    if (resend) {
      await resend.emails.send({
        from: fromEmail,
        to: parsed.data.email,
        subject: "Welcome to BigTechJournals",
        html: `<h2>You're in!</h2><p>Thanks for subscribing. You'll receive the best Big Tech career stories and prep guides.</p>`,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    await requireAdmin();
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { subscribedAt: "desc" },
    });
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
