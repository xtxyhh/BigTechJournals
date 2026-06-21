"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, Command, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminTopbarProps = {
  onOpenMobile: () => void;
};

const labels: Record<string, string> = {
  admin: "Admin",
  stories: "Stories",
  new: "New Story",
  users: "Users",
  comments: "Comments",
  newsletter: "Newsletter",
  submissions: "Submissions",
  analytics: "Analytics",
  settings: "Settings",
};

export default function AdminTopbar({ onOpenMobile }: AdminTopbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, index) => ({
      label: labels[part] ?? part.replace(/-/g, " "),
      href: `/${parts.slice(0, index + 1).join("/")}`,
    }));
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#050816]/70 backdrop-blur-2xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onOpenMobile} aria-label="Open navigation" className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3 text-white lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-white/45">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex min-w-0 items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link href={crumb.href} className={cn("truncate capitalize hover:text-white", index === breadcrumbs.length - 1 && "text-white/75")}>
                  {crumb.label}
                </Link>
              </span>
            ))}
          </div>
          <h1 className="mt-1 truncate text-lg font-semibold text-white sm:text-xl">{breadcrumbs.at(-1)?.label ?? "Admin"}</h1>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-11 w-full max-w-xs items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-left text-sm text-white/45 transition hover:border-blue-400/40 hover:text-white md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Search admin</span>
          <kbd className="rounded-lg border border-white/[0.08] px-2 py-1 text-[10px] text-white/45">Ctrl K</kbd>
        </button>

        <div className="relative">
          <button type="button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Open notifications" className="relative rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3 text-white/70 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-400" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-[24px] border border-white/[0.08] bg-[#080d1f] p-3 shadow-2xl shadow-black/40">
              {["Submission queue needs review", "Weekly digest export is ready", "Stories draft autosave active"].map((item) => (
                <div key={item} className="rounded-2xl px-3 py-3 text-sm text-white/70 hover:bg-white/[0.05]">{item}</div>
              ))}
            </div>
          )}
        </div>

        <UserButton appearance={{ elements: { avatarBox: "h-11 w-11" } }} />
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-[24px] border border-white/[0.08] bg-[#080d1f] p-4 shadow-2xl shadow-blue-950/30">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3">
              <Command className="h-5 w-5 text-blue-300" />
              <input autoFocus placeholder="Search stories, users, submissions..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35" />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-white/45 hover:text-white">Esc</button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {["New story", "Review submissions", "Export newsletter", "Open settings"].map((action) => (
                <button key={action} type="button" onClick={() => setSearchOpen(false)} className="rounded-2xl px-4 py-3 text-left text-sm text-white/70 hover:bg-white/[0.05] hover:text-white">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
