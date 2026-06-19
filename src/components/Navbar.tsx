"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchButton } from "@/components/SearchModal";

const NAV_LINKS = [
  { name: "Stories", href: "/stories" },
  { name: "Internships", href: "/category/internships" },
  { name: "Career Switch", href: "/category/career-switch" },
  { name: "Companies", href: "/stories?tab=companies" },
  { name: "Submit", href: "/submit" },
];

function NavbarContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && href !== "#";
  };

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto backdrop-blur-xl bg-white/70 border border-white/20 shadow-sm rounded-full px-6 h-16 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
            >
              Big Tech Journals
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-brand-blue bg-blue-50/80 shadow-sm"
                      : "text-slate-600 hover:text-brand-blue hover:bg-slate-50/50",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/submit"
              className="hidden md:block text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors px-4 py-2 hover:bg-slate-50/50 rounded-full"
            >
              Submit your Story
            </Link>
            <SearchButton />
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="hidden md:block text-sm font-medium text-slate-600 hover:text-brand-blue px-3 py-2"
                >
                  Profile
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="hidden md:block px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  Sign In
                </button>
              </SignInButton>
            )}
            <button
              className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            className="fixed inset-x-4 top-24 z-40 p-6 bg-white/95 backdrop-blur-2xl border border-slate-200/50 shadow-2xl rounded-3xl md:hidden origin-top"
          >
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-between group",
                    isActive(link.href) ? "text-brand-blue bg-blue-50" : "text-slate-900 hover:bg-slate-50",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-100 my-4" />
              <Link
                href="/submit"
                className="px-4 py-3 text-lg font-medium text-slate-900 hover:text-brand-blue transition-colors hover:bg-slate-50 rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Submit your Story
              </Link>
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="w-full mt-2 px-5 py-3.5 bg-slate-900 text-white text-base font-medium rounded-xl">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <Link
                  href="/profile"
                  className="w-full mt-2 px-5 py-3.5 bg-slate-900 text-white text-base font-medium rounded-xl text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return <NavbarContent />;
}
