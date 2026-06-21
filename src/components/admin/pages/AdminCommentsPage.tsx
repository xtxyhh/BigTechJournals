"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Pin, Search, Trash2, X } from "lucide-react";

type Comment = { id: string; content: string; deleted: boolean; reported: boolean; likes: number; createdAt: string; user?: { name: string | null; email: string }; story?: { title: string; slug: string } };
const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05]";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/comments").then((res) => (res.ok ? res.json() : [])).then(setComments);
  }, []);

  const filtered = useMemo(() => comments.filter((comment) => `${comment.content} ${comment.user?.email ?? ""} ${comment.story?.title ?? ""}`.toLowerCase().includes(query.toLowerCase())), [comments, query]);

  const remove = async (id: string) => {
    await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    setComments((current) => current.filter((comment) => comment.id !== id));
  };

  const bulkDelete = async () => {
    await Promise.all(selected.map(remove));
    setSelected([]);
  };

  return (
    <div className="space-y-5">
      <div className={`${panel} flex flex-col gap-3 p-3 sm:flex-row sm:items-center`}>
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3">
          <Search className="h-4 w-4 text-white/35" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search comments" className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
        </div>
        {!!selected.length && <button onClick={bulkDelete} className="rounded-2xl bg-red-500/20 px-4 py-3 text-sm text-red-100">Delete selected</button>}
      </div>

      <div className="space-y-3">
        {filtered.map((comment) => (
          <article key={comment.id} className={`${panel} p-4`}>
            <div className="flex gap-3">
              <input type="checkbox" checked={selected.includes(comment.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, comment.id] : current.filter((id) => id !== comment.id))} />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-white/80">{comment.content}</p>
                <p className="mt-2 text-xs text-white/40">{comment.user?.name ?? comment.user?.email ?? "Unknown"} on {comment.story?.title ?? "Story"} · {comment.likes} likes</p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                <button title="Approve" className="rounded-xl p-2 text-emerald-200 hover:bg-emerald-500/10"><Check className="h-4 w-4" /></button>
                <button title="Reject" className="rounded-xl p-2 text-amber-200 hover:bg-amber-500/10"><X className="h-4 w-4" /></button>
                <button title="Pin" className="rounded-xl p-2 text-blue-200 hover:bg-blue-500/10"><Pin className="h-4 w-4" /></button>
                <button title="Delete" onClick={() => remove(comment.id)} className="rounded-xl p-2 text-red-200 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
