"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PanelLeftClose,
  Route,
  Settings,
  SquareKanban,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Stories", href: "/admin/stories", icon: FileText },
  { name: "Resources", href: "/admin/resources", icon: BookOpen },
  { name: "Internships", href: "/admin/internships", icon: SquareKanban },
  { name: "Roadmaps", href: "/admin/roadmaps", icon: Route },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Comments", href: "/admin/comments", icon: MessageSquare },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Submissions", href: "/admin/submissions", icon: Inbox },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

type AdminSidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export default function AdminSidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation backdrop"
        onClick={onCloseMobile}
        className={cn("fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.08] bg-[#050816]/90 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl transition-all duration-300",
          collapsed ? "lg:w-24" : "lg:w-72",
          mobileOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-5">
          <Link href="/admin" className={cn("flex items-center gap-3 overflow-hidden", collapsed && "lg:justify-center")}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
              <FileText className="h-5 w-5 text-white" />
            </span>
            <span className={cn("min-w-0 transition-opacity", collapsed && "lg:hidden")}>
              <span className="block truncate text-sm font-semibold text-white">BigTechJournals</span>
              <span className="block truncate text-xs text-white/45">Admin command</span>
            </span>
          </Link>
          <button type="button" onClick={onCloseMobile} aria-label="Close navigation" className="rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
          <button type="button" onClick={onToggleCollapsed} aria-label="Toggle collapsed sidebar" className="hidden rounded-xl p-2 text-white/55 hover:bg-white/[0.06] hover:text-white lg:grid">
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group relative flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition-all",
                  active ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/58 hover:bg-white/[0.06] hover:text-white",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className={cn("rounded-[24px] border border-white/[0.08] bg-white/[0.05] p-4", collapsed && "lg:p-3")}>
            <PanelLeftClose className="h-5 w-5 text-blue-300" />
            <p className={cn("mt-3 text-xs leading-5 text-white/55", collapsed && "lg:hidden")}>Press Ctrl+K anywhere in admin to jump into search.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
