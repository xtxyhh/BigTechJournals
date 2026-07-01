"use client";
import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { DEFAULT_IMAGES, safeImageUrl } from "@/lib/images";

interface HeroProps {
  spotlight?: {
    title: string;
    author: string;
    role: string;
    slug: string;
    coverImage: string;
  } | null;
  subtitle?: string;
}

const STATS = [
  { value: "63+", label: "Stories" },
  { value: "20,000+", label: "Audience" },
  { value: "Weekly", label: "Updates" },
];

/* ─────────────────────────────────────────────────────────────
   CANVAS AURORA MESH
   A live animated mesh of bezier-curved quads that responds
   to mouse position in real time — iridescent hue-shifted fill
───────────────────────────────────────────────────────────── */
function AuroraMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }, []);

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
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const COLS = 9, ROWS = 6;
    type Node = { bx: number; by: number; ox: number; oy: number; phase: number; speed: number };
    const nodes: Node[] = [];
    for (let r = 0; r <= ROWS; r++)
      for (let c = 0; c <= COLS; c++)
        nodes.push({ bx: 0, by: 0, ox: 0, oy: 0, phase: Math.random() * Math.PI * 2, speed: 0.28 + Math.random() * 0.55 });

    let t = 0;
    const tick = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      t += 0.007;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      nodes.forEach((n, i) => {
        n.bx = ((i % (COLS + 1)) / COLS) * w;
        n.by = (Math.floor(i / (COLS + 1)) / ROWS) * h;
        const dx = mx - n.bx / w, dy = my - n.by / h;
        const pull = Math.max(0, 0.32 - Math.hypot(dx, dy)) * 2.4;
        n.ox = Math.sin(t * n.speed + n.phase) * 20 + dx * pull * 65;
        n.oy = Math.cos(t * n.speed * 0.72 + n.phase) * 15 + dy * pull * 65;
      });

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tl = nodes[r * (COLS + 1) + c];
          const tr = nodes[r * (COLS + 1) + c + 1];
          const bl = nodes[(r + 1) * (COLS + 1) + c];
          const br = nodes[(r + 1) * (COLS + 1) + c + 1];
          const cx2 = (tl.bx + tl.ox + br.bx + br.ox) / 2;
          const cy2 = (tl.by + tl.oy + br.by + br.oy) / 2;
          const hue = (c / COLS) * 70 + (r / ROWS) * 45 + t * 22;
          const dist = Math.hypot(cx2 / w - mx, cy2 / h - my);
          const a = Math.max(0.018, 0.15 - dist * 0.28);

          const grd = ctx.createLinearGradient(tl.bx + tl.ox, tl.by + tl.oy, br.bx + br.ox, br.by + br.oy);
          grd.addColorStop(0, `hsla(${200 + hue},88%,66%,${a})`);
          grd.addColorStop(1, `hsla(${245 + hue},78%,62%,${a * 0.45})`);

          ctx.beginPath();
          ctx.moveTo(tl.bx + tl.ox, tl.by + tl.oy);
          ctx.lineTo(tr.bx + tr.ox, tr.by + tr.oy);
          ctx.lineTo(br.bx + br.ox, br.by + br.oy);
          ctx.lineTo(bl.bx + bl.ox, bl.by + bl.oy);
          ctx.closePath();
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.strokeStyle = `hsla(${210 + hue},80%,72%,${a * 0.55})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Cursor orb
      const gx = mx * w, gy = my * h;
      const orb = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.36);
      orb.addColorStop(0,   "rgba(59,130,246,0.16)");
      orb.addColorStop(0.4, "rgba(99,102,241,0.07)");
      orb.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, w, h);

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.9 }} />;
}

/* ─────────────────────────────────────────────────────────────
   CHROMATIC ABERRATION WORDMARK
   Three offset copies of the same text in R/G/B channels
   blend together — static layers pulse on a stagger
───────────────────────────────────────────────────────────── */
function ChromaText({ children }: { children: string }) {
  return (
    <span className="relative inline-block select-none" aria-label={children}>
      {/* Red/violet channel — left offset */}
      <span aria-hidden className="absolute inset-0 pointer-events-none" style={{
        WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text",
        backgroundImage: "linear-gradient(135deg,#f87171,#c084fc,#22d3ee)",
        transform: "translate(-2.5px,0.5px)", opacity: 0.45,
        mixBlendMode: "screen",
        animation: "chroma-r 4s ease-in-out infinite",
      }}>{children}</span>
      {/* Cyan channel — right offset */}
      <span aria-hidden className="absolute inset-0 pointer-events-none" style={{
        WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text",
        backgroundImage: "linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa)",
        transform: "translate(2.5px,-0.5px)", opacity: 0.45,
        mixBlendMode: "screen",
        animation: "chroma-c 4s ease-in-out 2s infinite",
      }}>{children}</span>
      {/* Main gradient */}
      <span style={{
        WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text",
        backgroundImage: "linear-gradient(135deg,#60a5fa 0%,#a78bfa 48%,#22d3ee 100%)",
        filter: "drop-shadow(0 0 36px rgba(96,165,250,0.7)) drop-shadow(0 0 70px rgba(167,139,250,0.4))",
      }}>{children}</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOLOGRAPHIC STAT CARD
   Each card has independent mouse-tracking tilt and a
   shimmering iridescent inner surface
───────────────────────────────────────────────────────────── */
function HoloStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    ref.current.style.transform    = `translateZ(60px) rotateX(${y * -22}deg) rotateY(${x * 22}deg)`;
    ref.current.style.boxShadow    = `${x * 10}px ${y * 10}px 36px rgba(96,165,250,0.18), 0 0 0 1px rgba(96,165,250,0.28) inset`;
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translateZ(60px) rotateX(0deg) rotateY(0deg)";
    ref.current.style.boxShadow = "0 0 0 1px rgba(96,165,250,0.10) inset, 0 8px 28px rgba(0,0,0,0.45)";
  };
  return (
    <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d" }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="relative cursor-default overflow-hidden rounded-2xl p-5 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(145deg,rgba(12,18,48,0.88),rgba(6,9,25,0.95))",
          boxShadow: "0 0 0 1px rgba(96,165,250,0.10) inset, 0 8px 28px rgba(0,0,0,0.45)",
          transform: "translateZ(60px)",
          transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
        }}>
        {/* Iridescent shimmer */}
        <div className="absolute inset-0 pointer-events-none opacity-25"
          style={{ background: "linear-gradient(135deg,rgba(96,165,250,0.2) 0%,transparent 45%,rgba(167,139,250,0.15) 100%)" }} />
        {/* Top edge glow */}
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(96,165,250,0.6),rgba(167,139,250,0.5),transparent)" }} />
        <div className="relative z-10 text-3xl font-extrabold" style={{
          WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text",
          backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa)",
          filter: "drop-shadow(0 0 14px rgba(96,165,250,0.55))",
        }}>{value}</div>
        <div className="relative z-10 mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────────────────────── */
export default function Hero({ spotlight, subtitle }: HeroProps) {
  const spotlightTitle = spotlight?.title ?? "How I cracked Morgan Stanley in 1st Year";
  const spotlightImage = safeImageUrl(spotlight?.coverImage, DEFAULT_IMAGES.storyCover);

  const sectionRef  = useRef<HTMLElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const orb1Ref     = useRef<HTMLDivElement>(null);
  const orb2Ref     = useRef<HTMLDivElement>(null);
  const orb3Ref     = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sec = sectionRef.current;
    if (!sec) return;
    const { left, top, width, height } = sec.getBoundingClientRect();
    const x  = (e.clientX - left) / width  - 0.5;
    const y  = (e.clientY - top)  / height - 0.5;
    const cx = e.clientX - left;
    const cy = e.clientY - top;

    if (glowRef.current) glowRef.current.style.background =
      `radial-gradient(720px circle at ${cx}px ${cy}px, rgba(37,99,235,0.09), transparent 68%)`;

    if (cardRef.current) cardRef.current.style.transform =
      `rotateX(${y * -7}deg) rotateY(${x * 9}deg)`;

    if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${x * 14}px,${y * 14}px)`;
    if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${x * -20}px,${y * -12}px)`;
    if (orb3Ref.current) orb3Ref.current.style.transform = `translate(${x * 30}px,${y * 20}px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (glowRef.current)  glowRef.current.style.background  = "transparent";
    if (cardRef.current)  cardRef.current.style.transform   = "rotateX(0deg) rotateY(0deg)";
    [orb1Ref, orb2Ref, orb3Ref].forEach(r => { if (r.current) r.current.style.transform = "translate(0,0)"; });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden bg-[#04050d] px-4 pb-16 pt-16 text-white sm:px-6 sm:pt-20 lg:pt-24"
      style={{ minHeight: "100svh" }}
    >
      <h1 className="sr-only">BigTechJournals — Your Roadmap to Big Tech</h1>

      {/* ── Live aurora mesh canvas ── */}
      <AuroraMesh />

      {/* ── Keyframes ── */}
      <style jsx>{`
        @keyframes particle-rise {
          0%   { transform: translateY(0) scale(1);     opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.55; }
          100% { transform: translateY(-88vh) scale(0.25); opacity: 0; }
        }
        @keyframes shimmer-scan {
          0%   { transform: translateX(-130%); }
          100% { transform: translateX(380%); }
        }
        @keyframes border-spin {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes chroma-r {
          0%,100% { opacity: 0.35; transform: translate(-2.5px,0.5px); }
          50%     { opacity: 0.6;  transform: translate(-3.5px,1px); }
        }
        @keyframes chroma-c {
          0%,100% { opacity: 0.35; transform: translate(2.5px,-0.5px); }
          50%     { opacity: 0.6;  transform: translate(3.5px,-1px); }
        }
      `}</style>

      {/* ── Cursor bloom ── */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 z-10 transition-[background] duration-200" />

      {/* ── Parallax orb layers ── */}
      <div ref={orb1Ref} className="pointer-events-none absolute inset-0 transition-transform duration-300 ease-out" style={{ willChange: "transform" }}>
        <div className="absolute -top-52 left-1/2 -translate-x-[58%] w-[900px] h-[650px] rounded-full bg-blue-700/15 blur-[200px]" />
        <div className="absolute top-1/3 -left-24 w-96 h-96 rounded-full bg-violet-700/10 blur-[130px]" />
      </div>
      <div ref={orb2Ref} className="pointer-events-none absolute inset-0 transition-transform duration-200 ease-out" style={{ willChange: "transform" }}>
        <div className="absolute top-1/4 -right-12 w-80 h-80 rounded-full bg-cyan-500/9 blur-[110px]" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full bg-indigo-600/10 blur-[90px]" />
      </div>
      <div ref={orb3Ref} className="pointer-events-none absolute inset-0 transition-transform duration-150 ease-out" style={{ willChange: "transform" }}>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full bg-blue-400/7 blur-[60px] animate-pulse" />
      </div>

      {/* ── Dot grid ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.032] [background-image:radial-gradient(circle,rgba(148,163,250,0.85)_1px,transparent_1px)] [background-size:30px_30px]" />

      {/* ── Floating particles ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width:  i % 4 === 0 ? "3px" : "2px",
              height: i % 4 === 0 ? "3px" : "2px",
              left: `${3 + (i * 4.1) % 94}%`,
              bottom: `${(i * 11) % 22}%`,
              background: i % 3 === 0 ? "rgba(167,139,250,0.65)" : i % 3 === 1 ? "rgba(96,165,250,0.5)" : "rgba(34,211,238,0.45)",
              animation: `particle-rise ${7 + (i % 6) * 1.3}s ${(i * 0.38) % 6}s linear infinite`,
              filter: "blur(0.4px)",
            }} />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 mx-auto grid max-w-7xl content-start items-center gap-10 sm:gap-12">

        {/* Text block */}
        <div className="mx-auto max-w-4xl text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/28 bg-blue-500/8 px-5 py-2 backdrop-blur-xl"
            style={{ boxShadow: "0 0 28px rgba(59,130,246,0.14), 0 0 0 1px rgba(59,130,246,0.10) inset" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
              Weekly stories from real engineers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <h2 className="text-5xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[5.5rem]">
              Your Roadmap to{" "}
              <ChromaText>Big&#8209;Tech</ChromaText>
              <span className="text-white">!</span>
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-2xl px-1 text-base leading-7 text-white/45 sm:text-lg"
          >
            {subtitle ?? "Real stories, internships, resources and roadmaps from engineers at Google, Microsoft, Amazon, Adobe and more. Everything you need to move with conviction."}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            {/* Primary */}
            <Link href="/stories"
              className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-px active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#2563eb 0%,#6d28d9 55%,#0ea5e9 100%)", boxShadow: "0 4px 30px rgba(37,99,235,0.52), 0 0 0 1px rgba(96,165,250,0.18) inset" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 44px rgba(37,99,235,0.72), 0 0 64px rgba(109,40,217,0.32), 0 0 0 1px rgba(96,165,250,0.32) inset"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 30px rgba(37,99,235,0.52), 0 0 0 1px rgba(96,165,250,0.18) inset"; }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.42)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-2">
                Start Reading
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Secondary */}
            <Link href="/trending"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/72 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/35 hover:bg-white/8 hover:text-white hover:shadow-[0_0_26px_rgba(59,130,246,0.18)]"
            >
              Explore Stories <BookOpen className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            </Link>

            {/* Tertiary */}
            <Link href="/stories?search=journey"
              className="group hidden min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/72 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/35 hover:bg-white/8 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.18)] sm:inline-flex"
            >
              Watch Journeys <PlayCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            </Link>
          </motion.div>
        </div>

        {/* ── Spotlight card ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-6xl"
          style={{ perspective: "1500px" }}
        >
          {/* Spinning gradient border ring */}
          <div className="absolute -inset-[1.5px] rounded-[34px] -z-10"
            style={{
              background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#22d3ee,#a78bfa,#3b82f6)",
              backgroundSize: "300% 100%",
              animation: "border-spin 4s linear infinite",
              filter: "blur(1px)", opacity: 0.65,
            }} />
          {/* Depth glow */}
          <div className="absolute -inset-8 rounded-[52px] bg-blue-600/7 blur-3xl -z-20" />
          <div className="absolute -inset-3 rounded-[40px] bg-violet-500/5 blur-xl -z-20" />

          {/* 3D tilt wrapper */}
          <div ref={cardRef} style={{ transformStyle: "preserve-3d", transition: "transform 0.32s cubic-bezier(0.23,1,0.32,1)" }}>
            <Link href={spotlight ? `/stories/${spotlight.slug}` : "/stories"} className="group relative block">

              {/* Card shell */}
              <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] p-3"
                style={{
                  background: "linear-gradient(155deg,rgba(9,14,36,0.98) 0%,rgba(4,7,20,0.99) 100%)",
                  boxShadow: "0 44px 110px rgba(0,0,0,0.75), 0 0 0 1px rgba(96,165,250,0.09) inset, 0 1px 0 rgba(255,255,255,0.04) inset",
                }}>

                {/* Image zone */}
                <div className="relative aspect-[16/8] overflow-hidden rounded-[24px]">
                  <Image src={spotlightImage} alt={spotlightTitle} fill priority
                    sizes="(max-width: 768px) 100vw, 1400px"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/94 via-black/58 to-black/14" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-950/52 to-transparent" />

                  {/* Hover scan line */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                    <div className="absolute inset-y-0 w-[28%]"
                      style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)", animation: "shimmer-scan 2.1s ease-in-out infinite" }} />
                  </div>

                  {/* Left content */}
                  <div className="absolute left-6 top-6 max-w-xl sm:left-10 sm:top-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/28 bg-blue-500/11 px-4 py-1.5 backdrop-blur-md"
                      style={{ boxShadow: "0 0 22px rgba(59,130,246,0.18)" }}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">Weekly Spotlight</span>
                    </div>

                    <div className="my-4 h-px w-28"
                      style={{ background: "linear-gradient(90deg,rgba(96,165,250,0.82),rgba(167,139,250,0.45),transparent)" }} />

                    <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] sm:text-4xl lg:text-5xl">
                      {spotlightTitle}
                    </h2>
                    <p className="mt-3 text-sm text-white/52 sm:text-base">
                      {spotlight ? `${spotlight.author} · ${spotlight.role}` : "Featured Engineer"}
                    </p>

                    {/* Read CTA */}
                    <div className="group/btn relative mt-7 inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-sm font-bold text-white transition-all duration-300"
                      style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", boxShadow: "0 4px 24px rgba(37,99,235,0.46)" }}>
                      <span className="pointer-events-none absolute inset-0 -translate-x-full [background:linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.38)_50%,transparent_62%)] transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
                      <span className="relative z-10">Read Full Story</span>
                      <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </div>
                  </div>

                  {/* Holographic stat cards — only desktop */}
                  <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
                    style={{ transformStyle: "preserve-3d" }}>
                    {STATS.map((s, i) => (
                      <HoloStat key={s.label} value={s.value} label={s.label} delay={0.78 + i * 0.13} />
                    ))}
                  </div>
                </div>

                {/* Animated bottom rail */}
                <div className="relative mt-3 h-[2px] w-full overflow-hidden rounded-full">
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent 0%,rgba(96,165,250,0.55) 28%,rgba(167,139,250,0.5) 58%,rgba(34,211,238,0.42) 84%,transparent 100%)" }} />
                  <div className="absolute inset-y-0 w-1/4"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)", animation: "shimmer-scan 2.6s ease-in-out infinite" }} />
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* ── Mobile stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-8 xl:hidden"
        >
          {STATS.map(({ value, label }, i) => (
            <React.Fragment key={label}>
              <div className="text-center">
                <p className="text-xl font-extrabold sm:text-2xl"
                  style={{
                    WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text",
                    backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa)",
                    filter: "drop-shadow(0 0 10px rgba(96,165,250,0.42))",
                  }}>{value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/32">{label}</p>
              </div>
              {i < 2 && <div className="h-8 w-px bg-white/[0.07]" />}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}