"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchButton } from "@/components/SearchModal";

const NAV_LINKS = [
  { name: "Stories",     href: "/stories" },
  { name: "Companies",   href: "/companies" },
  { name: "Internships", href: "/internships" },
  { name: "Resources",   href: "/resources" },
  { name: "Trending",    href: "/trending" },
  { name: "About",       href: "/about" },
  { name: "Submit",      href: "/submit" },
];

/* ─────────────────────────────────────────────────────────────
   CONSTELLATION CANVAS
   Tiny stars drift slowly; nearby ones connect with glowing
   lines. Cursor repels stars. Runs inside the pill background.
───────────────────────────────────────────────────────────── */
function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const frameRef  = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);
  const onMouseLeave = useCallback(() => { mouseRef.current = { x: -999, y: -999 }; }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    type Star = { x: number; y: number; vx: number; vy: number; r: number; opacity: number };
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const COUNT = 28;

    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 0.8 + Math.random() * 1.2,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    const tick = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      stars.forEach(s => {
        // Repel from cursor
        const dx = s.x - mx, dy = s.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 60) {
          s.vx += (dx / dist) * 0.06;
          s.vy += (dy / dist) * 0.06;
        }
        // Speed cap
        const spd = Math.hypot(s.vx, s.vy);
        if (spd > 0.5) { s.vx = (s.vx / spd) * 0.5; s.vy = (s.vy / spd) * 0.5; }

        s.x = (s.x + s.vx + w) % w;
        s.y = (s.y + s.vy + h) % h;

        // Draw star
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,250,${s.opacity})`;
        ctx.fill();
      });

      // Connection lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (d < 70) {
            const alpha = (1 - d / 70) * 0.25;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    const el = canvas.parentElement;
    el?.addEventListener("mousemove", onMouseMove, { passive: true });
    el?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      cancelAnimationFrame(frameRef.current);
      el?.removeEventListener("mousemove", onMouseMove);
      el?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   CHROMATIC ABERRATION LOGO WRAPPER
   On hover, two offset copies bloom outward with R and C tints
───────────────────────────────────────────────────────────── */
function ChromaLogo({ src }: { src: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Red channel */}
      <Image src={src} alt="" width={32} height={32}
        className="absolute inset-0 h-full w-full rounded-lg transition-all duration-200"
        style={{ transform: hovered ? "translate(-2px,0)" : "translate(0,0)", opacity: hovered ? 0.55 : 0, mixBlendMode: "screen", filter: "saturate(0) sepia(1) hue-rotate(-40deg) brightness(1.5)" }}
      />
      {/* Cyan channel */}
      <Image src={src} alt="" width={32} height={32}
        className="absolute inset-0 h-full w-full rounded-lg transition-all duration-200"
        style={{ transform: hovered ? "translate(2px,0)" : "translate(0,0)", opacity: hovered ? 0.55 : 0, mixBlendMode: "screen", filter: "saturate(0) sepia(1) hue-rotate(160deg) brightness(1.5)" }}
      />
      {/* Main */}
      <Image src={src} alt="" width={32} height={32} priority
        className="relative h-full w-full rounded-lg transition-all duration-300"
        style={{ filter: hovered ? "drop-shadow(0 0 12px rgba(59,130,246,0.8)) drop-shadow(0 0 24px rgba(99,102,241,0.5))" : "none", transform: hovered ? "scale(1.12)" : "scale(1)" }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOLOGRAPHIC ACTIVE CHIP
   Animated iridescent border + shimmer sweep inside
───────────────────────────────────────────────────────────── */
function HoloChip() {
  return (
    <>
      <style jsx>{`
        @keyframes holo-spin {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes holo-sweep {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(400%); }
        }
        @keyframes drawer-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(120%); opacity: 0; }
        }
      `}</style>
      {/* Spinning gradient border */}
      <span className="absolute -inset-[1px] -z-20 rounded-full"
        style={{
          background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#22d3ee,#a78bfa,#3b82f6)",
          backgroundSize: "300% 100%",
          animation: "holo-spin 2.8s linear infinite",
          filter: "blur(0.5px)",
          opacity: 0.75,
        }} />
      {/* Inner fill */}
      <span className="absolute inset-0 -z-10 rounded-full overflow-hidden"
        style={{ background: "linear-gradient(135deg,rgba(10,15,38,0.92),rgba(5,8,22,0.96))" }}>
        {/* Shine sweep */}
        <span className="absolute inset-y-0 w-1/3 pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)", animation: "holo-sweep 2.2s ease-in-out infinite" }} />
      </span>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────────────────────── */
function NavbarContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]                 = useState(false);
  const pathname  = usePathname();
  const { isSignedIn } = useUser();
  const pillRef   = useRef<HTMLDivElement>(null);
  const glowRef   = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) && href !== "#";
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  const handlePillMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!pillRef.current || !glowRef.current) return;
    const r = pillRef.current.getBoundingClientRect();
    glowRef.current.style.background =
      `radial-gradient(300px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(59,130,246,0.14), transparent 70%)`;
  };
  const handlePillMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  return (
    <>
      <nav className="sticky top-0 z-50 safe-top px-2 pt-3 pb-2 sm:px-4 sm:pt-4" aria-label="Main navigation">

        {/* Outer ambient blobs */}
        <div className="absolute left-1/2 -top-6 h-[130px] w-[min(560px,100vw)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute left-1/2 -top-2 h-[90px] w-[min(360px,80vw)] -translate-x-[55%] rounded-full bg-violet-500/7 blur-[80px] pointer-events-none" />

        <div
          ref={pillRef}
          onMouseMove={handlePillMouseMove}
          onMouseLeave={handlePillMouseLeave}
          className={cn(
            "relative max-w-7xl mx-auto overflow-hidden",
            "backdrop-blur-3xl",
            "rounded-full px-3 sm:px-6 h-14 sm:h-16",
            "flex items-center justify-between",
            "transition-all duration-500",
            scrolled
              ? "shadow-[0_14px_70px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.05),0_0_100px_rgba(59,130,246,.12)] border border-white/[0.09]"
              : "shadow-[0_6px_32px_rgba(0,0,0,.38),0_0_0_1px_rgba(255,255,255,.04)] border border-white/[0.07]",
          )}
          style={{ background: "linear-gradient(180deg,rgba(14,14,18,0.92),rgba(10,10,14,0.80))" }}
        >
          {/* Live constellation background */}
          <ConstellationCanvas />

          {/* Cursor glow */}
          <div ref={glowRef} className="absolute inset-0 z-0 rounded-full pointer-events-none mix-blend-screen transition-[background] duration-150" />

          {/* Scrolled — extra spinning border */}
          {scrolled && (
            <div className="absolute -inset-[1px] rounded-full -z-10 opacity-25 pointer-events-none"
              style={{
                background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#22d3ee,#3b82f6)",
                backgroundSize: "300% 100%",
                animation: "holo-spin 6s linear infinite",
              }} />
          )}

          {/* ── LEFT ── */}
          <div className="relative z-10 flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 text-sm font-bold tracking-tight text-white min-[375px]:text-base sm:text-lg">
              <ChromaLogo src="/images/logo/logo-dark.png" />
              <span className="max-w-[9rem] truncate min-[375px]:max-w-none">BigTechJournals</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link key={link.name} href={link.href}
                    className={cn(
                      "relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 xl:px-4 xl:text-sm",
                      active ? "text-white" : "text-white/45 hover:text-white/90 hover:bg-white/[0.05]",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-holo-chip"
                        className="absolute inset-0"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      >
                        <HoloChip />
                      </motion.span>
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            <Link href="/submit"
              className="hidden 2xl:block whitespace-nowrap px-4 py-2 text-sm font-medium text-white/38 transition-all duration-200 hover:rounded-full hover:bg-white/[0.06] hover:text-accent-blue">
              Submit Story
            </Link>

            <SearchButton />

            {isSignedIn ? (
              <div className="flex items-center gap-2 xl:gap-3">
                <Link href="/profile"
                  className="hidden whitespace-nowrap px-3 py-1.5 text-sm font-medium text-white/45 transition-colors hover:text-white xl:block">
                  Profile
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button type="button"
                  className="group relative hidden overflow-hidden whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] xl:block xl:px-6"
                  style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed,#0ea5e9)", boxShadow: "0 4px 20px rgba(37,99,235,0.42)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(37,99,235,0.65), 0 0 50px rgba(109,40,217,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.42)"; }}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.42)_50%,transparent_62%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <span className="relative z-10">Sign In</span>
                </button>
              </SignInButton>
            )}

            {/* Hamburger */}
            <button type="button"
              className="lg:hidden grid min-h-11 min-w-11 place-items-center rounded-full text-white/45 hover:text-white hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(59,130,246,0.18)] transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(o => !o)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span key="close"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(4,5,14,0.75)", backdropFilter: "blur(12px)" }}
              onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />

            {/* Drawer */}
            <motion.div key="drawer" id="mobile-nav-menu"
              initial={{ opacity: 0, scale: 0.96, y: -14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -14 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-2 top-[calc(env(safe-area-inset-top,0px)+4.75rem)] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl min-[375px]:inset-x-4 lg:hidden origin-top overflow-hidden"
              style={{
                background: "linear-gradient(155deg,rgba(9,12,32,0.97),rgba(4,6,18,0.99))",
                border: "1px solid rgba(96,165,250,0.12)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(96,165,250,0.06) inset",
              }}
            >
              {/* Spinning border ring on drawer */}
              <div className="absolute -inset-[1px] rounded-3xl -z-10 opacity-30"
                style={{
                  background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#22d3ee,#a78bfa,#3b82f6)",
                  backgroundSize: "300% 100%",
                  animation: "holo-spin 5s linear infinite",
                }} />

              {/* Vertical scan beam */}
              <div className="absolute inset-x-0 h-[2px] pointer-events-none"
                style={{
                  background: "linear-gradient(90deg,transparent,rgba(96,165,250,0.6),rgba(167,139,250,0.4),transparent)",
                  animation: "drawer-scan 3s ease-in-out infinite",
                }} />

              {/* Ambient orbs inside drawer */}
              <div className="absolute -top-20 right-0 w-48 h-48 rounded-full bg-blue-600/12 blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-violet-600/10 blur-[50px] pointer-events-none" />

              <div className="relative z-10 p-4 min-[375px]:p-5">

                {/* Drawer header */}
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.07]">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Navigation</span>
                </div>

                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div key={link.name}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}>
                        <Link href={link.href}
                          className={cn(
                            "relative flex items-center justify-between min-h-11 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 overflow-hidden",
                            active
                              ? "text-white"
                              : "text-white/60 hover:text-white hover:bg-white/[0.05]",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {active && (
                            <>
                              {/* Active bg */}
                              <span className="absolute inset-0 rounded-xl"
                                style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.18),rgba(124,58,237,0.12))", border: "1px solid rgba(96,165,250,0.2)" }} />
                              {/* Shine sweep */}
                              <span className="absolute inset-y-0 w-1/2 pointer-events-none rounded-xl"
                                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", animation: "holo-sweep 2.5s ease-in-out infinite" }} />
                            </>
                          )}
                          <span className="relative z-10">{link.name}</span>
                          {active && <ChevronRight className="relative z-10 w-4 h-4 text-blue-400/70 shrink-0" />}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Bottom actions */}
                  <div className="mt-4 pt-4 border-t border-white/[0.07] flex flex-col gap-2">
                    <Link href="/submit"
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Submit your Story
                      <ChevronRight className="w-4 h-4 opacity-28 shrink-0" />
                    </Link>

                    {!isSignedIn ? (
                      <SignInButton mode="modal">
                        <button type="button"
                          className="group relative w-full mt-1 overflow-hidden px-5 py-3.5 rounded-xl text-base font-semibold text-white active:scale-[0.98] transition-all duration-200"
                          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed,#0ea5e9)", boxShadow: "0 4px 24px rgba(37,99,235,0.38)" }}>
                          <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.38)_50%,transparent_62%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
                          <span className="relative z-10">Sign In</span>
                        </button>
                      </SignInButton>
                    ) : (
                      <Link href="/profile"
                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Profile
                        <ChevronRight className="w-4 h-4 opacity-28 shrink-0" />
                      </Link>
                    )}
                  </div>
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