"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, FilePlus2, Search, X } from "lucide-react";

type Submission = { id: string; name: string; email: string; storyTitle: string; storyContent: string; status: "PENDING" | "APPROVED" | "REJECTED"; submittedAt: string; company?: { name: string } | null; category?: { name: string } | null };
const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05]";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | Submission["status"]>("ALL");

  useEffect(() => {
    fetch("/api/admin/submissions").then((res) => (res.ok ? res.json() : [])).then(setSubmissions);
  }, []);

  const filtered = useMemo(() => submissions.filter((submission) => {
    const matchesQuery = `${submission.storyTitle} ${submission.name} ${submission.email}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "ALL" || submission.status === filter);
  }), [submissions, query, filter]);

  const review = async (id: string, status: Submission["status"], convertToStory = false) => {
    await fetch("/api/admin/submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status, convertToStory }) });
    setSubmissions((current) => current.map((submission) => (submission.id === id ? { ...submission, status } : submission)));
  };

  return (
    <div className="space-y-5">
      <div className={`${panel} flex flex-col gap-3 p-3 lg:flex-row`}>
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3">
          <Search className="h-4 w-4 text-white/35" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search submissions" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`rounded-2xl px-3 py-2 text-sm ${filter === item ? "bg-blue-500 text-white" : "bg-white/[0.05] text-white/55"}`}>{item}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((submission) => (
          <article key={submission.id} className={`${panel} p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="line-clamp-2 font-semibold text-white">{submission.storyTitle}</h2>
                <p className="mt-1 text-sm text-white/45">{submission.name} · {submission.email}</p>
              </div>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/65">{submission.status}</span>
            </div>
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/60">{submission.storyContent}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => review(submission.id, "APPROVED")} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-100"><Check className="h-4 w-4" /> Approve</button>
              <button onClick={() => review(submission.id, "REJECTED")} className="inline-flex items-center gap-2 rounded-2xl bg-red-500/20 px-3 py-2 text-sm text-red-100"><X className="h-4 w-4" /> Reject</button>
              <button onClick={() => review(submission.id, "APPROVED", true)} className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-3 py-2 text-sm text-white"><FilePlus2 className="h-4 w-4" /> Convert to story</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
