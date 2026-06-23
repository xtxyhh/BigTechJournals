"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, Hash, Monitor, Save, Send, Smartphone, Tablet } from "lucide-react";
import TipTapEditor from "@/components/editor/TipTapEditor";
import MediaUploader from "@/components/admin/MediaUploader";

type CatalogItem = { id: string; name: string; slug: string };
type Status = "draft" | "published" | "scheduled";
type PreviewMode = "desktop" | "tablet" | "mobile";
type LoadedStory = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  seoKeywords?: string | null;
  companyId?: string | null;
  currentCompany?: string | null;
  company?: { name?: string | null } | null;
  companies?: { companyId: string; company?: { name?: string | null } }[];
  categories?: { categoryId: string }[];
  featured?: boolean;
  published?: boolean;
  scheduledAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  interviewProcess?: unknown;
  resources?: unknown;
  advice?: unknown;
  timeline?: unknown;
};

const panel = "rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5";
const input = "w-full rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function textFromHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
}

function jsonContent(value: string) {
  return value.trim() ? { html: value } : null;
}

function jsonToHtml(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "html" in value && typeof value.html === "string") return value.html;
  return "";
}

export default function AdminStoryEditorPageV2({ storyId }: { storyId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyBadges, setCompanyBadges] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [companies, setCompanies] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [interviewProcess, setInterviewProcess] = useState("");
  const [resourcesUsed, setResourcesUsed] = useState("");
  const [tips, setTips] = useState("");
  const [timeline, setTimeline] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error" | "autosaved">("idle");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const draftKey = storyId ? `btj-admin-story-${storyId}-draft` : "btj-admin-story-new-draft";

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/catalog?type=companies").then((res) => (res.ok ? res.json() : [])),
      fetch("/api/admin/catalog").then((res) => (res.ok ? res.json() : [])),
    ]).then(([nextCompanies, nextCategories]) => {
      setCompanies(nextCompanies);
      setCategories(nextCategories);
    });

    if (storyId) {
      fetch(`/api/admin/stories?id=${storyId}`).then((res) => (res.ok ? res.json() as Promise<LoadedStory> : null)).then((story) => {
        if (!story) return;
        setTitle(story.title ?? "");
        setSlug(story.slug ?? "");
        setExcerpt(story.excerpt ?? "");
        setContent(story.content ?? "");
        setCoverImage(story.coverImage ?? "");
        setTags(story.seoKeywords ?? "");
        const linkedCompanyIds = (story.companies ?? []).map((item) => item.companyId);
        setCompanyIds(linkedCompanyIds.length ? linkedCompanyIds : story.companyId ? [story.companyId] : []);
        setCompanyBadges(story.currentCompany ?? (story.companies ?? []).map((item) => item.company?.name).filter(Boolean).join(", ") ?? story.company?.name ?? "");
        setCategoryIds((story.categories ?? []).map((item: { categoryId: string }) => item.categoryId));
        setFeatured(Boolean(story.featured));
        setStatus(story.published ? "published" : story.scheduledAt ? "scheduled" : "draft");
        setScheduledAt(story.scheduledAt ? new Date(story.scheduledAt).toISOString().slice(0, 16) : "");
        setSeoTitle(story.seoTitle ?? "");
        setSeoDescription(story.seoDescription ?? "");
        setInterviewProcess(jsonToHtml(story.interviewProcess));
        setResourcesUsed(jsonToHtml(story.resources));
        setTips(jsonToHtml(story.advice));
        setTimeline(jsonToHtml(story.timeline));
      });
      return;
    }

    queueMicrotask(() => {
      const savedDraft = window.localStorage.getItem(draftKey);
      if (!savedDraft) return;
      const draft = JSON.parse(savedDraft) as Partial<Record<string, string | boolean | string[]>>;
      setTitle((draft.title as string) ?? "");
      setSlug((draft.slug as string) ?? "");
      setExcerpt((draft.excerpt as string) ?? "");
      setContent((draft.content as string) ?? "");
      setCoverImage((draft.coverImage as string) ?? "");
      setTags((draft.tags as string) ?? "");
      setCompanyIds((draft.companyIds as string[]) ?? ((draft.companyId as string) ? [draft.companyId as string] : []));
      setCategoryIds((draft.categoryIds as string[]) ?? []);
      setFeatured(Boolean(draft.featured));
      setSeoTitle((draft.seoTitle as string) ?? "");
      setSeoDescription((draft.seoDescription as string) ?? "");
      setOgImage((draft.ogImage as string) ?? "");
      setInterviewProcess((draft.interviewProcess as string) ?? "");
      setResourcesUsed((draft.resourcesUsed as string) ?? "");
      setTips((draft.tips as string) ?? "");
      setTimeline((draft.timeline as string) ?? "");
    });
  }, [draftKey, storyId]);

  const wordCount = useMemo(() => {
    return [content, interviewProcess, resourcesUsed, tips, timeline]
      .flatMap((value) => textFromHtml(value).split(/\s+/))
      .filter(Boolean).length;
  }, [content, interviewProcess, resourcesUsed, tips, timeline]);
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);
  const seoScore = [seoTitle, seoDescription, slug, coverImage || ogImage, tags].filter(Boolean).length * 20;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        coverImage,
        tags,
        companyIds,
        companyBadges,
        categoryIds,
        featured,
        seoTitle,
        seoDescription,
        ogImage,
        interviewProcess,
        resourcesUsed,
        tips,
        timeline,
      }));
      if (title || content || excerpt) setSaveState("autosaved");
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [draftKey, title, slug, excerpt, content, coverImage, tags, companyIds, companyBadges, categoryIds, featured, seoTitle, seoDescription, ogImage, interviewProcess, resourcesUsed, tips, timeline]);

  const save = async (nextStatus: Status = status) => {
    if (!title.trim()) return;
    setSaving(true);
    setSaveState("idle");
    const res = await fetch("/api/admin/stories", {
      method: storyId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: storyId,
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        coverImage,
        authorName: "BigTechJournals Editorial",
        published: nextStatus === "published",
        status: nextStatus,
        featured,
        readTime,
        companyId: companyIds[0] || null,
        companyIds,
        currentCompany: companyBadges,
        categoryIds,
        scheduledAt: nextStatus === "scheduled" && scheduledAt ? scheduledAt : null,
        seoTitle,
        seoDescription,
        seoKeywords: tags,
        interviewProcess: jsonContent(interviewProcess),
        resources: jsonContent(resourcesUsed),
        advice: jsonContent(tips),
        timeline: jsonContent(timeline),
        mistakes: null,
      }),
    });
    setSaving(false);
    setSaveState(res.ok ? "saved" : "error");
    if (res.ok) {
      window.localStorage.removeItem(draftKey);
      router.push("/admin/stories");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-5">
        <EditorSection title="Basic Information" description="Title, slug, subtitle, cover image, companies, categories, tags, and featured status.">
          <input
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slug) setSlug(slugify(nextTitle));
            }}
            placeholder="Story title"
            className="w-full bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/25 sm:text-4xl"
          />
          <div className="mt-4 flex items-center gap-2 text-sm text-white/45">
            <Hash className="h-4 w-4" />
            <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="story-slug" className="min-w-0 flex-1 bg-transparent outline-none" />
          </div>
          <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} placeholder="Subtitle / short excerpt" className={`${input} mt-4 resize-none`} />
          <div className="mt-4">
            <MediaUploader label="Cover image" value={coverImage} onChange={setCoverImage} />
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="grid max-h-56 gap-2 overflow-y-auto rounded-2xl border border-white/[0.08] bg-black/20 p-3">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">Companies</p>
              {companies.map((company) => (
                <label key={company.id} className="flex min-h-9 items-center gap-3 rounded-xl px-2 text-sm text-white/70 hover:bg-white/[0.05]">
                  <input type="checkbox" checked={companyIds.includes(company.id)} onChange={(event) => setCompanyIds((current) => event.target.checked ? [...current, company.id] : current.filter((id) => id !== company.id))} />
                  {company.name}
                </label>
              ))}
            </div>
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags, comma separated" className={input} />
          </div>
          <input value={companyBadges} onChange={(event) => setCompanyBadges(event.target.value)} placeholder="Company badges, comma separated" className={`${input} mt-3`} />
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <label key={category.id} className="flex min-h-11 items-center gap-3 rounded-2xl bg-black/20 p-3 text-sm text-white/70">
                <input type="checkbox" checked={categoryIds.includes(category.id)} onChange={(event) => setCategoryIds((current) => event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id))} />
                {category.name}
              </label>
            ))}
          </div>
          <label className="mt-4 flex min-h-11 items-center justify-between rounded-2xl bg-black/20 p-3 text-sm text-white/70">
            Featured
            <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          </label>
        </EditorSection>

        <EditorSection title="Story" description="Main rich text editor with autosave, word count, and reading time.">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
            <span>{wordCount} words</span>
            <span>{readTime} min read</span>
            <span>{saveState === "autosaved" ? "Autosaved locally" : "Autosave enabled"}</span>
          </div>
          <TipTapEditor content={content} onChange={setContent} editable placeholder="Start writing the journey..." />
        </EditorSection>

        <EditorBlock title="Interview Process" value={interviewProcess} onChange={setInterviewProcess} placeholder="Round 1, Round 2, OA, Technical, HR, System Design, Behavioral..." />
        <EditorBlock title="Resources Used" value={resourcesUsed} onChange={setResourcesUsed} placeholder="DSA resources, system design resources, courses, YouTube channels, books, roadmaps..." />
        <EditorBlock title="Tips For Readers" value={tips} onChange={setTips} placeholder="Mistakes to avoid, preparation tips, advice..." />
        <EditorBlock title="Timeline" value={timeline} onChange={setTimeline} placeholder="Week-by-week preparation, application dates, recruiter calls, interviews, offer, and final outcome..." />

        <EditorSection title="SEO" description="Meta title, meta description, keywords, OG image, and score.">
          <div className="grid gap-3 lg:grid-cols-2">
            <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} placeholder="Meta title" className={input} />
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Keywords" className={input} />
          </div>
          <textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} rows={3} placeholder="Meta description" className={`${input} mt-3 resize-none`} />
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]">
            <MediaUploader label="OG image" value={ogImage} onChange={setOgImage} />
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-xs text-white/40">SEO score</p>
              <p className="mt-1 text-3xl font-semibold text-blue-200">{seoScore}%</p>
              <p className="mt-3 break-all text-xs text-white/40">/stories/{slug || "story-slug"}</p>
            </div>
          </div>
        </EditorSection>

        <EditorSection title="Preview" description="Check desktop, tablet, and mobile story framing before publishing.">
          <div className="mb-4 flex flex-wrap gap-2">
            {([
              ["desktop", Monitor, "Desktop preview"],
              ["tablet", Tablet, "Tablet preview"],
              ["mobile", Smartphone, "Mobile preview"],
            ] as const).map(([mode, Icon, label]) => (
              <button key={mode} type="button" onClick={() => setPreviewMode(mode)} className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 text-sm ${previewMode === mode ? "bg-blue-500 text-white" : "bg-black/20 text-white/65"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
          <PreviewCard mode={previewMode} title={title} excerpt={excerpt} coverImage={coverImage || ogImage} content={content} />
        </EditorSection>
      </section>

      <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <div className={panel}>
          <h2 className="mb-4 font-semibold text-white">Publish</h2>
          <div className="grid grid-cols-3 gap-2">
            {(["draft", "published", "scheduled"] as Status[]).map((item) => (
              <button key={item} type="button" onClick={() => setStatus(item)} className={`min-h-11 rounded-2xl px-3 py-2 text-sm capitalize ${status === item ? "bg-blue-500 text-white" : "bg-white/[0.06] text-white/55"}`}>{item}</button>
            ))}
          </div>
          {status === "scheduled" && (
            <label className="mt-4 block">
              <span className="mb-2 block text-xs text-white/45">Scheduled publish</span>
              <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className={input} />
            </label>
          )}
          <div className="mt-4 grid gap-2">
            <button type="button" onClick={() => save("draft")} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] px-4 py-3 text-sm text-white/75 disabled:opacity-50"><Save className="h-4 w-4" /> Save Draft</button>
            <button type="button" onClick={() => save("published")} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><Send className="h-4 w-4" /> Publish</button>
            <button type="button" onClick={() => save("scheduled")} disabled={saving || !scheduledAt} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/75 disabled:opacity-40"><Calendar className="h-4 w-4" /> Schedule</button>
            {storyId && <button type="button" onClick={async () => { if (confirm("Delete this story?")) { await fetch(`/api/admin/stories?id=${storyId}`, { method: "DELETE" }); router.push("/admin/stories"); } }} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200 disabled:opacity-50">Delete</button>}
          </div>
          {saveState !== "idle" && <p className={`mt-3 text-sm ${saveState === "error" ? "text-red-300" : "text-emerald-300"}`}>{saveState === "error" ? "Save failed" : saveState === "autosaved" ? "Autosaved locally" : "Saved"}</p>}
        </div>

        <div className={panel}>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Eye className="h-4 w-4" /> Snapshot</h2>
          <PreviewCard mode="mobile" title={title} excerpt={excerpt} coverImage={coverImage || ogImage} content={content} compact />
        </div>
      </aside>
    </div>
  );
}

function EditorSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className={panel}>
      <div className="mb-5">
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/45">{description}</p>
      </div>
      {children}
    </div>
  );
}

function EditorBlock({ title, value, onChange, placeholder }: { title: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <EditorSection title={title} description={placeholder}>
      <TipTapEditor content={value} onChange={onChange} editable placeholder={placeholder} minHeightClass="min-h-[280px]" />
    </EditorSection>
  );
}

function PreviewCard({ mode, title, excerpt, coverImage, content, compact = false }: { mode: PreviewMode; title: string; excerpt: string; coverImage: string; content: string; compact?: boolean }) {
  const width = mode === "desktop" ? "max-w-4xl" : mode === "tablet" ? "max-w-2xl" : "max-w-sm";
  return (
    <div className={`mx-auto overflow-hidden rounded-2xl bg-black/20 ${width}`}>
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10" />
      )}
      <div className={compact ? "p-4" : "p-6"}>
        <p className={`${compact ? "text-lg" : "text-2xl"} font-semibold text-white`}>{title || "Untitled story"}</p>
        <p className="mt-2 line-clamp-3 text-sm text-white/55">{excerpt || "Excerpt preview appears here."}</p>
        {!compact && <div className="mt-5 line-clamp-4 text-sm leading-6 text-white/65" dangerouslySetInnerHTML={{ __html: content || "<p>Story content preview appears here.</p>" }} />}
      </div>
    </div>
  );
}
