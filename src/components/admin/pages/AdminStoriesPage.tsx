"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Eye, Grid2X2, List, Pencil, Plus, Search, Star, Trash2, Upload } from "lucide-react";
import { storyImageStyle, type StoryImageCropMode } from "@/lib/story-image";

type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string | null;
  coverImageZoom?: number;
  coverImageX?: number;
  coverImageY?: number;
  coverImageObjectPosition?: string;
  coverImageCropMode?: string;
  published: boolean;
  featured: boolean;
  scheduledAt?: string | null;
  views: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  _count?: { comments: number; likes: number };
};

type Filter = "all" | "draft" | "published" | "scheduled" | "featured";
type View = "table" | "cards";

const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05]";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("table");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/stories").then((res) => (res.ok ? res.json() : [])).then(setStories);
  }, []);

  const filtered = useMemo(() => stories.filter((story) => {
    const matchesQuery = `${story.title} ${story.excerpt} ${story.slug}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "draft" && !story.published && !story.scheduledAt) ||
      (filter === "published" && story.published) ||
      (filter === "scheduled" && !!story.scheduledAt) ||
      (filter === "featured" && story.featured);
    return matchesQuery && matchesFilter;
  }), [stories, query, filter]);

  const patchStory = async (id: string, data: Partial<Story>) => {
    await fetch("/api/admin/stories", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...data }) });
    setStories((current) => current.map((story) => (story.id === id ? { ...story, ...data } : story)));
  };

  const deleteStory = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    await fetch(`/api/admin/stories?id=${id}`, { method: "DELETE" });
    setStories((current) => current.filter((story) => story.id !== id));
    setSelected((current) => current.filter((selectedId) => selectedId !== id));
  };

  const duplicateStory = async (story: Story) => {
    const body = {
      title: `${story.title} Copy`,
      slug: `${story.slug}-copy-${Date.now()}`,
      excerpt: story.excerpt,
      content: story.content ?? story.excerpt,
      authorName: "Admin",
      published: false,
      coverImage: story.coverImage,
      coverImageZoom: story.coverImageZoom,
      coverImageX: story.coverImageX,
      coverImageY: story.coverImageY,
      coverImageObjectPosition: story.coverImageObjectPosition,
      coverImageCropMode: story.coverImageCropMode,
    };
    const res = await fetch("/api/admin/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const duplicated = await res.json();
      setStories((current) => [duplicated, ...current]);
    }
  };

  const bulk = async (action: "delete" | "publish" | "feature") => {
    await Promise.all(selected.map((id) => (action === "delete" ? fetch(`/api/admin/stories?id=${id}`, { method: "DELETE" }) : patchStory(id, action === "publish" ? { published: true } : { featured: true }))));
    if (action === "delete") setStories((current) => current.filter((story) => !selected.includes(story.id)));
    setSelected([]);
  };

  const seoScore = (story: Story) => [story.seoTitle, story.seoDescription, story.slug, story.coverImage].filter(Boolean).length * 25;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/45">Manage publishing, SEO, previews, and bulk workflows.</p>
        <Link href="/admin/stories/new" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
          <Plus className="h-4 w-4" /> New Story
        </Link>
      </div>

      <div className={`${panel} p-3`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3">
            <Search className="h-4 w-4 text-white/35" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "draft", "published", "scheduled", "featured"] as Filter[]).map((item) => (
              <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-2xl px-3 py-2 text-sm capitalize ${filter === item ? "bg-blue-500 text-white" : "bg-white/[0.05] text-white/55 hover:text-white"}`}>{item}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setView("table")} aria-label="Table view" className={`rounded-2xl p-3 ${view === "table" ? "bg-white text-[#050816]" : "bg-white/[0.05] text-white/55"}`}><List className="h-4 w-4" /></button>
            <button type="button" onClick={() => setView("cards")} aria-label="Card view" className={`rounded-2xl p-3 ${view === "cards" ? "bg-white text-[#050816]" : "bg-white/[0.05] text-white/55"}`}><Grid2X2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {!!selected.length && (
        <div className={`${panel} flex flex-wrap items-center gap-2 p-3 text-sm text-white/65`}>
          <span className="px-2">{selected.length} selected</span>
          <button onClick={() => bulk("publish")} className="rounded-xl bg-emerald-500/20 px-3 py-2 text-emerald-200">Publish selected</button>
          <button onClick={() => bulk("feature")} className="rounded-xl bg-amber-500/20 px-3 py-2 text-amber-200">Feature selected</button>
          <button onClick={() => bulk("delete")} className="rounded-xl bg-red-500/20 px-3 py-2 text-red-200">Delete selected</button>
        </div>
      )}

      {view === "table" ? (
        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-white/45">
              <tr className="border-b border-white/[0.08]">
                <th className="p-4"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(event) => setSelected(event.target.checked ? filtered.map((story) => story.id) : [])} /></th>
                <th className="p-4">Story</th>
                <th className="p-4">Status</th>
                <th className="p-4">SEO</th>
                <th className="p-4">Engagement</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((story) => (
                <tr key={story.id} className="border-b border-white/[0.06] last:border-0">
                  <td className="p-4"><input type="checkbox" checked={selected.includes(story.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, story.id] : current.filter((id) => id !== story.id))} /></td>
                  <td className="max-w-sm p-4">
                    <p className="truncate font-medium text-white">{story.title}</p>
                    <p className="truncate text-xs text-white/40">/{story.slug}</p>
                  </td>
                  <td className="p-4"><span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/65">{story.scheduledAt ? "Scheduled" : story.published ? "Published" : "Draft"}</span></td>
                  <td className="p-4"><span className="text-blue-200">{seoScore(story)}%</span></td>
                  <td className="p-4 text-white/55">{story.views.toLocaleString()} views, {story._count?.comments ?? 0} comments</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/stories/${story.slug}`} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"><Eye className="h-4 w-4" /></Link>
                      <button onClick={() => patchStory(story.id, { published: true })} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-emerald-200"><Upload className="h-4 w-4" /></button>
                      <button onClick={() => duplicateStory(story)} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => patchStory(story.id, { featured: !story.featured })} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-amber-200"><Star className={`h-4 w-4 ${story.featured ? "fill-amber-300 text-amber-300" : ""}`} /></button>
                      <Link href={`/admin/stories/${story.id}`} className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => deleteStory(story.id)} className="rounded-xl p-2 text-white/55 hover:bg-red-500/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((story) => (
            <article key={story.id} className={`${panel} overflow-hidden`}>
              <div className="aspect-video bg-black/30">{story.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.coverImage}
                  alt=""
                  className="h-full w-full"
                  style={storyImageStyle({
                    zoom: story.coverImageZoom,
                    x: story.coverImageX,
                    y: story.coverImageY,
                    objectPosition: story.coverImageObjectPosition,
                    cropMode: story.coverImageCropMode as StoryImageCropMode,
                  })}
                />
              )}</div>
              <div className="space-y-3 p-5">
                <h2 className="line-clamp-2 font-semibold text-white">{story.title}</h2>
                <p className="line-clamp-2 text-sm text-white/50">{story.excerpt}</p>
                <div className="rounded-2xl bg-black/20 p-3 text-xs text-white/45">OG preview: /stories/{story.slug}</div>
                <div className="flex items-center justify-between text-sm text-white/50">
                  <span>SEO {seoScore(story)}%</span>
                  <Link href={`/admin/stories/${story.id}`} className="rounded-xl bg-white/[0.06] px-3 py-2 text-white/75">Edit</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
