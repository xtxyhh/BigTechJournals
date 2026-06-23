"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryCard from "@/components/stories/StoryCard";
import { toStoryCard } from "@/lib/stories";
import { Bookmark, Heart, FolderOpen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "saved" | "liked" | "submissions" | "categories" | "settings";

export default function ProfilePage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [tab, setTab] = useState<Tab>("saved");
  const [bookmarks, setBookmarks] = useState<ReturnType<typeof toStoryCard>[]>([]);
  const [likes, setLikes] = useState<ReturnType<typeof toStoryCard>[]>([]);
  const [follows, setFollows] = useState<{ category: { id: string; name: string; slug: string } }[]>([]);
  const [dbUser, setDbUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/user/me", { method: "POST" }).then((r) => r.ok ? r.json() : null).then(setDbUser);
    fetch("/api/bookmarks").then((r) => r.ok ? r.json() : []).then((data) =>
      setBookmarks(data.map((b: { story: Parameters<typeof toStoryCard>[0] }) => toStoryCard(b.story))),
    );
    fetch("/api/likes").then((r) => r.ok ? r.json() : []).then((data) =>
      setLikes(data.map((l: { story: Parameters<typeof toStoryCard>[0] }) => toStoryCard(l.story))),
    );
    fetch("/api/categories/follow").then((r) => r.ok ? r.json() : []).then(setFollows);
  }, [isSignedIn]);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Sign in to view your profile</h1>
          <Link href="/sign-in" className="mt-4 inline-block px-6 py-2 bg-surface-elevated text-white rounded-full">Sign In</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "saved" as Tab, label: "Saved Stories", icon: Bookmark },
    { id: "liked" as Tab, label: "Liked Stories", icon: Heart },
    { id: "categories" as Tab, label: "Followed Categories", icon: FolderOpen },
    { id: "settings" as Tab, label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            {user?.imageUrl ? (
              <Image src={user.imageUrl} alt={user.fullName ?? "Profile"} width={64} height={64} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.fullName ?? "Your Profile"}</h1>
              <p className="text-surface-muted">{user?.primaryEmailAddress?.emailAddress}</p>
              {dbUser?.role === "ADMIN" && (
                <Link href="/admin" className="text-sm text-brand-blue font-medium mt-1 inline-block">→ Admin Dashboard</Link>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <nav className="lg:w-56 shrink-0">
              <div className="bg-surface-card rounded-2xl border border-surface-border p-2 space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      tab === id ? "bg-brand-blue/20 text-brand-blue" : "text-surface-muted hover:bg-white/[0.05]",
                    )}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex-1">
              {tab === "saved" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Saved Stories</h2>
                  {bookmarks.length ? (
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{bookmarks.map((s) => <StoryCard key={s.id} {...s} />)}</div>
                  ) : (
                    <p className="text-surface-muted">No saved stories yet. <Link href="/stories" className="text-brand-blue">Browse stories →</Link></p>
                  )}
                </div>
              )}

              {tab === "liked" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Liked Stories</h2>
                  {likes.length ? (
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{likes.map((s) => <StoryCard key={s.id} {...s} />)}</div>
                  ) : (
                    <p className="text-surface-muted">No liked stories yet.</p>
                  )}
                </div>
              )}

              {tab === "categories" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Followed Categories</h2>
                  {follows.length ? (
                    <div className="flex flex-wrap gap-3">
                      {follows.map((f) => (
                        <Link key={f.category.id} href={`/category/${f.category.slug}`} className="px-4 py-2 bg-surface-card border border-surface-border rounded-full text-sm font-medium hover:border-brand-blue/30 transition-colors">
                          {f.category.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-surface-muted">Follow categories from story pages to see them here.</p>
                  )}
                </div>
              )}

              {tab === "settings" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                  <div className="bg-surface-card rounded-2xl border border-surface-border p-6 space-y-4">
                    <p className="text-sm text-surface-muted">Manage your account through Clerk.</p>
                    <Link href="/user" className="inline-block px-4 py-2 bg-surface-elevated text-white text-sm rounded-full">Manage Account</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
