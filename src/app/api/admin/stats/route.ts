import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalStories,
      pendingSubmissions,
      totalViews,
      totalComments,
      recentViews,
    ] = await Promise.all([
      db.user.count(),
      db.story.count({ where: { published: true } }),
      db.storySubmission.count({ where: { status: "PENDING" } }),
      db.story.aggregate({ _sum: { views: true } }),
      db.comment.count(),
      db.storyView.groupBy({
        by: ["viewedAt"],
        _count: true,
        orderBy: { viewedAt: "desc" },
        take: 30,
      }),
    ]);

    const topStories = await db.story.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 10,
      select: { id: true, title: true, slug: true, views: true },
    });

    const userGrowth = await db.user.groupBy({
      by: ["createdAt"],
      _count: true,
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalStories,
        pendingSubmissions,
        totalViews: totalViews._sum.views ?? 0,
        totalComments,
      },
      topStories,
      userGrowth,
      recentViews,
    });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
