"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, Hash, Save, Send } from "lucide-react";
import TipTapEditor from "@/components/editor/TipTapEditor";
import MediaUploader from "@/components/admin/MediaUploader";

type CatalogItem = { id: string; name: string; slug: string };
type Status = "draft" | "published" | "scheduled";

const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5";
const input = "w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminStoryEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [companies, setCompanies] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/catalog?type=companies").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/admin/catalog").then((res) => (res.ok ? res.json() : [])),
    ]).then(([nextCompanies, nextCategories]) => {
      setCompanies(nextCompanies);
      setCategories(nextCategories);
    });
  }, []);

  const readTime = useMemo(() => Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200)), [content]);
  const seoScore = [seoTitle, seoDescription, slug, coverImage].filter(Boolean).length * 25;

  const save = async (nextStatus: Status = status, autosave = false) => {
    if (!title.trim()) return;
    setSaving(true);
    setSaveState("idle");
    const res = await fetch("/api/admin/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || slugify(title),
        excerpt,
        content: markdown ? `${content}<hr><pre>${markdown}</pre>` : content,
        coverImage,
        authorName: "BigTechJournals Editorial",
        published: nextStatus === "published",
        featured,
        readTime,
        companyId: companyId || null,
        categoryIds,
        scheduledAt: nextStatus === "scheduled" && scheduledAt ? scheduledAt : null,
        seoTitle,
        seoDescription,
        seoKeywords: tags,
      }),
    });
    setSaving(false);
    setSaveState(res.ok ? "saved" : "error");
    if (res.ok && !autosave) router.push("/admin/stories");
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (title || content || excerpt) void save("draft", true);
    }, 10000);
    return () => window.clearInterval(timer);
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        <div className={panel}>
          <input
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slug) setSlug(slugify(nextTitle));
            }}
            placeholder="Story title"
            className="w-full bg-transparent text-3xl font-semibold text-white outline-none placeholder:text-white/25 sm:text-4xl"
          />
          <div className="mt-4 flex items-center gap-2 text-sm text-white/45">
            <Hash className="h-4 w-4" />
            <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="story-slug" className="flex-1 bg-transparent outline-none" />
          </div>
        </div>

        <MediaUploader label="Cover image" value={coverImage} onChange={setCoverImage} />

        <div className={panel}>
          <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} placeholder="Short excerpt" className={`${input} resize-none`} />
        </div>

        <div className={panel}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Rich Text Editor</h2>
            <span className="text-xs text-white/40">{readTime} min read</span>
          </div>
          <TipTapEditor content={content} onChange={setContent} editable placeholder="Start writing..." />
        </div>

        <div className={panel}>
          <h2 className="mb-3 font-semibold text-white">Markdown Support</h2>
          <textarea value={markdown} onChange={(event) => setMarkdown(event.target.value)} rows={8} placeholder="Paste markdown notes or source here" className={`${input} resize-y font-mono`} />
        </div>
      </section>

      <aside className="space-y-5">
        <div className={panel}>
          <h2 className="mb-4 font-semibold text-white">Publish</h2>
          <div className="grid grid-cols-3 gap-2">
            {(["draft", "published", "scheduled"] as Status[]).map((item) => (
              <button key={item} onClick={() => setStatus(item)} className={`rounded-2xl px-3 py-2 text-sm capitalize ${status === item ? "bg-blue-500 text-white" : "bg-white/[0.06] text-white/55"}`}>{item}</button>
            ))}
          </div>
          {status === "scheduled" && (
            <label className="mt-4 block">
              <span className="mb-2 block text-xs text-white/45">Scheduled publish</span>
              <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className={input} />
            </label>
          )}
          <label className="mt-4 flex items-center justify-between rounded-2xl bg-black/20 p-3 text-sm text-white/70">
            Featured
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          </label>
          <div className="mt-4 grid gap-2">
            <button onClick={() => save("draft")} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] px-4 py-3 text-sm text-white/75"><Save className="h-4 w-4" /> Save Draft</button>
            <button onClick={() => save("published")} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white"><Send className="h-4 w-4" /> Publish</button>
            <button onClick={() => save("scheduled")} disabled={saving || !scheduledAt} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/75 disabled:opacity-40"><Calendar className="h-4 w-4" /> Schedule</button>
          </div>
          {saveState !== "idle" && <p className={`mt-3 text-sm ${saveState === "saved" ? "text-emerald-300" : "text-red-300"}`}>{saveState === "saved" ? "Saved" : "Save failed"}</p>}
        </div>

        <div className={panel}>
          <h2 className="mb-4 font-semibold text-white">Taxonomy</h2>
          <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className={input}>
            <option value="">No company</option>
            {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
          <div className="mt-3 grid gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-3 rounded-2xl bg-black/20 p-3 text-sm text-white/70">
                <input type="checkbox" checked={categoryIds.includes(category.id)} onChange={(event) => setCategoryIds((current) => event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id))} />
                {category.name}
              </label>
            ))}
          </div>
          <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" className={`${input} mt-3`} />
        </div>

        <div className={panel}>
          <h2 className="mb-4 font-semibold text-white">SEO</h2>
          <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} placeholder="SEO title" className={input} />
          <textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={3} placeholder="SEO description" className={`${input} mt-3 resize-none`} />
          <div className="mt-4 rounded-2xl bg-black/20 p-3">
            <p className="text-xs text-white/40">SEO score</p>
            <p className="mt-1 text-2xl font-semibold text-blue-200">{seoScore}%</p>
          </div>
          <div className="mt-3 rounded-2xl bg-black/20 p-3">
            <p className="text-xs text-white/40">Slug preview</p>
            <p className="mt-1 truncate text-sm text-white/70">/stories/{slug || "story-slug"}</p>
          </div>
        </div>

        <div className={panel}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Eye className="h-4 w-4" /> Live Preview</h2>
          <div className="overflow-hidden rounded-2xl bg-black/20">
            {coverImage && <img src={coverImage} alt="" className="aspect-video w-full object-cover" />}
            <div className="p-4">
              <p className="text-lg font-semibold text-white">{title || "Untitled story"}</p>
              <p className="mt-2 line-clamp-3 text-sm text-white/50">{excerpt || "Excerpt preview appears here."}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
