import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { subscribedAt: "desc" },
    });

    const csv = [
      "email,subscribedAt",
      ...subscribers.map((s) => `${s.email},${s.subscribedAt.toISOString()}`),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=newsletter-subscribers.csv",
      },
    });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
