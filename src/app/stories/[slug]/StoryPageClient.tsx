"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { useLike, useBookmark } from "@/hooks/useStories";
import {
  Heart,
  Bookmark,
  Share2,
  Linkedin,
  Twitter,
  Link2,
  Eye,
  Clock,
  MessageCircle,
} from "lucide-react";
import { formatReadTime, formatViews } from "@/lib/seo";
import type { StoryCardProps } from "@/components/stories/StoryCard";

interface StoryData {
  id: string;
  title: string;
  slug: string;
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
  company?: { name: string; slug: string } | null;
  categories: { category: { id: string; name: string; slug: string } }[];
  comments?: { id: string; content: string; createdAt: string; user: { name: string | null; image: string | null } }[];
}

interface StoryPageClientProps {
  slug: string;
}

export default function StoryPageClient({ slug }: StoryPageClientProps) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [recommended, setRecommended] = useState<StoryCardProps[]>([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: string; content: string; createdAt: string; user: { name: string | null; image: string | null } }[]>([]);
  const [loading, setLoading] = useState(true);

  const { liked, toggle: toggleLike } = useLike(story?.id ?? "");
  const { bookmarked, toggle: toggleBookmark } = useBookmark(story?.id ?? "");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/stories/${slug}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const s = await res.json();
      setStory(s);
      setComments(s.comments ?? []);
      setLoading(false);

      fetch(`/api/stories/${slug}`, { method: "POST" });

      const recRes = await fetch(`/api/stories?company=${s.company?.slug ?? ""}&limit=4`);
      if (recRes.ok) {
        const d = await recRes.json();
        setRecommended(d.stories.filter((st: { id: string }) => st.id !== s.slug));
      }
    }
    load();
  }, [slug]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story || !comment.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id, content: comment }),
    });
    if (res.status === 401) {
      window.location.href = "/sign-in";
      return;
    }
    const newComment = await res.json();
    setComments((prev) => [newComment, ...prev]);
    setComment("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 max-w-3xl mx-auto px-4 animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-64 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Story not found</h1>
          <Link href="/stories" className="text-blue-600 mt-4 inline-block">← Back to stories</Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <article className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Cover */}
      <div className="pt-16">
        {story.coverImage && (
          <div className="relative h-64 md:h-96 w-full">
            <Image src={story.coverImage} alt={story.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            {story.categories.map(({ category }) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                {category.name}
              </Link>
            ))}
            {story.company && (
              <Link href={`/company/${story.company.slug}`} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {story.company.name}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">{story.title}</h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            {story.authorImage ? (
              <Image src={story.authorImage} alt={story.authorName} width={48} height={48} className="rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {story.authorName[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900">{story.authorName}</p>
              {story.authorRole && <p className="text-sm text-slate-500">{story.authorRole}</p>}
            </div>
            <div className="ml-auto flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatReadTime(story.readTime)}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatViews(story.views)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{story.content}</ReactMarkdown>
          </div>

          {/* Author Connect */}
          {(story.linkedin || story.twitter || story.instagram) && (
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Connect with {story.authorName}</h3>
              <div className="flex gap-3">
                {story.linkedin && (
                  <a href={story.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-300 transition-colors">
                    LinkedIn
                  </a>
                )}
                {story.twitter && (
                  <a href={story.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-300 transition-colors">
                    Twitter
                  </a>
                )}
                {story.instagram && (
                  <a href={story.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-blue-300 transition-colors">
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Engagement */}
          <div className="mt-8 flex flex-wrap items-center gap-3 pt-8 border-t border-slate-100">
            <button onClick={toggleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${liked ? "bg-red-50 border-red-200 text-red-600" : "border-slate-200 hover:border-red-200"}`}>
              <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} /> Like
            </button>
            <button onClick={toggleBookmark} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${bookmarked ? "bg-blue-50 border-blue-200 text-blue-600" : "border-slate-200 hover:border-blue-200"}`}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-blue-500" : ""}`} /> Save
            </button>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-blue-200 transition-colors">
              <Linkedin className="w-4 h-4" /> Share
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-blue-200 transition-colors">
              <Twitter className="w-4 h-4" /> Tweet
            </a>
            <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-blue-200 transition-colors">
              <Link2 className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Comments ({comments.length})
          </h3>
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-slate-200 rounded-xl resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="mt-3 px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors">
              Post Comment
            </button>
          </form>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
                  {c.user.name?.[0] ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.user.name ?? "Anonymous"}</p>
                  <p className="text-sm text-slate-600 mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mt-12 mb-20">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Recommended Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {recommended.map((s) => (
                <StoryCard key={s.id} {...s} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </article>
  );
}
