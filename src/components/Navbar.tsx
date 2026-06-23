"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchButton } from "@/components/SearchModal";

const NAV_LINKS = [
  { name: "Stories", href: "/stories" },
  { name: "Companies", href: "/companies" },
  { name: "Internships", href: "/internships" },
  { name: "Resources", href: "/resources" },
  { name: "Trending", href: "/trending" },
  { name: "About", href: "/about" },
  { name: "Submit", href: "/submit" },
];

function NavbarContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && href !== "#";
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 safe-top px-2 pt-3 pb-2 sm:px-4 sm:pt-4"
        aria-label="Main navigation"
      >
        <div className="absolute left-1/2 -top-5 h-[120px] w-[min(500px,100vw)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />
        <div
          className={cn(
            "relative max-w-7xl mx-auto",
            "backdrop-blur-3xl",
            "bg-[linear-gradient(180deg,rgba(17,17,17,.88),rgba(17,17,17,.72))]",
            "border border-white/[0.08]",
            "shadow-[0_10px_50px_rgba(0,0,0,.45),0_0_0_1px_rgba(255,255,255,.03),0_0_80px_rgba(59,130,246,.08)]",
            "rounded-full px-3 sm:px-7 h-14 sm:h-16",
            "flex items-center justify-between",
            "transition-all duration-300",
          )}
        >
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <Link
              href="/"
              className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-bold tracking-tight text-white min-[375px]:text-base sm:text-xl"
            >
              <Image src="/images/logo/logo-dark.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" priority />
              <span className="max-w-[9rem] truncate min-[375px]:max-w-none">BigTechJournals</span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-medium transition-all duration-200 xl:px-4 xl:text-sm",
                    isActive(link.href)
                      ? "text-blue-300 bg-blue-500/10 border border-blue-400/10 shadow-[0_0_30px_rgba(59,130,246,.12)]"
                      : "text-surface-muted hover:text-blue-300 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(59,130,246,.08)]",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
            <Link
              href="/submit"
              className="hidden whitespace-nowrap px-4 py-2 text-sm font-medium text-surface-muted transition-colors hover:rounded-full hover:bg-white/[0.05] hover:text-blue-400 2xl:block"
            >
              Submit your Story
            </Link>
            <SearchButton />
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="hidden whitespace-nowrap px-3 py-2 text-sm font-medium text-surface-muted transition-colors hover:text-blue-400 xl:block"
                >
                  Profile
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-cyan-500 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] xl:block xl:px-7"
                >
                  Sign In
                </button>
              </SignInButton>
            )}
            <button
              type="button"
              className="md:hidden grid min-h-11 min-w-11 place-items-center text-surface-muted hover:text-white hover:bg-white/[0.05] rounded-full transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, scale: 0.98, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-2 top-[calc(env(safe-area-inset-top,0px)+4.75rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto p-4 bg-surface-card/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl rounded-3xl min-[375px]:inset-x-4 min-[375px]:p-6 md:hidden origin-top"
            >
              <div className="flex flex-col space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "min-h-11 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      isActive(link.href)
                        ? "text-brand-blue bg-blue-500/10"
                        : "text-white hover:bg-white/[0.05]",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-white/[0.08] my-4" />
                <Link
                  href="/submit"
                  className="px-4 py-3 text-lg font-medium text-white hover:text-brand-blue transition-colors hover:bg-white/[0.05] rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submit your Story
                </Link>
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full mt-2 px-5 py-3.5 bg-surface-elevated text-white text-base font-medium rounded-xl hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                ) : (
                  <Link
                    href="/profile"
                    className="w-full mt-2 px-5 py-3.5 bg-surface-elevated text-white text-base font-medium rounded-xl text-center hover:bg-white/[0.08] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return <NavbarContent />;
}
