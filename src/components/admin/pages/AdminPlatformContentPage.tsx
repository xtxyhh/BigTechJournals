"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, Eye, Pencil, Plus, Save, Search, Star, Trash2, X } from "lucide-react";

type Kind = "resources" | "internships" | "roadmaps";

type PlatformItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  type?: string;
  url?: string;
  location?: string | null;
  remote?: boolean;
  stipend?: string | null;
  deadline?: string | null;
  applyUrl?: string | null;
  role?: string | null;
  difficulty?: string | null;
  timeRequired?: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  views: number;
  _count?: { bookmarks: number; likes: number };
};

type FormValue = string | number | boolean;

const emptyItem = {
  title: "",
  slug: "",
  description: "",
  type: "DSA",
  url: "",
  location: "",
  remote: false,
  stipend: "",
  deadline: "",
  applyUrl: "",
  role: "",
  difficulty: "",
  timeRequired: "",
  tags: "",
  featured: false,
  published: false,
  sortOrder: 0,
  seoTitle: "",
  seoDescription: "",
};

const labels = {
  resources: { singular: "Resource", helper: "Curate prep material, interview questions, and study links." },
  internships: { singular: "Internship", helper: "Publish opportunity pages with company, location, stipend, deadline, and apply link." },
  roadmaps: { singular: "Roadmap", helper: "Build public preparation tracks that can later grow into interactive nodes." },
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminPlatformContentPage({ kind }: { kind: Kind }) {
  const [items, setItems] = useState<PlatformItem[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<PlatformItem | null>(null);
  const [form, setForm] = useState<Record<string, FormValue>>(emptyItem);
  const [error, setError] = useState("");

  const api = `/api/admin/${kind}`;
  const label = labels[kind];

  const loadItems = useCallback(() => {
    fetch(api).then((res) => (res.ok ? res.json() : Promise.reject(new Error("Forbidden")))).then(setItems).catch(() => setError("Admin access is required."));
  }, [api]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return items.filter((item) => `${item.title} ${item.slug} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(needle));
  }, [items, query]);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyItem);
  };

  const startEdit = (item: PlatformItem) => {
    setEditing(item);
    setForm({
      ...emptyItem,
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      type: item.type ?? "DSA",
      url: item.url ?? "",
      remote: item.remote ?? false,
      featured: item.featured,
      published: item.published,
      sortOrder: item.sortOrder,
      location: item.location ?? "",
      stipend: item.stipend ?? "",
      applyUrl: item.applyUrl ?? "",
      role: item.role ?? "",
      difficulty: item.difficulty ?? "",
      timeRequired: item.timeRequired ?? "",
      tags: item.tags.join(", "),
      deadline: item.deadline ? new Date(item.deadline).toISOString().slice(0, 16) : "",
    });
  };

  const setValue = (key: string, value: string | boolean | number) => {
    setForm((current) => ({ ...current, [key]: value, ...(key === "title" && !editing ? { slug: slugify(String(value)) } : {}) }));
  };

  const save = async () => {
    setError("");
    const body = {
      ...form,
      tags: String(form.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
      deadline: form.deadline ? new Date(String(form.deadline)).toISOString() : "",
      ...(editing ? { id: editing.id } : {}),
    };
    const res = await fetch(api, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(payload.error ?? `Could not save ${label.singular.toLowerCase()}.`);
      return;
    }
    startCreate();
    loadItems();
  };

  const patch = async (item: PlatformItem, data: Partial<PlatformItem>) => {
    await fetch(api, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, ...data }) });
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, ...data } : entry)));
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete this ${label.singular.toLowerCase()}?`)) return;
    await fetch(`${api}?id=${id}`, { method: "DELETE" });
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/45">{label.helper}</p>
          <button type="button" onClick={startCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> New {label.singular}
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-[24px] border border-white/[0.08] bg-white/[0.05] px-4 py-3">
          <Search className="h-4 w-4 text-white/35" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${kind}`} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-white/[0.08] bg-white/[0.05]">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="text-white/45">
              <tr className="border-b border-white/[0.08]">
                <th className="p-4">{label.singular}</th>
                <th className="p-4">Status</th>
                <th className="p-4">Signals</th>
                <th className="p-4">Order</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="max-w-md p-4">
                    <p className="truncate font-medium text-white">{item.title}</p>
                    <p className="truncate text-xs text-white/40">/{kind}/{item.slug}</p>
                  </td>
                  <td className="p-4">
                    <button type="button" onClick={() => patch(item, { published: !item.published })} className={`rounded-full px-3 py-1 text-xs ${item.published ? "bg-emerald-500/15 text-emerald-200" : "bg-white/[0.06] text-white/55"}`}>
                      {item.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="p-4 text-white/55">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {item.views ?? 0}</span>
                    <span className="ml-3 inline-flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" /> {item._count?.bookmarks ?? 0}</span>
                  </td>
                  <td className="p-4 text-white/55">{item.sortOrder}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => patch(item, { featured: !item.featured })} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-amber-200"><Star className={`h-4 w-4 ${item.featured ? "fill-amber-300 text-amber-300" : ""}`} /></button>
                      <button type="button" onClick={() => startEdit(item)} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => remove(item.id)} className="rounded-xl p-2 text-white/55 hover:bg-red-500/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-white">{editing ? "Edit" : "Create"} {label.singular}</h2>
          {editing && <button type="button" onClick={startCreate} aria-label="Close editor" className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06]"><X className="h-4 w-4" /></button>}
        </div>
        {error && <p className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <div className="space-y-3">
          {["title", "slug", "description", "difficulty", "timeRequired", "tags", "seoTitle", "seoDescription"].map((key) => (
            <label key={key} className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">
              {key}
              <input value={String(form[key] ?? "")} onChange={(event) => setValue(key, event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" />
            </label>
          ))}
          {kind === "resources" && (
            <>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">type<input value={String(form.type ?? "")} onChange={(event) => setValue("type", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">url<input value={String(form.url ?? "")} onChange={(event) => setValue("url", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
            </>
          )}
          {kind === "internships" && (
            <>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">location<input value={String(form.location ?? "")} onChange={(event) => setValue("location", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">stipend<input value={String(form.stipend ?? "")} onChange={(event) => setValue("stipend", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">deadline<input type="datetime-local" value={String(form.deadline ?? "")} onChange={(event) => setValue("deadline", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
              <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">applyUrl<input value={String(form.applyUrl ?? "")} onChange={(event) => setValue("applyUrl", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
            </>
          )}
          {kind === "roadmaps" && <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">role<input value={String(form.role ?? "")} onChange={(event) => setValue("role", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>}
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center gap-2 rounded-2xl bg-black/20 p-3 text-sm text-white/65"><input type="checkbox" checked={Boolean(form.published)} onChange={(event) => setValue("published", event.target.checked)} /> Published</label>
            <label className="flex items-center gap-2 rounded-2xl bg-black/20 p-3 text-sm text-white/65"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setValue("featured", event.target.checked)} /> Featured</label>
            {kind === "internships" && <label className="flex items-center gap-2 rounded-2xl bg-black/20 p-3 text-sm text-white/65"><input type="checkbox" checked={Boolean(form.remote)} onChange={(event) => setValue("remote", event.target.checked)} /> Remote</label>}
          </div>
          <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">sortOrder<input type="number" value={Number(form.sortOrder ?? 0)} onChange={(event) => setValue("sortOrder", Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label>
          <button type="button" onClick={save} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white">
            <Save className="h-4 w-4" /> Save {label.singular}
          </button>
        </div>
      </aside>
    </div>
  );
}
