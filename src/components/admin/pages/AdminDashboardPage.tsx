"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, Eye, Mail, MessageSquare, Users } from "lucide-react";
import { BarChart, Sparkline, type ChartPoint } from "@/components/admin/AdminCharts";

type Stats = {
  overview: { totalUsers: number; totalStories: number; pendingSubmissions: number; totalViews: number; totalComments: number };
  topStories: { id: string; title: string; slug: string; views: number }[];
  userGrowth?: { createdAt: string; _count: number }[];
  recentViews?: { viewedAt: string; _count: number }[];
};

type Story = { id: string; title: string; slug: string; views: number; createdAt: string; published: boolean };
type Submission = { id: string; storyTitle: string; name: string; status: string; submittedAt: string };
type Comment = { id: string; content: string; user?: { name: string | null }; story?: { title: string } };
type Subscriber = { id: string; email: string; subscribedAt: string };

const card = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 shadow-xl shadow-black/10";

function toPoints<T>(items: T[], label: (item: T) => string, value: (item: T) => number): ChartPoint[] {
  return items.slice(-12).map((item) => ({ label: label(item), value: value(item) }));
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((res) => (res.ok ? res.json() : Promise.reject(new Error("Forbidden")))),
      fetch("/api/admin/stories").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/admin/submissions").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/admin/comments").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/newsletter").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([nextStats, nextStories, nextSubmissions, nextComments, nextSubscribers]) => {
        setStats(nextStats);
        setStories(nextStories);
        setSubmissions(nextSubmissions);
        setComments(nextComments);
        setSubscribers(nextSubscribers);
      })
      .catch(() => setError("Admin access is required to load this dashboard."));
  }, []);

  const charts = useMemo(() => {
    const views = toPoints(stats?.recentViews ?? [], (item) => new Date(item.viewedAt).toLocaleDateString("en", { month: "short", day: "numeric" }), (item) => item._count);
    const growth = toPoints(stats?.userGrowth ?? [], (item) => new Date(item.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" }), (item) => item._count);
    const subscribersGrowth = toPoints(subscribers, (item) => new Date(item.subscribedAt).toLocaleDateString("en", { month: "short", day: "numeric" }), () => 1);
    const engagement = [
      { label: "Views", value: stats?.overview.totalViews ?? 0 },
      { label: "Comments", value: stats?.overview.totalComments ?? 0 },
      { label: "Stories", value: stats?.overview.totalStories ?? 0 },
      { label: "Subs", value: subscribers.length },
    ];
    return { views, growth, subscribersGrowth, engagement };
  }, [stats, subscribers]);

  if (error) return <div className={card}><p className="text-red-300">{error}</p></div>;

  const metrics = [
    { label: "Total Stories", value: stats?.overview.totalStories ?? 0, icon: BookOpen },
    { label: "Total Users", value: stats?.overview.totalUsers ?? 0, icon: Users },
    { label: "Total Views", value: (stats?.overview.totalViews ?? 0).toLocaleString(), icon: Eye },
    { label: "Newsletter Subscribers", value: subscribers.length.toLocaleString(), icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={card}>
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-white/55">{metric.label}</span>
              <metric.icon className="h-5 w-5 text-blue-300" />
            </div>
            <p className="text-3xl font-semibold tracking-normal text-white">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-white/70">Visitors</h2>
          <Sparkline data={charts.views.length ? charts.views : [{ label: "Today", value: 1 }]} />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white/70">Story Growth</h2>
          <BarChart data={charts.growth.length ? charts.growth : [{ label: "Now", value: stories.length }]} tone="emerald" />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white/70">Engagement</h2>
          <BarChart data={charts.engagement} tone="violet" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className={`${card} xl:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Top Stories</h2>
            <BarChart3 className="h-5 w-5 text-blue-300" />
          </div>
          <div className="space-y-3">
            {(stats?.topStories ?? []).slice(0, 6).map((story, index) => (
              <Link key={story.id} href={`/stories/${story.slug}`} className="flex items-center gap-3 rounded-2xl p-3 text-sm hover:bg-white/[0.05]">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.06] text-white/50">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate text-white/80">{story.title}</span>
                <span className="text-white/45">{story.views.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className={card}>
          <h2 className="mb-4 font-semibold text-white">Recent Submissions</h2>
          <div className="space-y-3">
            {submissions.slice(0, 5).map((submission) => (
              <p key={submission.id} className="rounded-2xl bg-white/[0.04] p-3 text-sm text-white/70">{submission.storyTitle}</p>
            ))}
          </div>
        </div>
        <div className={card}>
          <h2 className="mb-4 font-semibold text-white">Recent Comments</h2>
          <div className="space-y-3">
            {comments.slice(0, 5).map((comment) => (
              <p key={comment.id} className="line-clamp-2 rounded-2xl bg-white/[0.04] p-3 text-sm text-white/70">
                <MessageSquare className="mr-2 inline h-4 w-4 text-blue-300" />
                {comment.content}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-white/70">Subscribers Growth</h2>
        <Sparkline data={charts.subscribersGrowth.length ? charts.subscribersGrowth : [{ label: "Now", value: subscribers.length }]} tone="amber" />
      </section>
    </div>
  );
}
