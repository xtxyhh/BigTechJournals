import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { categoryId } = await request.json();

    const existing = await db.categoryFollower.findUnique({
      where: { userId_categoryId: { userId: user.id, categoryId } },
    });

    if (existing) {
      await db.categoryFollower.delete({
        where: { userId_categoryId: { userId: user.id, categoryId } },
      });
      return NextResponse.json({ following: false });
    }

    await db.categoryFollower.create({
      data: { userId: user.id, categoryId },
    });
    return NextResponse.json({ following: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    const follows = await db.categoryFollower.findMany({
      where: { userId: user.id },
      include: { category: true },
    });
    return NextResponse.json(follows);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
