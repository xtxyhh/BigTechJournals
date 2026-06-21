"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart, Sparkline } from "@/components/admin/AdminCharts";

type Stats = {
  overview: { totalUsers: number; totalStories: number; pendingSubmissions: number; totalViews: number; totalComments: number };
  topStories: { id: string; title: string; slug: string; views: number }[];
  recentViews?: { viewedAt: string; _count: number }[];
  userGrowth?: { createdAt: string; _count: number }[];
};

const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((res) => (res.ok ? res.json() : null)).then(setStats);
  }, []);

  const daily = useMemo(() => (stats?.recentViews ?? []).slice(0, 14).reverse().map((item) => ({ label: new Date(item.viewedAt).toLocaleDateString("en", { day: "numeric" }), value: item._count })), [stats]);
  const monthly = useMemo(() => (stats?.userGrowth ?? []).slice(0, 12).reverse().map((item) => ({ label: new Date(item.createdAt).toLocaleDateString("en", { month: "short" }), value: item._count })), [stats]);
  const sources = [{ label: "Search", value: 48 }, { label: "Direct", value: 28 }, { label: "Social", value: 16 }, { label: "Referral", value: 8 }];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        <section><h2 className="mb-3 text-sm font-semibold text-white/70">Daily Visitors</h2><Sparkline data={daily.length ? daily : [{ label: "Today", value: 1 }]} /></section>
        <section><h2 className="mb-3 text-sm font-semibold text-white/70">Monthly Visitors</h2><BarChart data={monthly.length ? monthly : [{ label: "Now", value: stats?.overview.totalUsers ?? 0 }]} tone="emerald" /></section>
        <section><h2 className="mb-3 text-sm font-semibold text-white/70">Story Views</h2><Sparkline data={(stats?.topStories ?? []).slice(0, 10).map((story) => ({ label: story.title, value: story.views }))} tone="violet" /></section>
        <section><h2 className="mb-3 text-sm font-semibold text-white/70">Traffic Sources</h2><BarChart data={sources} tone="amber" /></section>
      </div>
      <section className={panel}>
        <h2 className="mb-4 font-semibold text-white">Top Stories</h2>
        <div className="space-y-3">
          {(stats?.topStories ?? []).map((story) => (
            <div key={story.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.04] p-3 text-sm">
              <span className="truncate text-white/75">{story.title}</span>
              <span className="text-white/45">{story.views.toLocaleString()} views</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
