"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && href !== "#";
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Deepen the navbar shadow once the user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 safe-top px-2 pt-3 pb-2 sm:px-4 sm:pt-4"
        aria-label="Main navigation"
      >
        {/* Ambient glow behind the pill */}
        <div className="absolute left-1/2 -top-5 h-[120px] w-[min(500px,100vw)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />

        <div
          className={cn(
            "relative max-w-7xl mx-auto",
            "backdrop-blur-3xl",
            "bg-[linear-gradient(180deg,rgba(17,17,17,.90),rgba(17,17,17,.74))]",
            "border border-white/[0.08]",
            "rounded-full px-3 sm:px-6 h-14 sm:h-16",
            "flex items-center justify-between",
            "transition-shadow duration-500",
            scrolled
              ? "shadow-[0_12px_60px_rgba(0,0,0,.55),0_0_0_1px_rgba(255,255,255,.04),0_0_90px_rgba(59,130,246,.10)]"
              : "shadow-[0_6px_30px_rgba(0,0,0,.35),0_0_0_1px_rgba(255,255,255,.03)]",
          )}
        >
          {/* ── Left: logo + desktop nav ── */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link
              href="/"
              className="flex min-w-0 shrink-0 items-center gap-2.5 text-sm font-bold tracking-tight text-white min-[375px]:text-base sm:text-lg"
            >
              <Image
                src="/images/logo/logo-dark.png"
                alt=""
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg"
                priority
              />
              <span className="max-w-[9rem] truncate min-[375px]:max-w-none">
                BigTechJournals
              </span>
            </Link>

            {/* Desktop nav links — visible from lg upward */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 xl:px-4 xl:text-sm",
                    isActive(link.href)
                      ? "text-blue-300 bg-blue-500/10 border border-blue-400/10 shadow-[0_0_24px_rgba(59,130,246,.12)]"
                      : "text-white/50 hover:text-white/90 hover:bg-white/[0.05]",
                  )}
                >
                  {link.name}
                  {/* Active dot */}
                  {isActive(link.href) && (
                    <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400/70" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right: actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            <Link
              href="/submit"
              className="hidden 2xl:block whitespace-nowrap px-4 py-2 text-sm font-medium text-white/40 transition-all duration-200 hover:rounded-full hover:bg-white/[0.05] hover:text-blue-400"
            >
              Submit Story
            </Link>

            <SearchButton />

            {isSignedIn ? (
              <div className="flex items-center gap-2 xl:gap-3">
                <Link
                  href="/profile"
                  className="hidden whitespace-nowrap px-3 py-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white xl:block"
                >
                  Profile
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden whitespace-nowrap rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] hover:from-blue-500 hover:to-cyan-400 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] xl:block xl:px-6"
                >
                  Sign In
                </button>
              </SignInButton>
            )}

            {/* Hamburger — visible below lg to match nav link breakpoint */}
            <button
              type="button"
              className="lg:hidden grid min-h-11 min-w-11 place-items-center rounded-full text-white/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {/* Animated icon swap */}
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              id="mobile-nav-menu"
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-2 top-[calc(env(safe-area-inset-top,0px)+4.75rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto p-4 bg-[rgba(17,17,17,0.97)] backdrop-blur-2xl border border-white/[0.08] shadow-2xl rounded-3xl min-[375px]:inset-x-4 min-[375px]:p-5 lg:hidden origin-top"
            >
              <div className="flex flex-col gap-1">
                {/* Nav links with staggered reveal */}
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.028, duration: 0.18 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between min-h-11 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200",
                        isActive(link.href)
                          ? "text-blue-300 bg-blue-500/10 border border-blue-400/10"
                          : "text-white/70 hover:text-white hover:bg-white/[0.05]",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                      {isActive(link.href) && (
                        <ChevronRight className="w-4 h-4 text-blue-400/60 shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Divider + footer actions */}
                <div className="mt-3 pt-3 border-t border-white/[0.07] flex flex-col gap-1.5">
                  <Link
                    href="/submit"
                    className="flex items-center justify-between px-4 py-3 text-base font-medium text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Submit your Story
                    <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
                  </Link>

                  {!isSignedIn ? (
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="w-full mt-1 px-5 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-cyan-400 active:scale-[0.98] transition-all duration-200"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  ) : (
                    <Link
                      href="/profile"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                      <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
                    </Link>
                  )}
                </div>
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