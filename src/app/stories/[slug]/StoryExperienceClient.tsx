"use client";

import { ComponentPropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bookmark,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  Heart,
  Linkedin,
  Maximize2,
  MessageCircle,
  Twitter,
  UserRound,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StoryCard, { type StoryCardProps } from "@/components/stories/StoryCard";
import { useBookmark, useLike } from "@/hooks/useStories";
import { formatReadTime, formatViews, slugify } from "@/lib/seo";
import { cn } from "@/lib/utils";

type StoryComment = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
};

type StoryData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  authorName: string;
  authorImage?: string | null;
  authorRole?: string | null;
  readTime: number;
  views: number;
  linkedin?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  company?: { name: string; slug: string; logo?: string | null; description?: string | null } | null;
  categories: { category: { id: string; name: string; slug: string } }[];
  comments?: StoryComment[];
};

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TipTapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type TipTapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TipTapMark[];
  content?: TipTapNode[];
};

type RenderedContent =
  | { type: "markdown"; source: string; toc: TocItem[] }
  | { type: "html"; html: string; toc: TocItem[] }
  | { type: "tiptap"; doc: TipTapNode; toc: TocItem[] };

type StoryExperienceClientProps = {
  initialStory: StoryData;
  recommended: StoryCardProps[];
  previousStory: StoryCardProps | null;
  nextStory: StoryCardProps | null;
};

const articleText =
  "text-[1.05rem] leading-8 text-white/78 md:text-[1.12rem] md:leading-9";

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  return "";
}

function textFromTipTap(node: TipTapNode): string {
  if (node.text) return node.text;
  return node.content?.map(textFromTipTap).join("") ?? "";
}

function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.startsWith("/") || value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

function headingId(text: string): string {
  return slugify(text || "section");
}

function isTipTapDoc(value: unknown): value is TipTapNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as TipTapNode).type === "doc" &&
    Array.isArray((value as TipTapNode).content)
  );
}

function extractMarkdownToc(content: string): TocItem[] {
  return content
    .split("\n")
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      id: headingId(match[2].replace(/[*_`]/g, "")),
      text: match[2].replace(/[*_`]/g, ""),
      level: match[1].length,
    }));
}

function extractHtmlToc(html: string): TocItem[] {
  const toc: TocItem[] = [];
  html.replace(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi, (_match, level: string, rawText: string) => {
    const text = rawText.replace(/<[^>]+>/g, "").trim();
    if (text) toc.push({ id: headingId(text), text, level: Number(level) });
    return "";
  });
  return toc;
}

function addHtmlHeadingIds(html: string): string {
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level: string, attrs: string, rawText: string) => {
    if (/\sid=/.test(attrs)) return match;
    const text = rawText.replace(/<[^>]+>/g, "").trim();
    return `<h${level}${attrs} id="${headingId(text)}">${rawText}</h${level}>`;
  });
}

function extractTipTapToc(doc: TipTapNode): TocItem[] {
  const toc: TocItem[] = [];
  const visit = (node: TipTapNode) => {
    if (node.type === "heading") {
      const level = Number(node.attrs?.level ?? 2);
      if (level === 2 || level === 3) {
        const text = textFromTipTap(node).trim();
        if (text) toc.push({ id: headingId(text), text, level });
      }
    }
    node.content?.forEach(visit);
  };
  visit(doc);
  return toc;
}

function detectContent(content: string): RenderedContent {
  const trimmed = content.trim();

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (isTipTapDoc(parsed)) {
      return { type: "tiptap", doc: parsed, toc: extractTipTapToc(parsed) };
    }
  } catch {
    // Not JSON content.
  }

  if (/<\/?(p|h[1-6]|strong|span|blockquote|pre|code|ul|ol|li|img|a)\b/i.test(trimmed)) {
    const clean = DOMPurify.sanitize(trimmed, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["target", "rel", "class", "id", "loading"],
    });
    const html = addHtmlHeadingIds(clean);
    return { type: "html", html, toc: extractHtmlToc(html) };
  }

  return { type: "markdown", source: content, toc: extractMarkdownToc(content) };
}

function renderMarks(text: ReactNode, marks?: TipTapMark[]) {
  return (marks ?? []).reduce<ReactNode>((current, mark) => {
    if (mark.type === "bold") return <strong className="font-semibold text-white">{current}</strong>;
    if (mark.type === "italic") return <em>{current}</em>;
    if (mark.type === "code") return <code className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-sm text-blue-100">{current}</code>;
    if (mark.type === "link") {
      const href = safeUrl(mark.attrs?.href);
      if (!href) return current;
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline decoration-blue-400/40 underline-offset-4 hover:text-blue-200">
          {current}
        </a>
      );
    }
    return current;
  }, text);
}

function renderTipTapNode(node: TipTapNode, index: number, onZoom: (src: string) => void): ReactNode {
  if (node.type === "text") return <span key={index}>{renderMarks(node.text ?? "", node.marks)}</span>;

  const children = node.content?.map((child, childIndex) => renderTipTapNode(child, childIndex, onZoom));
  const text = textFromTipTap(node).trim();

  switch (node.type) {
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const id = headingId(text);
      if (level === 1) return <h1 key={index} className="mt-12 text-4xl font-bold text-white" id={id}>{children}</h1>;
      if (level === 3) return <h3 key={index} className="mt-9 text-2xl font-semibold text-white" id={id}>{children}</h3>;
      return <h2 key={index} className="mt-12 text-3xl font-semibold text-white" id={id}>{children}</h2>;
    }
    case "paragraph":
      return <p key={index} className={cn(articleText, "my-6")}>{children}</p>;
    case "bulletList":
      return <ul key={index} className="my-6 list-disc space-y-2 pl-6 text-white/78">{children}</ul>;
    case "orderedList":
      return <ol key={index} className="my-6 list-decimal space-y-2 pl-6 text-white/78">{children}</ol>;
    case "listItem":
      return <li key={index} className="pl-1 leading-8">{children}</li>;
    case "blockquote":
      return <blockquote key={index} className="my-8 border-l-2 border-blue-400/70 bg-white/[0.04] px-6 py-4 text-xl leading-9 text-white/88">{children}</blockquote>;
    case "codeBlock":
      return <pre key={index} className="my-8 overflow-x-auto rounded-3xl border border-white/[0.08] bg-black/45 p-5 text-sm text-blue-100"><code>{text}</code></pre>;
    case "horizontalRule":
      return <hr key={index} className="my-12 border-white/[0.08]" />;
    case "image": {
      const src = safeUrl(node.attrs?.src);
      if (!src) return null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      return (
        <button key={index} type="button" onClick={() => onZoom(src)} className="group relative my-8 block w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full object-cover transition duration-300 group-hover:scale-[1.01]" />
          <span className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white opacity-0 backdrop-blur-xl transition group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
      );
    }
    default:
      return <div key={index}>{children}</div>;
  }
}

function MarkdownContent({ source, onZoom }: { source: string; onZoom: (src: string) => void }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 id={headingId(textFromChildren(children))} className="mt-12 text-4xl font-bold text-white">{children}</h1>,
        h2: ({ children }) => <h2 id={headingId(textFromChildren(children))} className="mt-12 text-3xl font-semibold text-white">{children}</h2>,
        h3: ({ children }) => <h3 id={headingId(textFromChildren(children))} className="mt-9 text-2xl font-semibold text-white">{children}</h3>,
        p: ({ children }) => <p className={cn(articleText, "my-6")}>{children}</p>,
        a: ({ href, children }) => {
          const safeHref = safeUrl(href);
          return safeHref ? <a href={safeHref} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline decoration-blue-400/40 underline-offset-4 hover:text-blue-200">{children}</a> : <>{children}</>;
        },
        blockquote: ({ children }) => <blockquote className="my-8 border-l-2 border-blue-400/70 bg-white/[0.04] px-6 py-4 text-xl leading-9 text-white/88">{children}</blockquote>,
        ul: ({ children }) => <ul className="my-6 list-disc space-y-2 pl-6 text-white/78">{children}</ul>,
        ol: ({ children }) => <ol className="my-6 list-decimal space-y-2 pl-6 text-white/78">{children}</ol>,
        li: ({ children }) => <li className="pl-1 leading-8">{children}</li>,
        pre: ({ children }) => <pre className="my-8 overflow-x-auto rounded-3xl border border-white/[0.08] bg-black/45 p-5 text-sm text-blue-100">{children}</pre>,
        code: ({ className, children }: ComponentPropsWithoutRef<"code">) => (
          <code className={cn("rounded-md bg-white/[0.08] px-1.5 py-0.5 text-sm text-blue-100", className)}>
            {children}
          </code>
        ),
        img: ({ src, alt }) => {
          const safeSrc = safeUrl(src);
          if (!safeSrc) return null;
          return (
            <button type="button" onClick={() => onZoom(safeSrc)} className="group relative my-8 block w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeSrc} alt={alt ?? ""} className="w-full object-cover transition duration-300 group-hover:scale-[1.01]" />
            </button>
          );
        },
      }}
    >
      {source}
    </ReactMarkdown>
  );
}

function StoryLinkCard({ story, direction }: { story: StoryCardProps; direction: "previous" | "next" }) {
  return (
    <Link href={`/stories/${story.id}`} className="group rounded-3xl border border-white/[0.08] bg-white/[0.05] p-5 transition hover:border-blue-400/35 hover:bg-white/[0.075]">
      <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
        {direction === "previous" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {direction === "previous" ? "Previous story" : "Next story"}
      </span>
      <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-blue-200">{story.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">{story.excerpt}</p>
    </Link>
  );
}

export default function StoryExperienceClient({
  initialStory,
  recommended,
  previousStory,
  nextStory,
}: StoryExperienceClientProps) {
  const [story] = useState(initialStory);
  const [comments, setComments] = useState<StoryComment[]>(initialStory.comments ?? []);
  const [comment, setComment] = useState("");
  const [progress, setProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const rendered = useMemo(() => detectContent(story.content), [story.content]);
  const { liked, toggle: toggleLike } = useLike(story.id);
  const { bookmarked, toggle: toggleBookmark } = useBookmark(story.id);

  useEffect(() => {
    const currentUrl = window.location.href;
    window.requestAnimationFrame(() => setShareUrl(currentUrl));
    void fetch(`/api/stories/${story.slug}`, { method: "POST" });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [story.slug]);

  const handleComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) return;

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id, content: comment }),
    });

    if (response.status === 401) {
      window.location.href = "/sign-in";
      return;
    }

    if (!response.ok) return;
    const newComment = (await response.json()) as StoryComment;
    setComments((current) => [newComment, ...current]);
    setComment("");
  };

  const copyLink = async () => {
    if (shareUrl) await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <article className="min-h-screen bg-[#050816] text-white">
      <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-white/[0.06]">
        <div className="h-full bg-blue-500 transition-[width]" style={{ width: `${progress}%` }} />
      </div>
      <Navbar />

      <header className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_28%)]" />
        {story.coverImage && (
          <div className="absolute inset-x-0 top-16 h-[30rem] opacity-35">
            <Image src={story.coverImage} alt="" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/20 via-[#050816]/75 to-[#050816]" />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {story.categories.map(({ category }) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
                {category.name}
              </Link>
            ))}
            {story.company && (
              <Link href={`/company/${story.company.slug}`} className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/65">
                {story.company.name}
              </Link>
            )}
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {story.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">{story.excerpt}</p>

          <div className="mt-8 flex flex-col gap-5 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {story.authorImage ? (
                <Image src={story.authorImage} alt={story.authorName} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-1 ring-white/[0.12]" />
              ) : (
                <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-500/15 text-lg font-bold text-blue-200 ring-1 ring-blue-300/20">
                  {story.authorName[0]}
                </div>
              )}
              <div>
                <p className="font-semibold text-white">{story.authorName}</p>
                <p className="text-sm text-white/55">{story.authorRole ?? "BigTechJournals contributor"}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/55">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatReadTime(story.readTime)}</span>
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatViews(story.views)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[220px_minmax(0,760px)_260px] lg:px-8">
        <aside className="hidden lg:block">
          {rendered.toc.length > 0 && (
            <nav className="sticky top-28 rounded-3xl border border-white/[0.08] bg-white/[0.05] p-4 backdrop-blur-xl" aria-label="Table of contents">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">On this page</p>
              <div className="space-y-1">
                {rendered.toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={cn("block rounded-2xl px-3 py-2 text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white", item.level === 3 && "pl-6 text-xs")}>
                    {item.text}
                  </a>
                ))}
              </div>
            </nav>
          )}
        </aside>

        <div className="min-w-0">
          <section
            className="story-content rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 md:p-10"
            onClick={(event) => {
              const target = event.target;
              if (target instanceof HTMLImageElement && target.src) setZoomedImage(target.src);
            }}
          >
            {rendered.type === "markdown" && <MarkdownContent source={rendered.source} onZoom={setZoomedImage} />}
            {rendered.type === "html" && <div className="html-story" dangerouslySetInnerHTML={{ __html: rendered.html }} />}
            {rendered.type === "tiptap" && rendered.doc.content?.map((node, index) => renderTipTapNode(node, index, setZoomedImage))}
          </section>

          <section className="mt-6 flex flex-wrap items-center gap-3 rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4 backdrop-blur-xl">
            <button type="button" onClick={toggleLike} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition", liked ? "border-red-400/30 bg-red-500/15 text-red-200" : "border-white/[0.1] text-white/68 hover:border-red-400/35 hover:text-red-200")}>
              <Heart className={cn("h-4 w-4", liked && "fill-red-400")} /> Like
            </button>
            <button type="button" onClick={toggleBookmark} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition", bookmarked ? "border-blue-400/30 bg-blue-500/15 text-blue-200" : "border-white/[0.1] text-white/68 hover:border-blue-400/35 hover:text-blue-200")}>
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-blue-300")} /> Bookmark
            </button>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm font-medium text-white/68 transition hover:border-blue-400/35 hover:text-blue-200">
              <Linkedin className="h-4 w-4" /> Share
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story.title)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm font-medium text-white/68 transition hover:border-blue-400/35 hover:text-blue-200">
              <Twitter className="h-4 w-4" /> Tweet
            </a>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] px-4 py-2 text-sm font-medium text-white/68 transition hover:border-blue-400/35 hover:text-blue-200">
              <Copy className="h-4 w-4" /> Copy link
            </button>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {previousStory && <StoryLinkCard story={previousStory} direction="previous" />}
            {nextStory && <StoryLinkCard story={nextStory} direction="next" />}
          </section>

          <section className="mt-8 rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
              <MessageCircle className="h-5 w-5 text-blue-300" /> Comments ({comments.length})
            </h2>
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share a thoughtful note..."
                className="h-28 w-full resize-none rounded-3xl border border-white/[0.08] bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-blue-400/45"
              />
              <button type="submit" className="mt-3 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">
                Post comment
              </button>
            </form>
            <div className="space-y-3">
              {comments.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-3xl bg-black/20 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-200">
                    {item.user.name?.[0] ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.user.name ?? "Anonymous"}</p>
                    <p className="mt-1 text-sm leading-6 text-white/62">{item.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-white/45">No comments yet. Start the conversation.</p>}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <UserRound className="h-4 w-4 text-blue-300" /> Author
            </p>
            <p className="text-lg font-semibold text-white">{story.authorName}</p>
            <p className="mt-1 text-sm leading-6 text-white/55">{story.authorRole ?? "Contributor sharing a real career journey."}</p>
            {(story.linkedin || story.twitter || story.instagram) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {story.linkedin && <a href={story.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-white/65 hover:text-blue-200">LinkedIn</a>}
                {story.twitter && <a href={story.twitter} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-white/65 hover:text-blue-200">Twitter</a>}
                {story.instagram && <a href={story.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-white/65 hover:text-blue-200">Instagram</a>}
              </div>
            )}
          </section>

          {story.company && (
            <Link href={`/company/${story.company.slug}`} className="block rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-xl transition hover:border-blue-400/30">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Building2 className="h-4 w-4 text-blue-300" /> Company
              </p>
              <p className="text-lg font-semibold text-white">{story.company.name}</p>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-white/55">{story.company.description ?? "Explore interviews, resources, and career stories for this company."}</p>
            </Link>
          )}
        </aside>
      </main>

      {recommended.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Recommended</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Read next</h2>
            </div>
            <Link href="/stories" className="hidden rounded-full border border-white/[0.1] px-4 py-2 text-sm text-white/65 hover:text-white sm:inline-flex">
              All stories
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recommended.map((item) => <StoryCard key={item.id} {...item} />)}
          </div>
        </section>
      )}

      {zoomedImage && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-xl" onClick={() => setZoomedImage(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoomedImage} alt="" className="max-h-[88vh] max-w-full rounded-3xl object-contain shadow-2xl" />
        </div>
      )}

      <style jsx global>{`
        .html-story h1,
        .html-story h2,
        .html-story h3,
        .story-content h1,
        .story-content h2,
        .story-content h3 {
          scroll-margin-top: 7rem;
        }
        .html-story h1 {
          margin-top: 3rem;
          font-size: 2.25rem;
          line-height: 1.15;
          font-weight: 700;
        }
        .html-story h2 {
          margin-top: 3rem;
          font-size: 1.875rem;
          line-height: 1.25;
          font-weight: 650;
        }
        .html-story h3 {
          margin-top: 2.25rem;
          font-size: 1.5rem;
          line-height: 1.3;
          font-weight: 650;
        }
        .html-story p,
        .html-story li {
          color: rgba(255, 255, 255, 0.78);
          font-size: 1.08rem;
          line-height: 2rem;
        }
        .html-story p {
          margin: 1.5rem 0;
        }
        .html-story a {
          color: #93c5fd;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: rgba(96, 165, 250, 0.45);
        }
        .html-story strong {
          color: #ffffff;
          font-weight: 650;
        }
        .html-story blockquote {
          margin: 2rem 0;
          border-left: 2px solid rgba(96, 165, 250, 0.8);
          background: rgba(255, 255, 255, 0.04);
          padding: 1rem 1.5rem;
          color: rgba(255, 255, 255, 0.88);
          font-size: 1.25rem;
          line-height: 2.15rem;
        }
        .html-story pre {
          margin: 2rem 0;
          overflow-x: auto;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.45);
          padding: 1.25rem;
          color: #dbeafe;
        }
        .html-story code {
          border-radius: 0.45rem;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.12rem 0.4rem;
          color: #dbeafe;
          font-size: 0.9em;
        }
        .html-story pre code {
          background: transparent;
          padding: 0;
        }
        .html-story img {
          margin: 2rem 0;
          width: 100%;
          cursor: zoom-in;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
      <Footer />
    </article>
  );
}
