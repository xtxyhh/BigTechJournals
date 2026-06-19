"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Users,
  BookOpen,
  Clock,
  Eye,
  MessageCircle,
  Check,
  X,
  Trash2,
  Star,
} from "lucide-react";

interface Stats {
  overview: {
    totalUsers: number;
    totalStories: number;
    pendingSubmissions: number;
    totalViews: number;
    totalComments: number;
  };
  topStories: { id: string; title: string; slug: string; views: number }[];
}

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [stories, setStories] = useState<Record<string, unknown>[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([]);
  const [tab, setTab] = useState<"overview" | "stories" | "submissions" | "comments">("overview");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.all([
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : Promise.reject("Forbidden"))),
      fetch("/api/admin/stories").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/submissions").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([s, st, sub]) => {
        setStats(s);
        setStories(st);
        setSubmissions(sub);
      })
      .catch(() => setError("Access denied. Admin role required."));
  }, [isSignedIn]);

  const togglePublish = async (id: string, published: boolean) => {
    await fetch("/api/admin/stories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: !published }),
    });
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, published: !published } : s)));
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch("/api/admin/stories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured: !featured }),
    });
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, featured: !featured } : s)));
  };

  const deleteStory = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    await fetch(`/api/admin/stories?id=${id}`, { method: "DELETE" });
    setStories((prev) => prev.filter((s) => s.id !== id));
  };

  const reviewSubmission = async (id: string, status: string, convertToStory = false) => {
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, convertToStory }),
    });
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  if (!isLoaded) return null;
  if (!isSignedIn) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/sign-in" className="px-6 py-2 bg-slate-900 text-white rounded-full">Sign In</Link>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-600">{error}</p>
    </div>
  );

  const cards = stats
    ? [
        { label: "Total Users", value: stats.overview.totalUsers, icon: Users },
        { label: "Published Stories", value: stats.overview.totalStories, icon: BookOpen },
        { label: "Pending Submissions", value: stats.overview.pendingSubmissions, icon: Clock },
        { label: "Total Views", value: stats.overview.totalViews.toLocaleString(), icon: Eye },
        { label: "Comments", value: stats.overview.totalComments, icon: MessageCircle },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

          <div className="flex gap-2 mb-8 flex-wrap">
            {(["overview", "stories", "submissions"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${tab === t ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === "overview" && stats && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                {cards.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-2xl border border-slate-100 p-6">
                    <Icon className="w-5 h-5 text-blue-500 mb-3" />
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Most Read Stories</h2>
                <div className="space-y-3">
                  {stats.topStories.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 text-sm">
                      <span className="w-6 text-slate-400">{i + 1}</span>
                      <Link href={`/stories/${s.slug}`} className="flex-1 text-slate-900 hover:text-blue-600">{s.title}</Link>
                      <span className="text-slate-500">{s.views.toLocaleString()} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "stories" && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-600">Title</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-600">Views</th>
                    <th className="text-right p-4 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story.id as string} className="border-b border-slate-50">
                      <td className="p-4 font-medium text-slate-900">{story.title as string}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${story.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {story.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{story.views as number}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => togglePublish(story.id as string, story.published as boolean)} className="p-1.5 hover:bg-slate-100 rounded" title="Toggle publish">
                          {story.published ? <X className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4 text-green-500" />}
                        </button>
                        <button onClick={() => toggleFeatured(story.id as string, story.featured as boolean)} className="p-1.5 hover:bg-slate-100 rounded" title="Toggle featured">
                          <Star className={`w-4 h-4 ${story.featured ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`} />
                        </button>
                        <button onClick={() => deleteStory(story.id as string)} className="p-1.5 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "submissions" && (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div key={sub.id as string} className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{sub.storyTitle as string}</h3>
                      <p className="text-sm text-slate-500 mt-1">By {sub.name as string} • {sub.email as string}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${sub.status === "PENDING" ? "bg-amber-100 text-amber-700" : sub.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {sub.status as string}
                      </span>
                    </div>
                    {sub.status === "PENDING" && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => reviewSubmission(sub.id as string, "APPROVED", true)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-full">Approve & Create</button>
                        <button onClick={() => reviewSubmission(sub.id as string, "REJECTED")} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-full">Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
