import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
        _count: { select: { comments: true, likes: true, bookmarks: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id, role, banned } = await request.json();
    const user = await db.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(banned !== undefined && { banned }),
      },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
